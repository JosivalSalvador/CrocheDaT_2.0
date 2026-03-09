import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 pb-20 sm:p-6 md:space-y-8 md:p-8">
      {/* 🏷️ CABEÇALHO */}
      <div className="flex flex-col gap-2 sm:gap-4">
        <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
          Meu Perfil
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Gerencie suas informações pessoais e configurações de segurança.
        </p>
      </div>

      {/* 🧩 ÁREA DINÂMICA (Skeletons idênticos ao do page.tsx) */}
      <div className="relative z-10">
        <div className="space-y-6">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <Skeleton className="h-95 w-full rounded-xl" />
            <Skeleton className="h-95 w-full rounded-xl" />
          </div>
          <Skeleton className="h-37.5 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
