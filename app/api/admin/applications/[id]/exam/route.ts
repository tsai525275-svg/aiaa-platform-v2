import { NextRequest, NextResponse } from "next/server";
import { assertAdminRequest, getApplicationExamPackage, jsonError } from "@/lib/server/aiaa-admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

async function readParams(context: RouteContext) {
  return Promise.resolve(context.params);
}

export async function GET(request: NextRequest, context: RouteContext) {
  const authError = assertAdminRequest(request);
  if (authError) return authError;

  try {
    const { id } = await readParams(context);
    const payload = await getApplicationExamPackage(id);
    return NextResponse.json({
      ok: true,
      ...payload
    });
  } catch (error) {
    return jsonError(500, error instanceof Error ? error.message : "Unable to load exam package.");
  }
}
