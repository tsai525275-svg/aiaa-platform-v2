import { NextRequest, NextResponse } from "next/server";
import {
  assertAdminRequest,
  buildCertificateId,
  certificateExpiryForLevel,
  certificationPassingScore,
  createMemberNotification,
  createReviewerAction,
  getApplicationExamPackage,
  jsonGuardrailError,
  jsonError,
  parseActionBody,
  summarizeApplicationState,
  syncIssuedCertificateToProfile,
  updateApplication
} from "@/lib/server/aiaa-admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteContext = {
  params: Promise<{ id: string; action: string }> | { id: string; action: string };
};

async function readParams(context: RouteContext) {
  return Promise.resolve(context.params);
}

type ParsedActionBody = ReturnType<typeof parseActionBody>;
type ExamPackage = Awaited<ReturnType<typeof getApplicationExamPackage>>;

type ActionConfig = {
  action: string;
  overrideAction?: string;
  successMessage?: string;
  apply: (args: {
    parsed: ParsedActionBody;
    now: string;
    certificateId: string;
    certificateExpiresAt: string;
  }) => Record<string, unknown>;
  notification?: (args: {
    application: ExamPackage["application"];
    parsed: ParsedActionBody;
  }) => {
    type: string;
    title: string;
    message: string;
    link?: string;
    metadata?: Record<string, unknown>;
  };
  validate?: (args: {
    existing: ExamPackage["application"];
    examPackage: ExamPackage;
    parsed: ParsedActionBody;
  }) => ReturnType<typeof jsonGuardrailError> | null;
};

function hasText(value: string | null | undefined) {
  return Boolean(String(value || "").trim());
}

function hasLevelOnePrecheckEvidence(application: ExamPackage["application"]) {
  return hasText(application.github_repo) && (hasText(application.readme_url) || hasText(application.evidence_summary));
}

function hasLevelTwoPlusPrecheckEvidence(application: ExamPackage["application"]) {
  return (
    hasText(application.github_repo) &&
    (hasText(application.readme_url) || hasText(application.evidence_summary)) &&
    (hasText(application.demo_url) || hasText(application.video_url))
  );
}

function hasReviewEvidence(application: ExamPackage["application"]) {
  return (
    hasText(application.github_repo) &&
    hasText(application.readme_url) &&
    hasText(application.demo_url) &&
    hasText(application.evidence_summary)
  );
}

function countNonEmptyAnswerValues(answers: Record<string, string> | undefined) {
  return Object.values(answers || {}).filter((value) => hasText(value)).length;
}

function hasSufficientPracticalEvidence(examPackage: ExamPackage) {
  return examPackage.examAnswers.some((answer) => countNonEmptyAnswerValues(answer.answers) >= 3);
}

function requireHumanOverride(parsed: ParsedActionBody, application: ExamPackage["application"], message: string) {
  if (!parsed.humanOverride) {
    return jsonGuardrailError({
      errorCode: "HUMAN_OVERRIDE_REQUIRED",
      message,
      requiredFields: ["human_override", "override_reason", "reviewer_id"],
      currentState: summarizeApplicationState(application)
    });
  }

  if (!hasText(parsed.overrideReason) || !hasText(parsed.reviewerId)) {
    return jsonGuardrailError({
      errorCode: "INVALID_HUMAN_OVERRIDE",
      message: "human_override requires override_reason and reviewer_id.",
      requiredFields: ["human_override", "override_reason", "reviewer_id"],
      currentState: summarizeApplicationState(application)
    });
  }

  return null;
}

