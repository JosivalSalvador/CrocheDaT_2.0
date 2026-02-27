import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  type MockedFunction,
} from "vitest";
import { authService } from "./auth.service";
import { httpClient } from "@/lib/api/http-client";
import type { AuthResponse, User } from "@/lib/types";
import type { LoginInput, RegisterInput } from "../types";

vi.mock("@/lib/api/http-client", () => ({
  httpClient: vi.fn(),
}));

describe("authService", () => {
  const mockedHttpClient = httpClient as MockedFunction<typeof httpClient>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("should call httpClient with correct payload and return AuthResponse", async () => {
      const input: LoginInput = {
        email: "john@example.com",
        password: "Password123!",
      };

      const mockUser: User = {
        id: "1",
        name: "John",
        email: "john@example.com",
        role: "USER",
      };

      const mockResponse: AuthResponse = {
        user: mockUser,
        token: "fake-access-token",
        refreshToken: "fake-refresh-token",
      };

      mockedHttpClient.mockResolvedValue(mockResponse);

      const result = await authService.login(input);

      expect(mockedHttpClient).toHaveBeenCalledWith("/sessions", {
        method: "POST",
        body: JSON.stringify(input),
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe("register", () => {
    it("should call httpClient with correct payload", async () => {
      const input: RegisterInput = {
        name: "John Doe",
        email: "john@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
      };

      mockedHttpClient.mockResolvedValue(undefined);

      await authService.register(input);

      expect(mockedHttpClient).toHaveBeenCalledWith("/users", {
        method: "POST",
        body: JSON.stringify(input),
      });
    });
  });
});
