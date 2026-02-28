import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginAction } from "./login.action";
import { setSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { httpClientFull } from "@/lib/api/http-client";
import type { AuthFormState } from "../types";
import type { User, HttpError } from "@/lib/types";

// --- MOCKS ---

vi.mock("@/lib/api/http-client", () => ({
  httpClientFull: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({
  setSession: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("loginAction", () => {
  const mockedHttpClientFull = vi.mocked(httpClientFull);
  const mockedSetSession = vi.mocked(setSession);
  const mockedRedirect = vi.mocked(redirect);

  const initialState: AuthFormState = {
    success: false,
    message: null,
    errors: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock do redirect para lançar o erro esperado pelo Next.js
    mockedRedirect.mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });
  });

  it("should return validation errors when Zod validation fails", async () => {
    const formData = new FormData();
    formData.append("email", "email-invalido");
    formData.append("password", ""); // Curto demais

    const result = await loginAction(initialState, formData);

    expect(result.success).toBe(false);
    expect(result.message).toBe("Por favor, corrija os erros no formulário.");
    expect(result.errors).toHaveProperty("email");
    expect(result.errors).toHaveProperty("password");
    expect(mockedHttpClientFull).not.toHaveBeenCalled();
  });

  it("should successfully log in and redirect based on user role", async () => {
    const mockUser: User = {
      id: "u1",
      name: "Admin",
      email: "admin@test.com",
      role: "ADMIN",
    };

    const formData = new FormData();
    formData.append("email", "admin@test.com");
    formData.append("password", "123456");

    // Criamos uma instância real de Headers como o httpClientFull faz
    const mockResponseHeaders = new Headers();
    mockResponseHeaders.append(
      "set-cookie",
      "refreshToken=secret-token-123; Path=/; HttpOnly",
    );

    mockedHttpClientFull.mockResolvedValue({
      data: {
        token: "access-token-xyz",
        user: mockUser,
      },
      headers: mockResponseHeaders,
    });

    // Como o redirect interrompe a execução, usamos try/catch ou o matcher rejects
    try {
      await loginAction(initialState, formData);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        // Fluxo esperado
      } else {
        throw error;
      }
    }

    expect(mockedSetSession).toHaveBeenCalledWith(
      "access-token-xyz",
      "secret-token-123",
      mockUser,
    );
    expect(mockedRedirect).toHaveBeenCalledWith("/dashboard");
  });

  it("should return error if refreshToken is not present in response headers", async () => {
    const formData = new FormData();
    formData.append("email", "test@test.com");
    formData.append("password", "123456");

    const emptyHeaders = new Headers();

    mockedHttpClientFull.mockResolvedValue({
      data: {
        token: "token",
        user: { id: "1", role: "USER", name: "User", email: "u@u.com" },
      },
      headers: emptyHeaders,
    });

    const result = await loginAction(initialState, formData);

    expect(result.success).toBe(false);
    expect(result.message).toBe(
      "Sessão não pôde ser estabelecida (Refresh Token ausente).",
    );
  });

  it("should handle HttpError thrown by httpClientFull correctly", async () => {
    const formData = new FormData();
    formData.append("email", "wrong@test.com");
    formData.append("password", "wrongpass");

    const errorToThrow: HttpError = {
      status: 401,
      message: "Credenciais inválidas de fato",
    };

    mockedHttpClientFull.mockRejectedValue(errorToThrow);

    const result = await loginAction(initialState, formData);

    expect(result.success).toBe(false);
    expect(result.message).toBe("Credenciais inválidas de fato");
  });
});
