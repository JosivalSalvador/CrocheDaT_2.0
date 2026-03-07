"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  ShieldAlert,
  Trash2,
  ShieldCheck,
  User as UserIcon,
  AlertCircle,
} from "lucide-react";

import { UserResponse } from "@/types/index";
import { Role } from "@/types/enums";
import { useUsersMutations } from "@/hooks/use-users";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { UserRoleModal } from "./user-role-modal";

interface UsersListProps {
  users: UserResponse[];
}

export function UsersList({ users }: UsersListProps) {
  const { deleteUser } = useUsersMutations();

  const [roleModalUser, setRoleModalUser] = useState<UserResponse | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserResponse | null>(null);

  // ==========================================
  // 🎨 COMPONENTE AUXILIAR: BADGE DE CARGO (Cores Premium)
  // ==========================================
  const RoleBadge = ({ role }: { role: string }) => {
    switch (role) {
      case Role.ADMIN:
        return (
          <Badge
            variant="outline"
            className="gap-1.5 border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] text-indigo-500 sm:text-xs"
          >
            <ShieldAlert className="h-3 w-3" /> Admin
          </Badge>
        );
      case Role.SUPPORTER:
        return (
          <Badge
            variant="outline"
            className="gap-1.5 border-sky-500/20 bg-sky-500/10 px-2 py-0.5 text-[10px] text-sky-500 sm:text-xs"
          >
            <ShieldCheck className="h-3 w-3" /> Suporte
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="bg-muted text-muted-foreground gap-1.5 border-transparent px-2 py-0.5 text-[10px] font-normal sm:text-xs"
          >
            <UserIcon className="h-3 w-3" /> Cliente
          </Badge>
        );
    }
  };

  if (users.length === 0) {
    return (
      <div className="bg-card flex h-64 flex-col items-center justify-center rounded-lg border p-8 text-center shadow-sm">
        <UserIcon className="text-muted-foreground mb-4 h-10 w-10 opacity-20" />
        <h3 className="text-lg font-medium">Nenhum usuário encontrado</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Ajuste seus filtros ou termo de busca para tentar novamente.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Container com scroll-x escondido no desktop, mas ativo no mobile extremo */}
      <div className="bg-card overflow-x-auto rounded-md border shadow-sm">
        {/* min-w-[600px] garante que as colunas não vão se esmagar até sumir */}
        <Table className="min-w-150 md:min-w-full">
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[40%] pl-4 sm:pl-6">Usuário</TableHead>
              {/* Centralizado para dar alinhamento estético à Badge */}
              <TableHead className="w-[20%] text-center">Cargo</TableHead>
              <TableHead className="w-[30%] text-left">
                Data de Cadastro
              </TableHead>
              <TableHead className="w-[10%] pr-4 text-right sm:pr-6">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className="group hover:bg-muted/20 transition-colors"
              >
                {/* 👤 COLUNA: Nome e Email */}
                <TableCell className="py-3 pl-4 sm:pl-6">
                  <div className="flex flex-col">
                    <span className="text-foreground max-w-45 truncate text-sm font-medium sm:max-w-62.5 lg:max-w-87.5">
                      {user.name}
                    </span>
                    <span className="text-muted-foreground max-w-45 truncate text-xs sm:max-w-62.5 lg:max-w-87.5">
                      {user.email}
                    </span>
                  </div>
                </TableCell>

                {/* 🛡️ COLUNA: Cargo (Centralizada) */}
                <TableCell className="py-3 text-center">
                  <RoleBadge role={user.role} />
                </TableCell>

                {/* 📅 COLUNA: Data */}
                <TableCell className="text-muted-foreground py-3 text-left text-xs whitespace-nowrap">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </TableCell>

                {/* ⚙️ COLUNA: Ações */}
                <TableCell className="py-3 pr-4 text-right sm:pr-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      {/* Ring-offset-0 evita aquele quadrado branco feio ao focar */}
                      <Button
                        variant="ghost"
                        className="hover:bg-muted h-8 w-8 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      >
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    {/* SOLUÇÃO DA TRANSPARÊNCIA: bg-background sólido e z-50 */}
                    <DropdownMenuContent
                      align="end"
                      className="bg-background z-50 w-48 border opacity-100! shadow-lg"
                    >
                      <DropdownMenuLabel className="text-muted-foreground text-xs font-semibold">
                        Gerenciar Usuário
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setRoleModalUser(user)}
                        className="focus:bg-muted cursor-pointer"
                      >
                        <ShieldAlert className="text-primary mr-2 h-4 w-4" />
                        Alterar Cargo
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setUserToDelete(user)}
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir Usuário
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <UserRoleModal
        user={roleModalUser}
        isOpen={!!roleModalUser}
        onClose={() => setRoleModalUser(null)}
      />

      <AlertDialog
        open={!!userToDelete}
        onOpenChange={(open) => !open && setUserToDelete(null)}
      >
        <AlertDialogContent className="sm:max-w-106.25">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Excluir Usuário Absolutamente?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a excluir permanentemente o usuário{" "}
              <strong className="text-foreground font-medium">
                {userToDelete?.name}
              </strong>{" "}
              do sistema. Esta ação não pode ser desfeita. Todos os dados
              vinculados serão perdidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2 border-t pt-4 sm:gap-3">
            <AlertDialogCancel
              disabled={deleteUser.isPending}
              className="mt-0 w-full sm:w-auto"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (userToDelete) {
                  deleteUser.mutate(userToDelete.id, {
                    onSuccess: () => setUserToDelete(null),
                  });
                }
              }}
              disabled={deleteUser.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto"
            >
              {deleteUser.isPending ? "Excluindo..." : "Sim, Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
