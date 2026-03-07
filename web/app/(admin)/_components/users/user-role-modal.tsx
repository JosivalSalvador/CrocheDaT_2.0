"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldAlert, Loader2, Save } from "lucide-react";

import { updateRoleSchema } from "@/schemas/users.schema";
import { UpdateRoleInput, UserResponse } from "@/types/index";
import { Role } from "@/types/enums";
import { useUsersMutations } from "@/hooks/use-users";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface UserRoleModalProps {
  user: UserResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserRoleModal({ user, isOpen, onClose }: UserRoleModalProps) {
  const { updateRole } = useUsersMutations();

  const form = useForm<UpdateRoleInput>({
    resolver: zodResolver(updateRoleSchema),
    defaultValues: {
      role: Role.USER,
    },
  });

  useEffect(() => {
    if (user && isOpen) {
      form.reset({ role: user.role as Role });
    }
  }, [user, isOpen, form]);

  const onSubmit = (data: UpdateRoleInput) => {
    if (!user) return;

    if (data.role === user.role) {
      onClose();
      return;
    }

    updateRole.mutate(
      { id: user.id, data },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (updateRole.isPending) return;
    if (!open) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[95vw] rounded-xl p-4 sm:max-w-106.25 sm:p-6">
        <DialogHeader className="gap-1 text-left sm:gap-1.5">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <ShieldAlert className="text-primary h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
            Alterar Permissões
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Defina o nível de acesso para o usuário{" "}
            <strong className="text-foreground font-medium">
              {user?.name}
            </strong>
            .
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="role-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2 sm:py-4"
          >
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-1.5 sm:space-y-2">
                  <FormLabel className="text-xs sm:text-sm">
                    Novo Cargo
                  </FormLabel>
                  <Select
                    disabled={updateRole.isPending}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        id="role"
                        className="bg-background h-10 w-full text-xs sm:h-11 sm:text-sm"
                      >
                        <SelectValue placeholder="Selecione um cargo" />
                      </SelectTrigger>
                    </FormControl>

                    {/* 👇 MUDANÇAS AQUI: position, side, sideOffset e z-[100] corrigidos */}
                    <SelectContent
                      position="popper"
                      side="bottom"
                      align="start"
                      sideOffset={4}
                      className="bg-background z-100 border opacity-100! shadow-lg"
                    >
                      <SelectItem value={Role.ADMIN}>
                        Administrador (Acesso Total)
                      </SelectItem>
                      <SelectItem value={Role.SUPPORTER}>
                        Suporte (Apenas Chats/Pedidos)
                      </SelectItem>
                      <SelectItem value={Role.USER}>Cliente Comum</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px] sm:text-xs" />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3 sm:space-x-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={updateRole.isPending}
            className="mt-0 h-10 w-full text-xs sm:h-11 sm:w-auto sm:text-sm"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="role-form"
            disabled={updateRole.isPending || !form.formState.isDirty}
            className="mt-0 h-10 w-full text-xs sm:h-11 sm:w-auto sm:text-sm"
          >
            {updateRole.isPending ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 shrink-0 animate-spin sm:mr-2 sm:h-4 sm:w-4" />
            ) : (
              <Save className="mr-1.5 h-3.5 w-3.5 shrink-0 sm:mr-2 sm:h-4 sm:w-4" />
            )}
            Salvar Alteração
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
