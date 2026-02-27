import { cookies } from "next/headers";
import { User } from "../types";

const AUTH_COOKIE_NAME = "auth_session";
const REFRESH_COOKIE_NAME = "auth_refresh";

/**
 * Define a sessão nos cookies do Next.js.
 */
export async function setSession(
  token: string,
  refreshToken: string,
  user: User,
) {
  const cookieStore = await cookies();

  // 1. Cookie de Acesso (Mudamos para 'token' para bater com o Fastify)
  cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify({ token, user }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  // 2. Cookie de Refresh
  cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

/**
 * Recupera os dados do usuário e o token de acesso
 */
export async function getSession() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!session) return null;

    // AQUI ESTAVA O ERRO: Trocamos accessToken por token no cast do JSON.parse
    return JSON.parse(session) as { token: string; user: User };
  } catch {
    return null;
  }
}

export async function getRefreshToken() {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_COOKIE_NAME)?.value;
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  cookieStore.delete(REFRESH_COOKIE_NAME);
}
