import { NextRequest, NextResponse } from "next/server";
import {
  AdminApplication,
  assertAdminRequest,
  createMemberNotification,
  getApplicationById,
  jsonError,
  parseActionBody,
  queueEmailHook
} from "@/lib/server/aiaa-admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: NextRequest) {
  const authError = assertAdminRequest(request);
  if (authError) return authError;

  try {
    const body = await request.json().catch(() => ({}));
    const parsed = parseActionBody(body);
    const payload = typeof body === "object" && body ? (body as Record<string, unknown>) : {};
    const applicationId = typeof payload.applicationId === "string" ? payload.applicationId.trim() : "";
    const userIdFromBody = typeof payload.userId === "string" ? payload.userId.trim() : "";
    const type = typeof payload.type === "string" ? payload.type.trim() : "admin_notification";
    const title = typeof payload.title === "string" ? payload.title.trim() : "";
    const message = typeof payload.message === "string" ? payload.message.trim() : "";
    const link = typeof payload.link === "string" ? payload.link.trim() : "";
    const subject = typeof payload.subject === "string" ? payload.subject.trim() : title;

    if (!title || !message) {
      return jsonError(400, "title and message are required.");
    }

    let application: AdminApplication | null = null;
    if (applicationId) {
      application = await getApplicationById(applicationId);
    }

    const userId = application?.user_id || userIdFromBody;
    if (!userId) {
      return jsonError(400, "applicationId or userId is required.");
    }

    await createMemberNotification({
      userId,
      type,
      title,
      message,
      link,
      metadata: {
        ...(parsed.metadata || {}),
        ...(applicationId ? { application_id: applicationId } : {})
      }
    });

    const email = await queueEmailHook({
      application,
      userId,
      type,
      subject,
      body: message,
      payload: {
        ...(parsed.metadata || {}),
        link
      }
    });

    return NextResponse.json({
      ok: true,
      notification: {
        userId,
        type,
        title,
        link
      },
      email
    });
  } catch (error) {
    return jsonError(500, error instanceof Error ? error.message : "Unable to send notification.");
  }
}
