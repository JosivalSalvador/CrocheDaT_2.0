import { env } from "../utils/env";
import type { HttpError } from "../types";
import {
  getSession,
  getRefreshToken,
  setSession,
  destroySession,
} from "../auth/session";

const getBaseUrl = () => {
  if (typeof window === "undefined") return env.API_INTERNAL_URL;
  return env.NEXT_PUBLIC_API_URL;
};

function getCookieValue(header: string | null, name: string): string | null {
  if (!header) return null;
  const match = header.match(new RegExp(`${name}=([^;]+)`));
  return match ? match[1] : null;
}

async function internalFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const url = path.startsWith("/") ? `${getBaseUrl()}${path}` : path;
  const headers = new Headers(init?.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // AJUSTE 1: Nomenclatura corrigida para 'token' (conforme seu novo AuthResponse)
  if (typeof window === "undefined") {
    const session = await getSession();
    if (session?.token) {
      // Antes era accessToken
      headers.set("Authorization", `Bearer ${session.token}`);
    }
  }

  const response = await fetch(url, {
    ...init,
    headers,
    credentials: "include",
    cache: init?.cache ?? "no-store",
  });

  // LÓGICA BFF: Interceptor de Refresh Token
  if (response.status === 401 && !path.includes("/token/refresh")) {
    const refreshToken = await getRefreshToken();

    if (refreshToken) {
      try {
        // AJUSTE 2: Chamada de Refresh enviando o token no formato esperado pelo Fastify
        // Nota: O header "Cookie" é crucial quando o Next.js (Server) fala com o Fastify
        const refreshResponse = await fetch(`${getBaseUrl()}/token/refresh`, {
          method: "PATCH",
          headers: {
            Cookie: `refreshToken=${refreshToken}`,
          },
        });

        if (refreshResponse.ok) {
          // AJUSTE 3: Desestruturação corrigida para 'token'
          const { token: newAccessToken } = await refreshResponse.json();

          const setCookieHeader = refreshResponse.headers.get("set-cookie");
          const newRefreshTokenId =
            getCookieValue(setCookieHeader, "refreshToken") ?? refreshToken;

          const session = await getSession();
          if (session) {
            // Atualiza a sessão com o novo token e mantém o usuário
            await setSession(newAccessToken, newRefreshTokenId, session.user);
          }

          const retryHeaders = new Headers(headers);
          retryHeaders.set("Authorization", `Bearer ${newAccessToken}`);

          return fetch(url, { ...init, headers: retryHeaders });
        }

        await destroySession();
      } catch {
        await destroySession();
      }
    }
  }

  if (!response.ok) {
    let message = "Erro inesperado";
    try {
      const body = await response.json();
      message = body?.message ?? message;
    } catch {}

    throw {
      status: response.status,
      message,
    } satisfies HttpError;
  }

  return response;
}

export async function httpClient<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await internalFetch(path, init);
  return response.json() as Promise<T>;
}

export async function httpClientFull<T>(path: string, init?: RequestInit) {
  const response = await internalFetch(path, init);
  const data = (await response.json()) as T;
  return { data, headers: response.headers };
}
