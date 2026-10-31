import { NextRequest, NextResponse } from "next/server";
import { backendRequest } from "@/lib/server/backend";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: NextRequest,
  context: Context
) {
  try {
    const { id } = await context.params;
    const response = await backendRequest(`/api/v1/jobs/${id}`);
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Backend unavailable" },
      { status: 502 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: Context
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const response = await backendRequest(`/api/v1/jobs/${id}`, {
      method: "PUT",
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Backend unavailable" },
      { status: 502 }
    );
  }
}


export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const response = await backendRequest(
      `/api/v1/jobs/${id}`,
      {
        method: "DELETE",
      }
    );

    return new NextResponse(null, {
      status: response.status === 204 ? 204 : response.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Could not delete job",
      },
      { status: 500 }
    );
  }
}