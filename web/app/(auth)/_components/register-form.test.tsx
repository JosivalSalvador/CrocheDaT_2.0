import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AuthFormState, RegisterInput } from "../types";

/* ===========================
   Controlled state mock
=========================== */

let stateMock: AuthFormState = {
  success: false,
  message: null,
  errors: {},
};

const actionMock = vi.fn<(data: RegisterInput) => void>();

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");

  return {
    ...actual,
    useActionState: () => [stateMock, actionMock, false] as const,
    startTransition: (cb: () => void) => cb(),
  };
});

vi.mock("../_actions/register.action", () => ({
  registerAction: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/components/ui/button", () => ({
  Button: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props} />
  ),
}));

vi.mock("@/components/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
  ),
}));

/* IMPORT AFTER MOCKS */

import { RegisterForm } from "./register-form";
import { toast } from "sonner";

/* ===========================
   Tests
=========================== */

describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    stateMock = {
      success: false,
      message: null,
      errors: {},
    };
  });

  it("renders all form fields", () => {
    render(<RegisterForm />);

    expect(screen.getByPlaceholderText(/nome completo/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/nome@exemplo.com/i),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^senha$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirmar senha/i)).toBeInTheDocument();
  });

  it("submits valid data", async () => {
    const user = userEvent.setup();

    render(<RegisterForm />);

    await user.type(screen.getByPlaceholderText(/nome completo/i), "John Doe");

    await user.type(
      screen.getByPlaceholderText(/nome@exemplo.com/i),
      "john@example.com",
    );

    await user.type(screen.getByPlaceholderText(/^senha$/i), "Password123!");

    await user.type(
      screen.getByPlaceholderText(/confirmar senha/i),
      "Password123!",
    );

    await user.click(screen.getByRole("button", { name: /registrar/i }));

    expect(actionMock).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      password: "Password123!",
      confirmPassword: "Password123!",
    });
  });

  it("shows success toast when state.success is true", async () => {
    stateMock = {
      success: true,
      message: "Conta criada com sucesso",
      errors: {},
    };

    render(<RegisterForm />);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Conta criada com sucesso");
    });
  });

  it("shows error toast when state.success is false", async () => {
    stateMock = {
      success: false,
      message: "Erro ao registrar",
      errors: {},
    };

    render(<RegisterForm />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro ao registrar");
    });
  });
});
