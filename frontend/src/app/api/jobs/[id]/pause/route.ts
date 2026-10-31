import { NextResponse } from "next/server";
import { backendRequest } from "@/lib/server/backend";

type Context = {
  params: Promise<{ id: string }>;
};

export async function POST(
  _request: Request,
  context: Context
) {
  try {
    const { id } = await context.params;
    const response = await backendRequest(
      `/api/v1/jobs/${id}/pause`,
      { method: "POST" }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Backend unavailable" },
      { status: 502 }
    );
  }
}