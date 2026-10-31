
import { NextResponse } from "next/server";
import { backendRequest } from "@/lib/server/backend";

export async function GET() {
  try {
    const response = await backendRequest("/api/v1/auth/me");
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to load user profile.",
      },
      { status: 502 }
    );
  }
}
