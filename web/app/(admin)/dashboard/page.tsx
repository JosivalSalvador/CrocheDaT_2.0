import { getSession } from "@/lib/auth/session";

export default async function AdminDashboardPage() {
  const session = await getSession();

  return (
    <div className="bg-grid-small-white/5 relative min-h-full w-full p-6 lg:p-10">
      <div className="bg-background pointer-events-none absolute inset-0 mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="relative z-10 space-y-8">
        <header>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground text-sm">
            Bem-vindo de volta, {session?.user.name.split(" ")[0]}. Aqui está o
            resumo operacional.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total de Encomendas" value="1,284" trend="+12%" />
          <StatCard label="Peças em Estoque" value="432" trend="-2%" />
          <StatCard label="Usuários Ativos" value="89" trend="+5%" />
          <StatCard label="Alertas" value="0" trend="Estável" isSuccess />
        </div>

        <div className="grid gap-6 lg:grid-cols-7">
          <div className="border-border bg-card/30 rounded-xl border p-6 shadow-sm backdrop-blur-sm lg:col-span-4">
            <h3 className="mb-4 text-lg font-medium">
              Visão Geral de Entregas
            </h3>
            {/* Ajustado para h-72 (escala padrão Tailwind) para evitar o warning do h-[300px] */}
            <div className="border-border/50 flex h-72 items-center justify-center rounded-lg border-2 border-dashed">
              <p className="text-muted-foreground text-sm italic">
                Aguardando integração com endpoint de métricas...
              </p>
            </div>
          </div>

          <div className="border-border bg-card/30 rounded-xl border p-6 shadow-sm backdrop-blur-sm lg:col-span-3">
            <h3 className="mb-4 text-lg font-medium">Ações Recentes</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 text-sm">
                  <div className="bg-primary/60 h-2 w-2 rounded-full" />
                  <div className="border-border/50 flex-1 border-b pb-2">
                    <p className="font-medium">Atualização de sistema</p>
                    <p className="text-muted-foreground text-xs">
                      Há {i * 10} min
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  trend,
  isSuccess,
}: {
  label: string;
  value: string;
  trend: string;
  isSuccess?: boolean;
}) {
  return (
    <div className="border-border bg-card hover:border-primary/30 rounded-xl border p-6 shadow-sm transition-all">
      <p className="text-muted-foreground text-sm font-medium">{label}</p>
      <div className="mt-2 flex items-baseline justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            isSuccess
              ? "bg-green-500/10 text-green-500"
              : "bg-primary/10 text-primary"
          }`}
        >
          {trend}
        </span>
      </div>
    </div>
  );
}
