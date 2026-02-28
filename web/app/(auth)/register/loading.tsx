export default function RegisterLoading() {
  return (
    <div className="w-full animate-pulse space-y-6">
      <div className="space-y-2 text-center">
        <div className="bg-muted mx-auto h-8 w-40 rounded" />
        <div className="bg-muted mx-auto h-4 w-64 rounded" />
      </div>
      <div className="space-y-4">
        <div className="bg-muted/50 h-11 w-full rounded-xl" />
        <div className="bg-muted/50 h-11 w-full rounded-xl" />
        <div className="bg-muted/50 h-11 w-full rounded-xl" />
        <div className="bg-muted/50 h-11 w-full rounded-xl" />
        <div className="bg-primary/20 h-11 w-full rounded-xl" />
      </div>
      <div className="bg-muted mx-auto h-4 w-40 rounded" />
    </div>
  );
}
