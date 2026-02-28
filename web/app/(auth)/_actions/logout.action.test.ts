import { describe, it, expect, vi, beforeEach } from "vitest";
import { logoutAction } from "./logout.action";
import { authService } from "../_services/auth.service";
import { destroySession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

// --- MOCKS ---

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("../_services/auth.service", () => ({
  authService: {
    logout: vi.fn(),
  },
}));

vi.mock("@/lib/auth/session", () => ({
  destroySession: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("logoutAction", () => {
  const mockedCookies = vi.mocked(cookies);
  const mockedAuthService = vi.mocked(authService);
  const mockedDestroySession = vi.mocked(destroySession);
  const mockedRedirect = vi.mocked(redirect);

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock do redirect seguindo o comportamento do Next.js 15
    mockedRedirect.mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });
  });

  it("should call authService.logout with refreshToken and destroy session", async () => {
    // Tipagem correta para o mock do cookieStore sem usar 'any'
    const mockCookieStore = {
      get: vi.fn().mockReturnValue({ value: "fake-refresh-token" }),
    } as unknown as ReadonlyRequestCookies;

    mockedCookies.mockResolvedValue(mockCookieStore);

    await expect(logoutAction()).rejects.toThrow("NEXT_REDIRECT");

    expect(mockedAuthService.logout).toHaveBeenCalledWith("fake-refresh-token");
    expect(mockedDestroySession).toHaveBeenCalledTimes(1);
    expect(mockedRedirect).toHaveBeenCalledWith("/login");
  });

  it("should destroy session even if authService.logout fails (finally block)", async () => {
    const mockCookieStore = {
      get: vi.fn().mockReturnValue({ value: "valid-token" }),
    } as unknown as ReadonlyRequestCookies;

    mockedCookies.mockResolvedValue(mockCookieStore);

    // Simula erro na API (ex: timeout ou 500)
    mockedAuthService.logout.mockRejectedValue(new Error("Network Error"));

    // O erro do logout é silenciado pelo try/catch, mas o redirect (que também é um erro) prevalece
    await expect(logoutAction()).rejects.toThrow("NEXT_REDIRECT");

    // O finally garante a limpeza local
    expect(mockedDestroySession).toHaveBeenCalled();
    expect(mockedRedirect).toHaveBeenCalledWith("/login");
  });

  it("should call logout with undefined if refreshToken is missing", async () => {
    const mockCookieStore = {
      get: vi.fn().mockReturnValue(undefined),
    } as unknown as ReadonlyRequestCookies;

    mockedCookies.mockResolvedValue(mockCookieStore);

    await expect(logoutAction()).rejects.toThrow("NEXT_REDIRECT");

    expect(mockedAuthService.logout).toHaveBeenCalledWith(undefined);
    expect(mockedDestroySession).toHaveBeenCalled();
  });
});
