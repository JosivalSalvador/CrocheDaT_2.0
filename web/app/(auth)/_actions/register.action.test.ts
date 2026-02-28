import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerAction } from "./register.action";
import { authService } from "../_services/auth.service";
import { redirect } from "next/navigation";
import type { AuthFormState } from "../types";
import type { HttpError } from "@/lib/types";

/* ===========================
   MOCKS
=========================== */

vi.mock("../_services/auth.service", () => ({
  authService: {
    register: vi.fn(),
  },
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("registerAction", () => {
  const mockedRegister = vi.mocked(authService.register);
  const mockedRedirect = vi.mocked(redirect);

  const initialState: AuthFormState = {
    success: false,
    message: null,
    errors: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Simula o comportamento real do Next.js: redirect lança um erro interno
    mockedRedirect.mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });

    // Espiona e silencia o console.error para não poluir o terminal durante o teste de falha genérica
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should return validation errors when Zod validation fails", async () => {
    const formData = new FormData();
    formData.append("name", "Jo"); // Nome curto
    formData.append("email", "email-invalido");
    formData.append("password", "123");
    formData.append("confirmPassword", "321");

    const result = await registerAction(initialState, formData);

    expect(result.success).toBe(false);
    expect(result.message).toBe("Por favor, corrija os erros no formulário.");
    expect(result.errors).toHaveProperty("name");
    expect(result.errors).toHaveProperty("email");
    expect(result.errors).toHaveProperty("confirmPassword");
    expect(mockedRegister).not.toHaveBeenCalled();
  });

  it("should call authService.register and redirect on success", async () => {
    const formData = new FormData();
    formData.append("name", "John Doe");
    formData.append("email", "john@example.com");
    formData.append("password", "Password123!");
    formData.append("confirmPassword", "Password123!");

    mockedRegister.mockResolvedValue({ userId: "1", message: "OK" });

    // Verificamos se lança NEXT_REDIRECT
    await expect(registerAction(initialState, formData)).rejects.toThrow(
      "NEXT_REDIRECT",
    );

    // Verificamos se o service foi chamado com os dados corretos
    expect(mockedRegister).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "John Doe",
        email: "john@example.com",
        password: "Password123!",
      }),
    );

    expect(mockedRedirect).toHaveBeenCalledWith("/login?registered=true");
  });

  it("should handle HttpError thrown by the auth service", async () => {
    const formData = new FormData();
    formData.append("name", "John Doe");
    formData.append("email", "john@example.com");
    formData.append("password", "Password123!");
    formData.append("confirmPassword", "Password123!");

    // Simula um erro vindo da API (ex: 409 Conflict)
    mockedRegister.mockRejectedValue({
      message: "Este e-mail já está em uso.",
      status: 409,
    } as HttpError);

    const result = await registerAction(initialState, formData);

    expect(result.success).toBe(false);
    expect(result.message).toBe("Este e-mail já está em uso.");
  });

  it("should return generic error message for unknown exceptions", async () => {
    const formData = new FormData();
    formData.append("name", "John Doe");
    formData.append("email", "john@example.com");
    formData.append("password", "Password123!");
    formData.append("confirmPassword", "Password123!");

    // Simula um erro de banco ou rede (sem a estrutura HttpError)
    const internalError = new Error("Database crash");
    mockedRegister.mockRejectedValue(internalError);

    const result = await registerAction(initialState, formData);

    expect(result.success).toBe(false);

    /**
     * IMPORTANTE: Para este teste passar, sua registerAction.ts deve estar tratando
     * o erro e retornando a string abaixo no catch, em vez de retornar error.message puro.
     */
    expect(result.message).toBe("Falha ao criar conta. Tente novamente.");
  });
});
