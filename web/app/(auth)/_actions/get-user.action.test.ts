import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUserAction } from "./get-user.action";
import { getSession } from "@/lib/auth/session";
import type { User } from "@/lib/types";

// --- MOCKS ---

vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

describe("getUserAction", () => {
  const mockedGetSession = vi.mocked(getSession);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return the user when a valid session exists", async () => {
    const mockUser: User = {
      id: "user-123",
      name: "John Doe",
      email: "john@example.com",
      role: "USER",
    };

    // A estrutura de retorno do getSession é { token: string; user: User }
    mockedGetSession.mockResolvedValue({
      token: "fake-access-token",
      user: mockUser,
    });

    const result = await getUserAction();

    expect(result).toEqual(mockUser);
    expect(mockedGetSession).toHaveBeenCalledTimes(1);
  });

  it("should return null when getSession returns null", async () => {
    mockedGetSession.mockResolvedValue(null);

    const result = await getUserAction();

    expect(result).toBeNull();
  });

  it("should return null when session exists but user property is missing", async () => {
    // Simulamos um objeto que satisfaz parcialmente a estrutura para testar a segurança do código
    // Sem usar 'any', usamos uma estrutura que o getSession poderia retornar em caso de erro de parse
    mockedGetSession.mockResolvedValue({
      token: "fake-token",
      user: null as unknown as User,
    });

    const result = await getUserAction();

    expect(result).toBeNull();
  });
});
