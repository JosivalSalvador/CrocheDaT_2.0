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
import {
  LoginInput,
  RegisterData,
  LoginResponse,
  RegisterResponse,
} from "../types";

vi.mock("@/lib/api/http-client", () => ({
  httpClient: vi.fn(),
}));

describe("authService", () => {
  const mockedHttpClient = httpClient as MockedFunction<typeof httpClient>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("should call httpClient and return AuthResponse", async () => {
      const input: LoginInput = {
        email: "john@example.com",
        password: "Password123!",
      };

      // Ajustado para bater com AuthResponse (que compõe LoginResponse)
      const mockResponse: LoginResponse = {
        token: "fake-access-token",
        user: {
          id: "1",
          name: "John",
          email: "john@example.com",
          role: "USER",
        },
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
    it("should call httpClient with RegisterData and return RegisterResponse", async () => {
      const input: RegisterData = {
        name: "John Doe",
        email: "john@example.com",
        password: "Password123!",
      };

      // Ajustado para bater exatamente com a interface RegisterResponse
      const mockResponse: RegisterResponse = {
        userId: "user-123",
        message: "User created",
      };

      mockedHttpClient.mockResolvedValue(mockResponse);

      const result = await authService.register(input);

      expect(mockedHttpClient).toHaveBeenCalledWith("/users", {
        method: "POST",
        body: JSON.stringify(input),
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe("logout", () => {
    it("should inject refreshToken in Cookie header when provided", async () => {
      const fakeToken = "signed-refresh-token";
      mockedHttpClient.mockResolvedValue(undefined);

      await authService.logout(fakeToken);

      expect(mockedHttpClient).toHaveBeenCalledWith("/sessions/logout", {
        method: "POST",
        headers: {
          Cookie: `refreshToken=${fakeToken}`,
        },
      });
    });

    it("should send empty Cookie header when no token is provided", async () => {
      mockedHttpClient.mockResolvedValue(undefined);

      await authService.logout();

      expect(mockedHttpClient).toHaveBeenCalledWith("/sessions/logout", {
        method: "POST",
        headers: {
          Cookie: "",
        },
      });
    });
  });
});