function validatePrecheckApprove(existing: ExamPackage["application"]) {
  const missingFields: string[] = [];
  const normalizedStatus = String(existing.status || "").trim().toLowerCase();
  const allowedStatuses = new Set(["submitted", "pending"]);

  if (!existing.target_level || existing.target_level < 1) {
    missingFields.push("target_level");
  }

  if (!allowedStatuses.has(normalizedStatus)) {
    missingFields.push("status=submitted|pending");
  }

  if (existing.precheck_status === "approved") {
    missingFields.push("precheck_status!=approved");
  }

  if (existing.exam_access_status === "unlocked") {
    missingFields.push("exam_access_status!=unlocked");
  }

  if (!hasText(existing.agent_name)) {
    missingFields.push("agent_name");
  }

  if (!hasText(existing.contact_email)) {
    missingFields.push("contact_email");
  }

  if (!hasText(existing.github_repo)) {
    missingFields.push("github_repo");
  }

  if (!hasText(existing.readme_url) && !hasText(existing.evidence_summary)) {
    missingFields.push("readme_url|evidence_summary");
  }

  if (missingFields.length > 0) {
    return jsonGuardrailError({
      errorCode: "PRECHECK_REQUIREMENTS_NOT_MET",
      message:
        "Precheck approval requires target level, a pending/submitted application state, contact metadata, and baseline evidence.",
      requiredFields: [
        "target_level",
        "status=submitted|pending",
        "precheck_status!=approved",
        "exam_access_status!=unlocked",
        "agent_name",
        "contact_email",
        "github_repo",
        "readme_url|evidence_summary"
      ],
      missingFields,
      currentState: summarizeApplicationState(existing)
    });
  }

  if (existing.target_level === 1 && !hasLevelOnePrecheckEvidence(existing)) {
    return jsonGuardrailError({
      errorCode: "PRECHECK_REQUIREMENTS_NOT_MET",
      message: "Level 1 precheck approval requires github_repo and either readme_url or evidence_summary.",
      requiredFields: ["github_repo", "readme_url|evidence_summary"],
      missingFields: ["github_repo", "readme_url|evidence_summary"].filter((field) => {
        if (field === "github_repo") return !hasText(existing.github_repo);
        return !hasText(existing.readme_url) && !hasText(existing.evidence_summary);
      }),
      currentState: summarizeApplicationState(existing)
    });
  }

  if (existing.target_level >= 2 && !hasLevelTwoPlusPrecheckEvidence(existing)) {
    return jsonGuardrailError({
      errorCode: "PRECHECK_REQUIREMENTS_NOT_MET",
      message:
        "Level 2 and above cannot be precheck-approved with insufficient evidence. Use revision-required instead.",
      requiredFields: ["github_repo", "readme_url|evidence_summary", "demo_url|video_url"],
      missingFields: [
        !hasText(existing.github_repo) ? "github_repo" : null,
        !hasText(existing.readme_url) && !hasText(existing.evidence_summary) ? "readme_url|evidence_summary" : null,
        !hasText(existing.demo_url) && !hasText(existing.video_url) ? "demo_url|video_url" : null
      ].filter(Boolean) as string[],
      currentState: summarizeApplicationState(existing)
    });
  }

  return null;
}

function validateRevisionRequired(existing: ExamPackage["application"], parsed: ParsedActionBody) {
  const revisionNote = parsed.revisionReason || parsed.note;
  if (!hasText(revisionNote)) {
    return jsonGuardrailError({
      errorCode: "REVISION_REASON_REQUIRED",
      message: "revision-required requires revision_reason or note.",
      requiredFields: ["revision_reason|note"],
      missingFields: ["revision_reason|note"],
      currentState: summarizeApplicationState(existing)
    });
  }

  return null;
}

function validatePrecheckReject(existing: ExamPackage["application"], parsed: ParsedActionBody) {
  const rejectNote = parsed.rejectReason || parsed.note;
  if (!hasText(rejectNote)) {
    return jsonGuardrailError({
      errorCode: "REJECT_REASON_REQUIRED",
      message: "precheck-reject requires reject_reason or note.",
      requiredFields: ["reject_reason|note"],
      missingFields: ["reject_reason|note"],
      currentState: summarizeApplicationState(existing)
    });
  }

  return null;
}

function validateReviewApprove(existing: ExamPackage["application"], examPackage: ExamPackage, parsed: ParsedActionBody) {
  if (!hasReviewEvidence(existing)) {
    return jsonGuardrailError({
      errorCode: "REVIEW_EVIDENCE_MISSING",
      message: "Review approval requires github_repo, readme_url, demo_url, and evidence_summary.",
      requiredFields: ["github_repo", "readme_url", "demo_url", "evidence_summary"],
      currentState: summarizeApplicationState(existing)
    });
  }

  if (!hasSufficientPracticalEvidence(examPackage) && !parsed.humanOverride) {
    return jsonGuardrailError({
      errorCode: "PRACTICAL_EVIDENCE_INSUFFICIENT",
      message: "Practical evidence is insufficient. review-approve requires stronger evidence or a human override.",
      requiredFields: ["human_override", "override_reason", "reviewer_id"],
      currentState: summarizeApplicationState(existing)
    });
  }

  const threshold = certificationPassingScore(existing.target_level);
  if (existing.target_level >= 4) {
    const overrideError = requireHumanOverride(
      parsed,
      existing,
      `Level ${existing.target_level} approval requires manual review with an explicit human override.`
    );
    if (overrideError) return overrideError;
  }

  if ((existing.exam_auto_pass !== true || threshold === null || (existing.exam_score_percent ?? -1) < threshold) && !parsed.humanOverride) {
    return jsonGuardrailError({
      errorCode: "EXAM_REQUIREMENTS_NOT_MET",
      message: `Review approval requires exam_auto_pass=true and exam_score_percent >= ${threshold ?? "manual threshold"} unless human_override=true.`,
      requiredFields: ["exam_auto_pass", "exam_score_percent", "human_override", "override_reason", "reviewer_id"],
      currentState: summarizeApplicationState(existing)
    });
  }

  if (parsed.humanOverride) {
    const overrideError = requireHumanOverride(
      parsed,
      existing,
      "human_override for review-approve requires override_reason and reviewer_id."
    );
    if (overrideError) return overrideError;
  }

  return null;
}

