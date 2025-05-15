import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";

const protectedRoutes = ["/p-employee", "/p-hr"];
const publicRoutes = ["/login"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  const rolePathMap: Record<string, string> = {
    HR: "/p-hr",
    EMPLOYEE: "/p-employee",
  };

  const redirectPath = session?.role ? rolePathMap[session?.role] : "";

  if (session?.userId) {
    if ((isProtectedRoute && !path.startsWith(redirectPath)) || isPublicRoute) {
      return NextResponse.redirect(new URL(redirectPath, req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
