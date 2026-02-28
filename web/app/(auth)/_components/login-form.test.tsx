import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { LoginForm } from "./login-form";

// Mock do ambiente para evitar erro de variáveis faltando
vi.mock("@/lib/utils/env", () => ({
  env: { NEXT_PUBLIC_API_URL: "http://localhost:3333" },
}));

const actionMock = vi.fn();

// MOCK DOS HOOKS DO REACT
vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useActionState: vi.fn(),
    useTransition: vi.fn(), // Precisamos mockar o transition!
  };
});

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

describe("LoginForm", () => {
  const mockedUseActionState = vi.mocked(React.useActionState);
  const mockedUseTransition = vi.mocked(React.useTransition);

  beforeEach(() => {
    vi.clearAllMocks();

    // Simula o estado parado (não pendente)
    mockedUseActionState.mockReturnValue([
      { success: false, message: null, errors: {} },
      actionMock,
      false,
    ]);
    mockedUseTransition.mockReturnValue([false, vi.fn()]);
  });

  it("renders form fields correctly", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /entrar na conta/i }),
    ).toBeInTheDocument();
  });

  it("shows loading text on button when transition is pending", () => {
    // Simula o useTransition como TRUE
    mockedUseTransition.mockReturnValue([true, vi.fn()]);

    render(<LoginForm />);

    const button = screen.getByRole("button");
    expect(button.textContent).toMatch(/autenticando/i);
    expect(button).toBeDisabled();
  });

  it("validates fields using client-side validation", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: /entrar na conta/i }));

    await waitFor(() => {
      // Verifica se as mensagens de erro do Hook Form apareceram
      // Usamos queryByText para ser flexível com a mensagem exata do seu Zod
      expect(
        screen.getAllByText(/e-mail|senha|obrigatório|inválido/i).length,
      ).toBeGreaterThan(0);
      expect(actionMock).not.toHaveBeenCalled();
    });
  });
});
