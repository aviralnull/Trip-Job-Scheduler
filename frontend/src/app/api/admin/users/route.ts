import { NextRequest, NextResponse } from "next/server";
import { backendRequest } from "@/lib/server/backend";

export async function GET() {
  try {
    const response = await backendRequest("/api/v1/admin/users");
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error
          ? error.message
          : "Unable to load users",
      },
      { status: 502 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    if (
      typeof body.id !== "string" ||
      !["ADMIN", "OPERATOR", "EMPLOYEE"].includes(body.role) ||
      typeof body.enabled !== "boolean"
    ) {
      return NextResponse.json(
        { message: "Invalid user update request." },
        { status: 400 }
      );
    }

    const response = await backendRequest(
      `/api/v1/admin/users/${encodeURIComponent(body.id)}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          role: body.role,
          enabled: body.enabled,
        }),
      }
    );

    const data = await response.json().catch(() => ({}));

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error
          ? error.message
          : "Unable to update user",
      },
      { status: 502 }
    );
  }
}