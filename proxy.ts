import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@insforge/sdk/ssr/middleware";

import { INSFORGE_ANON_KEY, INSFORGE_BASE_URL } from "@/lib/insforge/config";

const protectedRoutes = ["/dashboard", "/profile", "/find-jobs"];
const publicRoutes = ["/", "/login"];

function isMatchingRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });
  const { accessToken } = await updateSession({
    baseUrl: INSFORGE_BASE_URL,
    anonKey: INSFORGE_ANON_KEY,
    requestCookies: request.cookies,
    responseCookies: response.cookies,
  });

  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    isMatchingRoute(pathname, route),
  );
  const isPublicRoute = publicRoutes.some((route) =>
    isMatchingRoute(pathname, route),
  );

  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublicRoute && accessToken && pathname !== "/dashboard") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard/:path*",
    "/profile/:path*",
    "/find-jobs/:path*",
  ],
};
