export type HttpError = {
  status: number;
  message: string;
};

// Lógica para decidir qual URL usar
const getBaseUrl = () => {
  if (typeof window === "undefined") {
    // Estamos no SERVIDOR (Docker/Next.js SSR)
    // Usa a URL interna do container (ex: http://fastify_api_prod:3333)
    return process.env.API_INTERNAL_URL || "http://fastify_api_prod:3333";
  }
  // Estamos no NAVEGADOR (Cliente)
  // Usa a URL pública (ex: http://localhost:3333)
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";
};

export async function httpClient<T>(
  path: string, // Mudei de RequestInfo para string para forçar o caminho
  init?: RequestInit,
): Promise<T> {
  // Se o caminho começar com '/', a gente cola na URL base.
  // Se for uma URL completa (https://...), a gente usa ela direto.
  const url = path.startsWith("/") ? `${getBaseUrl()}${path}` : path;

  const response = await fetch(url, {
    ...init,
    credentials: "include", // Importante para enviar Cookies/Session
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = "Erro inesperado";

    try {
      const body = await response.json();
      message = body?.message ?? message;
    } catch {
      // resposta sem body JSON
    }

    throw {
      status: response.status,
      message,
    } satisfies HttpError;
  }

  return response.json() as Promise<T>;
}
