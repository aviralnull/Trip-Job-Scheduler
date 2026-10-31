import { NextResponse } from "next/server";
import { getSession } from "@/lib/server/session";

export async function POST() {
  try {
    const session = await getSession();
    session.destroy();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: "Unable to log out." },
      { status: 500 }
    );
  }
}