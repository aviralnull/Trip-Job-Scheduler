
import { NextResponse } from "next/server";
import { getSession } from "@/lib/server/session";

export async function adminBackendRequest(
  path: string,
  init: RequestInit = {}
) {
  try {
    const session = await getSession();

    if (!session.isLoggedIn || !session.username || !session.password) {
      return NextResponse.json(
        { message: "Please sign in again." },
        { status: 401 }
      );
    }

    const baseUrl = process.env.SCHEDULER_API_URL;

    if (!baseUrl) {
      return NextResponse.json(
        { message: "SCHEDULER_API_URL is not configured." },
        { status: 500 }
      );
    }

    const token = Buffer.from(
      `${session.username}:${session.password}`
    ).toString("base64");

    const response = await fetch(
      `${baseUrl.replace(/\/$/, "")}/api/v1/admin${path}`,
      {
        ...init,
        headers: {
          Authorization: `Basic ${token}`,
          "Content-Type": "application/json",
          ...init.headers,
        },
        cache: "no-store",
      }
    );

    const body = await response.text();

    return new NextResponse(body || null, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Admin API proxy error:", error);

    return NextResponse.json(
      { message: "Could not connect to the scheduler backend." },
      { status: 502 }
    );
  }
}
