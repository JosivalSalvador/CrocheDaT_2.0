import { render, screen } from "@testing-library/react";
import { DashboardResumo } from "./dashboard-resumo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function renderWithClient(ui: React.ReactNode) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

test("mostra estado de loading", () => {
  renderWithClient(<DashboardResumo />);
  expect(screen.getByText(/carregando/i)).toBeInTheDocument();
});
