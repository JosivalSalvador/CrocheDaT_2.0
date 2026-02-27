export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-8 p-6 lg:p-10">
      <header className="space-y-2">
        <div className="bg-muted h-8 w-48 rounded-md" />
        <div className="bg-muted h-4 w-64 rounded-md" />
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-card border-border h-32 rounded-xl border"
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="bg-card/30 border-border h-80 rounded-xl border lg:col-span-4" />
        <div className="bg-card/30 border-border h-80 rounded-xl border lg:col-span-3" />
      </div>
    </div>
  );
}
