import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "auth_session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  let user = null;
  if (sessionCookie) {
    try {
      const decoded = decodeURIComponent(sessionCookie);
      const session = JSON.parse(decoded);
      user = session.user;
    } catch {
      user = null;
    }
  }

  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isAdminRoute = pathname.startsWith("/dashboard");
  const isAppRoute = pathname.startsWith("/home");
  const isRoot = pathname === "/";

  // 1. Usuário NÃO logado
  if (!user) {
    /**
     * AJUSTE: Removemos o 'isRoot' daqui.
     * Agora, se o usuário não estiver logado e acessar "/", ele NÃO é mandado para o login.
     */
    if (isAdminRoute || isAppRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Se estiver na Raiz (/), rotas de Auth ou qualquer outra pública -> Segue
    return NextResponse.next();
  }

  // 2. Usuário LOGADO (Definição de destinos)
  const dashboardUrl = user.role === "ADMIN" ? "/dashboard" : "/home";

  // Redirecionamento da Raiz (/) para quem JÁ está logado
  // Isso mantém sua lógica de "Redirecionamento Inteligente"
  if (isRoot) {
    return NextResponse.redirect(new URL(dashboardUrl, request.url));
  }

  // Prevenção de loop: Logado tentando acessar Login/Register
  if (isAuthRoute) {
    return NextResponse.redirect(new URL(dashboardUrl, request.url));
  }

  // 3. Proteção de Rotas por Role (Sincronizado com Prisma)

  if (isAdminRoute && user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (isAppRoute && user.role === "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
