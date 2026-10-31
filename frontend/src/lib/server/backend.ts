import "server-only";
import { getSession } from "./session";

export async function backendRequest(
  path: string,
  init: RequestInit = {}
) {
  const session = await getSession();

  if (!session.isLoggedIn || !session.username || !session.password) {
    throw new Error("Unauthorized. Please sign in.");
  }

  const baseUrl = process.env.SCHEDULER_API_URL;

  if (!baseUrl) {
    throw new Error("Scheduler API URL is missing.");
  }

  const headers = new Headers(init.headers);

  const credentials = Buffer.from(
    `${session.username}:${session.password}`
  ).toString("base64");

  headers.set("Authorization", `Basic ${credentials}`);
  headers.set("Accept", "application/json");

  if (init.body) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(
    `${baseUrl.replace(/\/$/, "")}${path}`,
    {
      ...init,
      headers,
      cache: "no-store",
    }
  );
}