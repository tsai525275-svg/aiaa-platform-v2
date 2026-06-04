import { NextRequest, NextResponse } from "next/server";
import {
  assertAdminRequest,
  buildCertificateId,
  certificateExpiryForLevel,
  createReviewerAction,
  getApplicationById,
  jsonError,
  parseActionBody,
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

const actionConfig: Record<string, { action: string; apply: (args: { note: string; actorId: string; now: string; certificateId: string; certificateExpiresAt: string; }) => Record<string, unknown> }> = {
  "precheck-approve": {
    action: "precheck_approved",
    apply: ({ note }) => ({
      precheck_status: "approved",
      precheck_note: note,
      exam_access_status: "unlocked",
      status: "exam",
      stage: "Exam"
    })
  },
  "precheck-reject": {
    action: "precheck_rejected",
    apply: ({ note }) => ({
      precheck_status: "rejected",
      precheck_note: note,
      exam_access_status: "locked",
      status: "rejected",
      stage: "Application"
    })
  },
  "revision-required": {
    action: "revision_required",
    apply: ({ note }) => ({
      review_status: "revision_required",
      review_note: note,
      review_decision: "revision_required",
      certificate_status: "not_issued",
      status: "under_review",
      stage: "Review"
    })
  },
  "review-approve": {
    action: "review_approved",
    apply: ({ note, now }) => ({
      review_status: "approved",
      review_note: note,
      review_decision: "approved",
      reviewed_at: now,
      certificate_status: "ready",
      status: "under_review",
      stage: "Certificate"
    })
  },
  "review-reject": {
    action: "review_rejected",
    apply: ({ note, now }) => ({
      review_status: "rejected",
      review_note: note,
      review_decision: "rejected",
      reviewed_at: now,
      certificate_status: "not_issued",
      status: "rejected",
      stage: "Review"
    })
  },
  "issue-certificate": {
    action: "certificate_issued",
    apply: ({ note, now, certificateId, certificateExpiresAt }) => ({
      review_status: "approved",
      review_note: note,
      review_decision: "approved",
      reviewed_at: now,
      certificate_status: "issued",
      certificate_id: certificateId,
      certificate_issued_at: now,
      certificate_expires_at: certificateExpiresAt,
      ranking_eligibility_status: "eligible",
      next_level_unlocked: true,
      status: "approved",
      stage: "Ranking"
    })
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
    const existing = await getApplicationById(id);
    const now = new Date().toISOString();
    const certificateId = buildCertificateId(existing);
    const certificateExpiresAt = certificateExpiryForLevel(existing.target_level, now);

    const application = await updateApplication(
      id,
      config.apply({
        note: parsed.note,
        actorId: parsed.actorId,
        now,
        certificateId,
        certificateExpiresAt
      })
    );

    const reviewerAction = await createReviewerAction({
      application,
      action: config.action,
      note: parsed.note,
      actorId: parsed.actorId,
      metadata: parsed.metadata
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
