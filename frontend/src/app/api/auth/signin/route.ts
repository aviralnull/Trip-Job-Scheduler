
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/server/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const username =
      typeof body.username === "string" ? body.username.trim() : "";

    const password =
      typeof body.password === "string" ? body.password : "";

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required." },
        { status: 400 }
      );
    }

    const baseUrl = process.env.SCHEDULER_API_URL;

    if (!baseUrl) {
      console.error("SCHEDULER_API_URL is missing.");

      return NextResponse.json(
        { message: "Backend configuration missing." },
        { status: 500 }
      );
    }

    const token = Buffer.from(`${username}:${password}`).toString("base64");

    const response = await fetch(
      `${baseUrl.replace(/\/$/, "")}/api/v1/jobs`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${token}`,
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (response.status === 401 || response.status === 403) {
      return NextResponse.json(
        { message: "Invalid username or password." },
        { status: 401 }
      );
    }

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Backend signin verification failed:", response.status, errorBody);

      return NextResponse.json(
        { message: "Unable to verify credentials with backend." },
        { status: 502 }
      );
    }

    const session = await getSession();

    session.username = username;
    session.password = password;
    session.isLoggedIn = true;

    await session.save();

    return NextResponse.json({
      success: true,
      username,
    });
  } catch (error) {
    console.error("Signin API error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Sign in failed. Please try again.",
      },
      { status: 500 }
    );
  }
}
