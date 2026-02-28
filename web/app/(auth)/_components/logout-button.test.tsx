import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { LogoutButton } from "./logout-button";
import { logoutAction } from "../_actions/logout.action";

// --- MOCKS ---

vi.mock("../_actions/logout.action", () => ({
  logoutAction: vi.fn(),
}));

// Mock do Lucide React para evitar erros de renderização de SVG nos testes
vi.mock("lucide-react", () => ({
  LogOut: () => <div data-testid="logout-icon" />,
  Loader2: () => <div data-testid="loader-icon" />,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    className,
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  ),
}));

describe("LogoutButton", () => {
  const mockedLogoutAction = vi.mocked(logoutAction);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the logout button with initial state", () => {
    render(<LogoutButton />);

    const button = screen.getByRole("button", { name: /sair/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId("logout-icon")).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it("should call logoutAction when clicked", async () => {
    const user = userEvent.setup();

    // Simula uma promessa que resolve para a Action
    mockedLogoutAction.mockResolvedValue(undefined as never);

    render(<LogoutButton />);

    const button = screen.getByRole("button", { name: /sair/i });
    await user.click(button);

    expect(mockedLogoutAction).toHaveBeenCalledTimes(1);
  });

  it("should show loading state during transition", async () => {
    const user = userEvent.setup();

    // Criamos uma promessa pendente para segurar o estado de isPending
    let resolveAction: (value: void) => void;
    const promise = new Promise<void>((resolve) => {
      resolveAction = resolve;
    });

    mockedLogoutAction.mockReturnValue(
      promise as ReturnType<typeof logoutAction>,
    );

    render(<LogoutButton />);

    const button = screen.getByRole("button", { name: /sair/i });
    await user.click(button);

    // Verifica estado de carregamento
    expect(screen.getByText(/saindo.../i)).toBeInTheDocument();
    expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
    expect(button).toBeDisabled();

    // Resolve a promessa para limpar o teste
    await waitFor(async () => {
      resolveAction!(undefined);
    });
  });
});
