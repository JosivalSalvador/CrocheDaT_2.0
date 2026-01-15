"use client";

import { useQuery } from "@tanstack/react-query";
import { buscarResumoDashboard } from "../services/dashboard.service";

export function useDashboardResumo() {
  return useQuery({
    queryKey: ["dashboard", "resumo"],
    queryFn: buscarResumoDashboard,
  });
}
