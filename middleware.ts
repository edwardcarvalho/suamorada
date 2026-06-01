import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas que requerem autenticação — simplificado sem Auth.js no middleware
// (auth check via server-side na página, não no middleware — evita edge runtime issues)
const PROTECTED = ["/dashboard"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected  = PROTECTED.some((p) => pathname.startsWith(p));

  // Em dev, bypass para poder testar sem auth
  if (process.env.NODE_ENV === "development") return NextResponse.next();

  // Verificar JWT session cookie do NextAuth
  const sessionToken =
    req.cookies.get("__Secure-next-auth.session-token")?.value ??
    req.cookies.get("next-auth.session-token")?.value;

  if (isProtected && !sessionToken) {
    const loginUrl = new URL("/entrar", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
