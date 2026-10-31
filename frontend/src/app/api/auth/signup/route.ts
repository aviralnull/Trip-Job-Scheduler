
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const username =
      typeof body.username === "string"
        ? body.username.trim()
        : "";

    const password =
      typeof body.password === "string" ? body.password : "";

    if (!name || !email || !username || !password) {
      return NextResponse.json(
        { message: "Name, email, username and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8 || password.length > 72) {
      return NextResponse.json(
        { message: "Password must contain between 8 and 72 characters." },
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

    const response = await fetch(
      `${baseUrl.replace(/\/$/, "")}/api/v1/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          username,
          password,
        }),
        cache: "no-store",
      }
    );

    const responseText = await response.text();

    let data: { message?: string } = {};

    try {
      data = JSON.parse(responseText);
    } catch {
      console.error("Signup backend returned non-JSON:", responseText);
    }

    if (!response.ok) {
      console.error("Signup backend error:", response.status, data);

      return NextResponse.json(
        {
          message: data.message || `Registration failed (${response.status}).`,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Signup API error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to register. Please try again.",
      },
      { status: 500 }
    );
  }
}
