import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "auth_session";

/**
 * Lógica de Proxy/Middleware para interceptação de rotas e proteção de acesso.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  let user = null;
  if (sessionCookie) {
    try {
      // Usamos decodeURIComponent para lidar com caracteres especiais do JSON stringificado
      const decoded = decodeURIComponent(sessionCookie);
      const session = JSON.parse(decoded);
      user = session.user;
    } catch {
      // Se o parse falhar, tratamos como usuário não logado
      user = null;
    }
  }

  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAppRoute = pathname.startsWith("/home");
  const isRoot = pathname === "/";

  // 1. Redirecionamento da raiz (/)
  if (isRoot) {
    if (!user) return NextResponse.redirect(new URL("/login", request.url));
    const redirectUrl = user.role === "ADMIN" ? "/admin/dashboard" : "/home";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // 2. Não logado tentando acessar área restrita
  if (!user && (isAdminRoute || isAppRoute)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Logado tentando acessar login/register (Prevenção de loop)
  if (user && isAuthRoute) {
    const redirectUrl = user.role === "ADMIN" ? "/admin/dashboard" : "/home";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // 4. Usuário comum tentando acessar Admin
  if (user?.role === "USER" && isAdminRoute) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // 5. Admin tentando acessar Home de usuário comum
  if (user?.role === "ADMIN" && isAppRoute) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes internas do Next)
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico, public files (imagens da pasta public)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
