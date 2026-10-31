import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const session = request.cookies.get("scheduler_session");

  const isSignInPage = request.nextUrl.pathname === "/signin";

  if (!session && !isSignInPage) {
    return NextResponse.redirect(
      new URL("/signin", request.url)
    );
  }

  if (session && isSignInPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/signin"],
};