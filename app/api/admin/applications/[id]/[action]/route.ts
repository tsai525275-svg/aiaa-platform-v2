import { NextRequest, NextResponse } from "next/server";
import {
  assertAdminRequest,
  buildCertificateId,
  certificateExpiryForLevel,
  certificationPassingScore,
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
  apply: (args: {
    parsed: ParsedActionBody;
    now: string;
    certificateId: string;
    certificateExpiresAt: string;
  }) => Record<string, unknown>;
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
  if (existing.target_level === 1 && !hasLevelOnePrecheckEvidence(existing)) {
    return jsonGuardrailError({
      errorCode: "PRECHECK_EVIDENCE_MISSING",
      message: "Level 1 precheck approval requires github_repo and either readme_url or evidence_summary.",
      requiredFields: ["github_repo", "readme_url|evidence_summary"],
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
    apply: ({ parsed }) => ({
      precheck_status: "approved",
      precheck_note: parsed.note,
      exam_access_status: "unlocked",
      status: "exam",
      stage: "Exam"
    }),
    validate: ({ existing }) => validatePrecheckApprove(existing)
  },
  "precheck-reject": {
    action: "precheck_rejected",
    apply: ({ parsed }) => ({
      precheck_status: "rejected",
      precheck_note: parsed.note,
      exam_access_status: "locked",
      status: "rejected",
      stage: "Application"
    })
  },
  "revision-required": {
    action: "revision_required",
    apply: ({ parsed }) => ({
      review_status: "revision_required",
      review_note: parsed.note,
      review_decision: "revision_required",
      certificate_status: "not_issued",
      status: "under_review",
      stage: "Review"
    })
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

    const reviewerAction = await createReviewerAction({
      application,
      action: reviewerActionType,
      note: parsed.overrideReason || parsed.note,
      actorId: parsed.reviewerId || parsed.actorId,
      metadata: {
        ...parsed.metadata,
        human_override: parsed.humanOverride,
        override_reason: parsed.overrideReason || null,
        reviewer_id: parsed.reviewerId || null,
        base_action: config.action
      }
    });

    if (action === "issue-certificate") {
      await syncIssuedCertificateToProfile(application);
    }

    return NextResponse.json({
      ok: true,
      action: config.action,
      application,
      reviewerAction
    });
  } catch (error) {
    return jsonError(500, error instanceof Error ? error.message : "Admin action failed.");
  }
}
