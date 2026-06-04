import { NextRequest, NextResponse } from "next/server";
import { assertAdminRequest, jsonError, listAdminApplications } from "@/lib/server/aiaa-admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const authError = assertAdminRequest(request);
  if (authError) return authError;

  try {
    const applications = await listAdminApplications();
    return NextResponse.json({
      ok: true,
      applications
    });
  } catch (error) {
    return jsonError(500, error instanceof Error ? error.message : "Unable to list applications.");
  }
}
