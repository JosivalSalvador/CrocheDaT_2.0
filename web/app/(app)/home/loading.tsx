export default function LoadingHome() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-6 md:py-10">
      <div className="space-y-2">
        <div className="bg-muted h-6 w-40 animate-pulse rounded" />

        <div className="bg-muted h-4 w-60 animate-pulse rounded" />
      </div>

      <div className="space-y-4">
        <div className="bg-muted h-5 w-32 animate-pulse rounded" />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card rounded-2xl border p-4">
              <div className="bg-muted mb-3 h-16 animate-pulse rounded" />

              <div className="bg-muted h-4 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-muted h-5 w-40 animate-pulse rounded" />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-card rounded-2xl border p-3">
              <div className="bg-muted aspect-square animate-pulse rounded" />

              <div className="bg-muted mt-3 h-4 animate-pulse rounded" />

              <div className="bg-muted mt-2 h-3 w-16 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
