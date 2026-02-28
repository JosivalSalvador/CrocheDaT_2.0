import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { RegisterForm } from "./register-form";
import { toast } from "sonner";
import { AuthFormState } from "../types";

// --- MOCKS ---

// Tipamos a função que o useActionState entrega ao componente
type DispatchFn = (payload: FormData) => Promise<void>;

// Criamos o mock com a tipagem da função de despacho
const actionMock = vi.fn<DispatchFn>();

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useActionState: vi.fn(),
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
  Button: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("@/components/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
  ),
}));

describe("RegisterForm", () => {
  // Tipamos o mock do hook para aceitar o estado e a função de despacho
  const mockedUseActionState = vi.mocked(React.useActionState);

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup inicial: Mockamos o retorno como uma tupla estritamente tipada
    // [state, dispatch, isPending]
    mockedUseActionState.mockReturnValue([
      { success: false, message: null, errors: {} } as AuthFormState,
      actionMock as unknown as (payload: unknown) => void, // O React exige unknown aqui internamente
      false,
    ]);
  });

  it("renders all form fields with correct placeholders", () => {
    render(<RegisterForm />);

    expect(
      screen.getByPlaceholderText(/como quer ser chamada/i),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/seu@email.com/i)).toBeInTheDocument();
  });

  it("submits FormData correctly when form is valid", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(
      screen.getByPlaceholderText(/como quer ser chamada/i),
      "John Doe",
    );
    await user.type(
      screen.getByPlaceholderText(/seu@email.com/i),
      "john@example.com",
    );

    const passwordInputs = screen.getAllByPlaceholderText(/••••••••/i);
    await user.type(passwordInputs[0], "Password123!");
    await user.type(passwordInputs[1], "Password123!");

    await user.click(
      screen.getByRole("button", { name: /criar minha conta/i }),
    );

    await waitFor(() => {
      expect(actionMock).toHaveBeenCalled();

      const formDataSent = actionMock.mock.calls[0][0];

      // Validação sem type assertion perigosa
      if (formDataSent instanceof FormData) {
        expect(formDataSent.get("name")).toBe("John Doe");
        expect(formDataSent.get("email")).toBe("john@example.com");
      } else {
        throw new Error("Payload enviado não é uma instância de FormData");
      }
    });
  });

  it("shows success toast when action state is updated", async () => {
    const successState: AuthFormState = {
      success: true,
      message: "Conta criada!",
      errors: {},
    };

    // Atualizamos o mock para este caso específico
    mockedUseActionState.mockReturnValue([
      successState,
      actionMock as unknown as (payload: unknown) => void,
      false,
    ]);

    render(<RegisterForm />);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Conta criada!");
    });
  });

  it("validates passwords matching on client-side via RHF", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(
      screen.getByPlaceholderText(/como quer ser chamada/i),
      "John Doe",
    );
    await user.type(
      screen.getByPlaceholderText(/seu@email.com/i),
      "john@example.com",
    );

    const passwordInputs = screen.getAllByPlaceholderText(/••••••••/i);
    await user.type(passwordInputs[0], "Password123!");
    await user.type(passwordInputs[1], "DiffPassword123!");

    await user.click(
      screen.getByRole("button", { name: /criar minha conta/i }),
    );

    await waitFor(() => {
      expect(screen.getByText(/as senhas não coincidem/i)).toBeInTheDocument();
      expect(actionMock).not.toHaveBeenCalled();
    });
  });
});