function validateIssueCertificate(existing: ExamPackage["application"], parsed: ParsedActionBody) {
  if (existing.review_status === "pending" || existing.review_status === "rejected" || existing.review_status === "revision_required") {
    return jsonGuardrailError({
      errorCode: "INVALID_REVIEW_STATE",
      message: "Cannot issue a certificate for pending, rejected, or revision_required applications.",
      requiredFields: ["review_status=approved"],
      currentState: summarizeApplicationState(existing)
    });
  }

  if (existing.certificate_status === "issued") {
    return jsonGuardrailError({
      errorCode: "CERTIFICATE_ALREADY_ISSUED",
      message: "Cannot issue a certificate when certificate_status is already issued.",
      requiredFields: [],
      currentState: summarizeApplicationState(existing)
    });
  }

  if (existing.review_status !== "approved") {
    return jsonGuardrailError({
      errorCode: "REVIEW_NOT_APPROVED",
      message: "issue-certificate requires review_status=approved.",
      requiredFields: ["review_status=approved", "certificate_status=ready"],
      currentState: summarizeApplicationState(existing)
    });
  }

  if (existing.certificate_status !== "ready") {
    return jsonGuardrailError({
      errorCode: "CERTIFICATE_NOT_READY",
      message: "issue-certificate requires certificate_status=ready.",
      requiredFields: ["certificate_status=ready"],
      currentState: summarizeApplicationState(existing)
    });
  }

  const combinedNote = parsed.note || existing.review_note || existing.review_notes || "";
  if (!hasText(combinedNote)) {
    return jsonGuardrailError({
      errorCode: "REVIEWER_NOTE_REQUIRED",
      message: "issue-certificate requires a reviewer note.",
      requiredFields: ["note|review_note"],
      currentState: summarizeApplicationState(existing)
    });
  }

  if (existing.exam_auto_pass !== true && !parsed.humanOverride) {
    return jsonGuardrailError({
      errorCode: "EXAM_AUTO_PASS_REQUIRED",
      message: "issue-certificate requires exam_auto_pass=true unless human_override=true.",
      requiredFields: ["exam_auto_pass", "human_override", "override_reason", "reviewer_id"],
      currentState: summarizeApplicationState(existing)
    });
  }

  if (parsed.humanOverride) {
    const overrideError = requireHumanOverride(
      parsed,
      existing,
      "human_override for issue-certificate requires override_reason and reviewer_id."
    );
    if (overrideError) return overrideError;
  }

  return null;
}

