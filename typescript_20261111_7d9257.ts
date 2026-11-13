// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Cek jika rute /admin tapi role bukan ADMIN
    if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role === "CUSTOMER") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Wajib login
    },
  }
);

export const config = { matcher: ["/admin/:path*", "/checkout"] };