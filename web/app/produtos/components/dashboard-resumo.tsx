"use client";

import { useDashboardResumo } from "../hooks/use-dashboard-resumo";

export function DashboardResumo() {
  const { data, isLoading, error } = useDashboardResumo();
  if (isLoading) return <p>Carregando...</p>;
  if (error || !data) return <p>Erro ao carregar resumo</p>;
  return <div>Total de usuários: {data.totalUsuarios}</div>;
}
