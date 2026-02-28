import { cookies } from "next/headers";
import { User } from "../types";

const AUTH_COOKIE_NAME = "auth_session";
// AJUSTE: O nome deve ser EXATAMENTE igual ao que o Fastify usa
const REFRESH_COOKIE_NAME = "refreshToken";

export async function setSession(
  token: string,
  refreshToken: string,
  user: User,
) {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify({ token, user }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  // Agora o nome bate com o que o Fastify espera receber
  cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!session) return null;
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
