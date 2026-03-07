"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Lock,
  Save,
  Loader2,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
} from "lucide-react";

import { updateUserSchema, updatePasswordSchema } from "@/schemas/users.schema";
import {
  UpdateUserInput,
  UpdatePasswordInput,
  UserResponse,
} from "@/types/index";
import { useUsersMutations } from "@/hooks/use-users";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProfileFormProps {
  user: UserResponse;
}

// ==========================================
// 👁️ COMPONENTE AUXILIAR: Password Input
// ==========================================
const PasswordInput = ({
  disabled,
  ...props
}: React.ComponentProps<typeof Input>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        disabled={disabled}
        className={`pr-10 ${props.className || ""}`}
        {...props}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => setShowPassword(!showPassword)}
        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors disabled:opacity-50"
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
        ) : (
          <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
        )}
      </button>
    </div>
  );
};

export function ProfileForm({ user }: ProfileFormProps) {
  const { updateProfile, changePassword, deleteAccount } = useUsersMutations();

  // Estado simples para confirmar a deleção, evitando cliques acidentais
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // ==========================================
  // 📝 FORM 1: Dados Pessoais
  // ==========================================
  const formDados = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const onSubmitDados = (data: UpdateUserInput) => {
    if (data.name === user.name && data.email === user.email) return;
    updateProfile.mutate(data);
  };

  // ==========================================
  // 🔒 FORM 2: Segurança (Senha)
  // ==========================================
  const formSenha = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const onSubmitSenha = (data: UpdatePasswordInput) => {
    changePassword.mutate(data, {
      onSuccess: () => formSenha.reset(),
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid items-start gap-4 sm:gap-6 md:grid-cols-2">
        {/* ========================================== */}
        {/* 📝 CARD DE DADOS PESSOAIS                 */}
        {/* ========================================== */}
        <Card className="flex h-full flex-col overflow-hidden">
          <CardHeader className="gap-1 p-4 sm:gap-1.5 sm:p-6">
            <div className="flex items-center gap-2">
              <User className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
              <CardTitle className="text-lg sm:text-xl">
                Dados Pessoais
              </CardTitle>
            </div>
            <CardDescription className="text-xs sm:text-sm">
              Atualize suas informações básicas de contato.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 p-4 pt-0 sm:p-6 sm:pt-0">
            <form
              id="form-dados"
              onSubmit={formDados.handleSubmit(onSubmitDados)}
              className="space-y-3 sm:space-y-4"
            >
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="name" className="text-xs sm:text-sm">
                  Nome de Usuário
                </Label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  className="h-9 text-xs sm:h-10 sm:text-sm"
                  {...formDados.register("name")}
                  disabled={updateProfile.isPending}
                />
                {formDados.formState.errors.name && (
                  <span className="text-destructive text-[10px] sm:text-xs">
                    {formDados.formState.errors.name.message}
                  </span>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-xs sm:text-sm">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="h-9 text-xs sm:h-10 sm:text-sm"
                  {...formDados.register("email")}
                  disabled={updateProfile.isPending}
                />
                {formDados.formState.errors.email && (
                  <span className="text-destructive text-[10px] sm:text-xs">
                    {formDados.formState.errors.email.message}
                  </span>
                )}
              </div>
            </form>
          </CardContent>

          <CardFooter className="bg-muted/10 mt-auto border-t p-4 sm:p-6">
            <Button
              type="submit"
              form="form-dados"
              size="sm"
              className="ml-auto h-9 w-full text-xs sm:h-10 sm:w-auto sm:text-sm"
              disabled={updateProfile.isPending || !formDados.formState.isDirty}
            >
              {updateProfile.isPending ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 shrink-0 animate-spin sm:mr-2 sm:h-4 sm:w-4" />
              ) : (
                <Save className="mr-1.5 h-3.5 w-3.5 shrink-0 sm:mr-2 sm:h-4 sm:w-4" />
              )}
              Salvar Dados
            </Button>
          </CardFooter>
        </Card>

        {/* ========================================== */}
        {/* 🔒 CARD DE SENHA                          */}
        {/* ========================================== */}
        <Card className="flex h-full flex-col overflow-hidden">
          <CardHeader className="gap-1 p-4 sm:gap-1.5 sm:p-6">
            <div className="flex items-center gap-2">
              <Lock className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
              <CardTitle className="text-lg sm:text-xl">Segurança</CardTitle>
            </div>
            <CardDescription className="text-xs sm:text-sm">
              Altere sua senha de acesso ao sistema.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 p-4 pt-0 sm:p-6 sm:pt-0">
            <form
              id="form-senha"
              onSubmit={formSenha.handleSubmit(onSubmitSenha)}
              className="space-y-3 sm:space-y-4"
            >
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="oldPassword" className="text-xs sm:text-sm">
                  Senha Atual
                </Label>
                <PasswordInput
                  id="oldPassword"
                  placeholder="Digite sua senha atual"
                  className="h-9 text-xs sm:h-10 sm:text-sm"
                  {...formSenha.register("oldPassword")}
                  disabled={changePassword.isPending}
                />
                {formSenha.formState.errors.oldPassword && (
                  <span className="text-destructive text-[10px] sm:text-xs">
                    {formSenha.formState.errors.oldPassword.message}
                  </span>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="newPassword" className="text-xs sm:text-sm">
                  Nova Senha
                </Label>
                <PasswordInput
                  id="newPassword"
                  placeholder="Crie uma nova senha forte"
                  className="h-9 text-xs sm:h-10 sm:text-sm"
                  {...formSenha.register("newPassword")}
                  disabled={changePassword.isPending}
                />
                {formSenha.formState.errors.newPassword && (
                  <span className="text-destructive text-[10px] sm:text-xs">
                    {formSenha.formState.errors.newPassword.message}
                  </span>
                )}
              </div>
            </form>
          </CardContent>

          <CardFooter className="bg-muted/10 mt-auto border-t p-4 sm:p-6">
            <Button
              type="submit"
              form="form-senha"
              variant="secondary"
              size="sm"
              className="ml-auto h-9 w-full text-xs sm:h-10 sm:w-auto sm:text-sm"
              disabled={changePassword.isPending}
            >
              {changePassword.isPending ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 shrink-0 animate-spin sm:mr-2 sm:h-4 sm:w-4" />
              ) : (
                <Lock className="mr-1.5 h-3.5 w-3.5 shrink-0 sm:mr-2 sm:h-4 sm:w-4" />
              )}
              Atualizar Senha
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* ========================================== */}
      {/* ⚠️ DANGER ZONE: Excluir Conta              */}
      {/* ========================================== */}
      <Card className="border-destructive/20 bg-destructive/5 overflow-hidden">
        <CardHeader className="gap-1 p-4 sm:gap-1.5 sm:p-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-destructive h-4 w-4 sm:h-5 sm:w-5" />
            <CardTitle className="text-destructive text-lg sm:text-xl">
              Zona de Perigo
            </CardTitle>
          </div>
          <CardDescription className="text-xs sm:text-sm">
            Excluir sua conta é uma ação irreversível. Todos os seus dados serão
            apagados permanentemente.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          {isConfirmingDelete ? (
            <div className="space-y-3 sm:space-y-4">
              <p className="text-destructive text-xs font-medium sm:text-sm">
                Tem certeza absoluta? Esta ação não pode ser desfeita.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-full text-xs sm:h-10 sm:w-auto sm:text-sm"
                  onClick={() => setIsConfirmingDelete(false)}
                  disabled={deleteAccount.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-9 w-full text-xs sm:h-10 sm:w-auto sm:text-sm"
                  onClick={() => deleteAccount.mutate()}
                  disabled={deleteAccount.isPending}
                >
                  {deleteAccount.isPending ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 shrink-0 animate-spin sm:mr-2 sm:h-4 sm:w-4" />
                  ) : (
                    <Trash2 className="mr-1.5 h-3.5 w-3.5 shrink-0 sm:mr-2 sm:h-4 sm:w-4" />
                  )}
                  Sim, Excluir Minha Conta
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="destructive"
              size="sm"
              className="h-9 w-full text-xs sm:h-10 sm:w-auto sm:text-sm"
              onClick={() => setIsConfirmingDelete(true)}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5 shrink-0 sm:mr-2 sm:h-4 sm:w-4" />
              Excluir Minha Conta
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
