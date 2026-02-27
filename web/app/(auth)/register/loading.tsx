export default function AuthLoading() {
  return (
    <div className="w-full animate-pulse space-y-6">
      <div className="space-y-2 text-center">
        <div className="bg-muted mx-auto h-8 w-48 rounded" />
        <div className="bg-muted mx-auto h-4 w-64 rounded" />
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="bg-muted h-4 w-20 rounded" />
            <div className="bg-muted h-10 w-full rounded-md" />
          </div>
        ))}
        <div className="bg-primary/20 mt-6 h-10 w-full rounded-md" />
      </div>
    </div>
  );
}
