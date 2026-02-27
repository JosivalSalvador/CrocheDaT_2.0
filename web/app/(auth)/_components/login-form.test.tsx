import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AuthFormState, LoginInput } from "../types";

/* ===========================
   Controlled state mock
=========================== */

let stateMock: AuthFormState = {
  success: false,
  message: null,
  errors: {},
};

const actionMock = vi.fn<(data: LoginInput) => void>();

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");

  return {
    ...actual,
    useActionState: () => [stateMock, actionMock, false] as const,
    startTransition: (cb: () => void) => cb(),
  };
});

vi.mock("framer-motion", () => ({
  motion: {
    div: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />,
  },
}));

vi.mock("../_actions/login.action", () => ({
  loginAction: vi.fn(),
}));

/* ===========================
   Import AFTER mocks
=========================== */

import { LoginForm } from "./login-form";

/* ===========================
   Tests
=========================== */

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    stateMock = {
      success: false,
      message: null,
      errors: {},
    };
  });

  it("renders form fields", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /entrar na conta/i }),
    ).toBeInTheDocument();
  });

  it("submits valid form data", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(screen.getByLabelText(/e-mail/i), "john@example.com");

    await user.type(screen.getByLabelText(/senha/i), "Password123!");

    await user.click(screen.getByRole("button", { name: /entrar na conta/i }));

    expect(actionMock).toHaveBeenCalledWith({
      email: "john@example.com",
      password: "Password123!",
    });
  });

  it("shows server error message", () => {
    stateMock = {
      success: false,
      message: "Credenciais inválidas",
      errors: {},
    };

    render(<LoginForm />);

    expect(screen.getByText("Credenciais inválidas")).toBeInTheDocument();
  });
});
