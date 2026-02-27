import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerAction } from "./register.action";
import { authService } from "../_services/auth.service";
import { redirect } from "next/navigation";
import type { RegisterInput, AuthFormState, RegisterResponse } from "../types";

/* ===========================
   Mocks
=========================== */

vi.mock("../_services/auth.service", () => ({
  authService: {
    register: vi.fn(),
  },
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

/* ===========================
   Test Suite
=========================== */

describe("registerAction", () => {
  const mockedRegister = vi.mocked(authService.register);
  const mockedRedirect = vi.mocked(redirect);

  const initialState: AuthFormState = {
    success: false,
    message: "",
  };

  const validInput: RegisterInput = {
    name: "John Doe",
    email: "john@example.com",
    password: "Password123!",
    confirmPassword: "Password123!",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* ===========================
     Validação Zod
  =========================== */

  it("should return validation error when schema fails", async () => {
    const invalidInput = {
      name: "",
      email: "invalid",
      password: "123",
      confirmPassword: "321",
    } as RegisterInput;

    const result = await registerAction(initialState, invalidInput);

    expect(result.success).toBe(false);
    expect(result.message).toBe("Por favor, corrija os erros no formulário.");
    expect(result.errors).toBeDefined();
  });

  /* ===========================
     Success → redirect
  =========================== */

  it("should call authService.register and redirect on success", async () => {
    mockedRegister.mockResolvedValue({} as RegisterResponse);
    mockedRedirect.mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });

    await expect(registerAction(initialState, validInput)).rejects.toThrow(
      "NEXT_REDIRECT",
    );

    expect(mockedRegister).toHaveBeenCalledWith(validInput);
    expect(mockedRedirect).toHaveBeenCalledWith("/login?registered=true");
  });

  /* ===========================
     Error instance
  =========================== */

  it("should return error message if service throws Error", async () => {
    mockedRegister.mockRejectedValue(new Error("Email já cadastrado"));

    const result = await registerAction(initialState, validInput);

    expect(result.success).toBe(false);
    expect(result.message).toBe("Email já cadastrado");
  });

  /* ===========================
     Unknown error
  =========================== */

  it("should return generic message if service throws unknown error", async () => {
    mockedRegister.mockRejectedValue("unexpected");

    const result = await registerAction(initialState, validInput);

    expect(result.success).toBe(false);
    expect(result.message).toBe("Falha ao criar conta. Tente novamente.");
  });
});
