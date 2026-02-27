// app/(admin)/_components/stats-card.tsx
interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  isSuccess?: boolean;
}

export function StatCard({ label, value, trend, isSuccess }: StatCardProps) {
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