const actionConfig: Record<string, ActionConfig> = {
  "precheck-approve": {
    action: "precheck_approved",
    successMessage: "Precheck approved. Exam access is now unlocked.",
    apply: ({ parsed }) => ({
      precheck_status: "approved",
      precheck_note: parsed.note,
      exam_access_status: "unlocked",
      status: "exam",
      stage: "Exam"
    }),
    notification: ({ application }) => ({
      type: "precheck_approved",
      title: "AIAA precheck approved",
      message: "Your application passed precheck. Your exam access is now unlocked.",
      link: "/member/applications",
      metadata: {
        application_id: application.id,
        target_level: application.target_level
      }
    }),
    validate: ({ existing }) => validatePrecheckApprove(existing)
  },
  "precheck-reject": {
    action: "precheck_rejected",
    successMessage: "Precheck rejected. Exam access remains locked.",
    apply: ({ parsed }) => ({
      precheck_status: "rejected",
      precheck_note: parsed.rejectReason || parsed.note,
      exam_access_status: "locked",
      status: "rejected",
      stage: "Application"
    }),
    notification: ({ application, parsed }) => ({
      type: "precheck_rejected",
      title: "AIAA precheck rejected",
      message: parsed.rejectReason || parsed.note || "Your application did not pass precheck.",
      link: "/member/applications",
      metadata: {
        application_id: application.id,
        target_level: application.target_level
      }
    }),
    validate: ({ existing, parsed }) => validatePrecheckReject(existing, parsed)
  },
  "revision-required": {
    action: "revision_required",
    successMessage: "Revision requested. Exam access remains locked until the application is updated.",
    apply: ({ parsed }) => ({
      review_status: "revision_required",
      review_note: parsed.revisionReason || parsed.note,
      review_decision: "revision_required",
      status: "under_review",
      stage: "Review"
    }),
    notification: ({ application, parsed }) => ({
      type: "revision_required",
      title: "AIAA revision required",
      message: parsed.revisionReason || parsed.note || "Your application needs more evidence before it can proceed.",
      link: "/member/applications",
      metadata: {
        application_id: application.id,
        target_level: application.target_level
      }
    }),
    validate: ({ existing, parsed }) => validateRevisionRequired(existing, parsed)
  },
  "review-approve": {
    action: "review_approved",
    overrideAction: "review_approved_human_override",
    apply: ({ parsed, now }) => ({
      review_status: "approved",
      review_note: parsed.note,
      review_decision: "approved",
      reviewer_id: parsed.reviewerId || null,
      reviewed_at: now,
      certificate_status: "ready",
      status: "under_review",
      stage: "Certificate"
    }),
    validate: ({ existing, examPackage, parsed }) => validateReviewApprove(existing, examPackage, parsed)
  },
  "review-reject": {
    action: "review_rejected",
    apply: ({ parsed, now }) => ({
      review_status: "rejected",
      review_note: parsed.note,
      review_decision: "rejected",
      reviewer_id: parsed.reviewerId || null,
      reviewed_at: now,
      certificate_status: "not_issued",
      status: "rejected",
      stage: "Review"
    })
  },
  "issue-certificate": {
    action: "certificate_issued",
    overrideAction: "certificate_issued_human_override",
    apply: ({ parsed, now, certificateId, certificateExpiresAt }) => ({
      review_status: "approved",
      review_note: parsed.note,
      review_decision: "approved",
      reviewer_id: parsed.reviewerId || null,
      reviewed_at: now,
      certificate_status: "issued",
      certificate_id: certificateId,
      certificate_issued_at: now,
      certificate_expires_at: certificateExpiresAt,
      ranking_eligibility_status: "eligible",
      next_level_unlocked: true,
      status: "approved",
      stage: "Ranking"
    }),
    validate: ({ existing, parsed }) => validateIssueCertificate(existing, parsed)
  }
};

export async function POST(request: NextRequest, context: RouteContext) {
  const authError = assertAdminRequest(request);
  if (authError) return authError;

  try {
    const { id, action } = await readParams(context);
    const config = actionConfig[action];

    if (!config) {
      return jsonError(404, "Unknown admin action.");
    }

    const body = await request.json().catch(() => ({}));
    const parsed = parseActionBody(body);
    const examPackage = await getApplicationExamPackage(id);
    const existing = examPackage.application;
    const validationError = config.validate?.({
      existing,
      examPackage,
      parsed
    });
    if (validationError) {
      return validationError;
    }

    const now = new Date().toISOString();
    const certificateId = buildCertificateId(existing);
    const certificateExpiresAt = certificateExpiryForLevel(existing.target_level, now);

    const application = await updateApplication(
      id,
      config.apply({
        parsed,
        now,
        certificateId,
        certificateExpiresAt
      })
    );

    const reviewerActionType = parsed.humanOverride && config.overrideAction
      ? config.overrideAction
      : config.action;

    const reviewerActionNote =
      parsed.overrideReason ||
      parsed.revisionReason ||
      parsed.rejectReason ||
      parsed.note;

    const reviewerAction = await createReviewerAction({
      application,
      action: reviewerActionType,
      note: reviewerActionNote,
      actorId: parsed.reviewerId || parsed.actorId,
      metadata: {
        ...parsed.metadata,
        human_override: parsed.humanOverride,
        override_reason: parsed.overrideReason || null,
        reviewer_id: parsed.reviewerId || null,
        base_action: config.action
      }
    });

    const notification = config.notification
      ? await createMemberNotification({
          userId: application.user_id,
          ...config.notification({
            application,
            parsed
          })
        })
      : null;

    if (action === "issue-certificate") {
      await syncIssuedCertificateToProfile(application);
    }

    const currentState = summarizeApplicationState(application);

    return NextResponse.json({
      ok: true,
      action: config.action,
      application_id: application.id,
      current_state: currentState,
      reviewer_action_id: reviewerAction?.id || null,
      notification_id: notification?.id || null,
      message: config.successMessage || `${config.action} completed.`,
      application,
      reviewerAction,
      notification
    });
  } catch (error) {
    return jsonError(500, error instanceof Error ? error.message : "Admin action failed.");
  }
}
