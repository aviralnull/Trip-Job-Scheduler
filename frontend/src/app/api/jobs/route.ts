import { NextRequest, NextResponse } from "next/server";
import { backendRequest } from "@/lib/server/backend";

export async function GET() {
    try {
        const response = await backendRequest("/api/v1/jobs");
        const data = await response.json();

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { message: error instanceof Error ? error.message : "Backend unavailable" },
            { status: 502 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const response = await backendRequest("/api/v1/jobs", {
            method: "POST",
            body: JSON.stringify(body),
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