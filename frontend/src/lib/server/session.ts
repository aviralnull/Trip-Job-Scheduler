import "server-only";
import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export interface SchedulerSession {
  username: string;
  password: string;
  isLoggedIn: boolean;
}

const password = process.env.SESSION_PASSWORD;

if (!password || password.length < 32) {
  throw new Error("SESSION_PASSWORD must be at least 32 characters.");
}

export const sessionOptions: SessionOptions = {
  cookieName: "scheduler_session",
  password,
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  },
};

export async function getSession() {
  return getIronSession<SchedulerSession>(
    await cookies(),
    sessionOptions
  );
}