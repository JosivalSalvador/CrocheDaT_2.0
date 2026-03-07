"use client";

import { Search, ListFilter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "@/types/enums";

interface UsersFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
}

export function UsersFilters({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
}: UsersFiltersProps) {
  return (
    <div className="relative z-20 flex w-full flex-row items-center gap-2 sm:gap-3">
      {/* 🔍 Busca por Nome ou Email */}
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Buscar usuário..."
          className="bg-background h-9 w-full pl-9 text-xs shadow-sm sm:h-10 sm:text-sm"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* 🏷️ Filtro por Cargo */}
      <div className="relative shrink-0">
        <Select value={roleFilter} onValueChange={onRoleFilterChange}>
          {/* MUDANÇAS AQUI:
              - justify-center no mobile, sm:justify-between no desktop.
              - [&>svg]:hidden esconde a setinha padrão do Shadcn no mobile.
              - sm:[&>svg]:block devolve a setinha no desktop.
          */}
          <SelectTrigger className="bg-background flex h-9 w-9 items-center justify-center p-0 shadow-sm sm:h-10 sm:w-45 sm:justify-between sm:px-3 sm:py-2 [&>svg]:hidden sm:[&>svg]:block">
            {/* Ícone visível apenas no mobile (envelopado para não ser escondido pelo Tailwind acima) */}
            <span className="flex items-center justify-center sm:hidden">
              <ListFilter className="text-foreground h-4 w-4" />
            </span>

            {/* Texto visível apenas no desktop */}
            <span className="hidden sm:inline-block">
              <SelectValue placeholder="Todos os cargos" />
            </span>
          </SelectTrigger>

          <SelectContent
            position="popper"
            side="bottom"
            sideOffset={4}
            className="bg-background z-100 border opacity-100! shadow-lg"
          >
            <SelectItem value="ALL">Todos os cargos</SelectItem>
            <SelectItem value={Role.ADMIN}>Administradores</SelectItem>
            <SelectItem value={Role.SUPPORTER}>Suporte</SelectItem>
            <SelectItem value={Role.USER}>Clientes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
