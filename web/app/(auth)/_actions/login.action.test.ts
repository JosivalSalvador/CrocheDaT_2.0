import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginAction } from "./login.action";
import { authService } from "../_services/auth.service";
import { setSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import type { LoginInput, AuthFormState } from "../types";
import type { User } from "@/lib/types";

/* ===========================
   Mocks
=========================== */

vi.mock("../_services/auth.service", () => ({
  authService: {
    login: vi.fn(),
  },
}));

vi.mock("@/lib/auth/session", () => ({
  setSession: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

/* ===========================
   Test Suite
=========================== */

describe("loginAction", () => {
  const mockedLogin = vi.mocked(authService.login);
  const mockedSetSession = vi.mocked(setSession);
  const mockedRedirect = vi.mocked(redirect);

  const initialState: AuthFormState = {
    success: false,
    message: "",
  };

  const validInput: LoginInput = {
    email: "john@example.com",
    password: "Password123!",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* ===========================
     Validação Zod
  =========================== */

  it("should return validation error when schema fails", async () => {
    const invalidInput = {
      email: "invalid",
      password: "",
    } as LoginInput;

    const result = await loginAction(initialState, invalidInput);

    expect(result.success).toBe(false);
    expect(result.message).toBe("Dados inválidos");
  });

  /* ===========================
     ADMIN redirect
  =========================== */

  it("should login ADMIN and redirect to admin dashboard", async () => {
    const mockUser: User = {
      id: "1",
      name: "Admin",
      email: "admin@example.com",
      role: "ADMIN",
    };

    mockedLogin.mockResolvedValue({
      token: "access-token",
      refreshToken: "refresh-token",
      user: mockUser,
    });

    mockedRedirect.mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });

    await expect(loginAction(initialState, validInput)).rejects.toThrow(
      "NEXT_REDIRECT",
    );

    expect(mockedSetSession).toHaveBeenCalledWith(
      "access-token",
      "refresh-token",
      mockUser,
    );

    expect(mockedRedirect).toHaveBeenCalledWith("/admin/dashboard");
  });

  /* ===========================
     USER redirect
  =========================== */

  it("should login USER and redirect to /home", async () => {
    const mockUser: User = {
      id: "2",
      name: "User",
      email: "user@example.com",
      role: "USER",
    };

    mockedLogin.mockResolvedValue({
      token: "access-token",
      refreshToken: "refresh-token",
      user: mockUser,
    });

    mockedRedirect.mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });

    await expect(loginAction(initialState, validInput)).rejects.toThrow(
      "NEXT_REDIRECT",
    );

    expect(mockedRedirect).toHaveBeenCalledWith("/home");
  });

  /* ===========================
     HttpError
  =========================== */

  it("should return HttpError message when login fails with HttpError", async () => {
    mockedLogin.mockRejectedValue({
      status: 401,
      message: "Credenciais inválidas",
    });

    const result = await loginAction(initialState, validInput);

    expect(result.success).toBe(false);
    expect(result.message).toBe("Credenciais inválidas");
  });

  /* ===========================
     Unknown error
  =========================== */

  it("should return generic error when login throws unknown error", async () => {
    mockedLogin.mockRejectedValue("unexpected");

    const result = await loginAction(initialState, validInput);

    expect(result.success).toBe(false);
    expect(result.message).toBe("Erro crítico de autenticação");
  });
});
