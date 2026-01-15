import { httpClient } from "@/lib/api/http-client";

export type DashboardResumo = {
  totalUsuarios: number;
  totalPedidos: number;
};

export function buscarResumoDashboard() {
  return httpClient<DashboardResumo>("/api/dashboard/resumo");
}
