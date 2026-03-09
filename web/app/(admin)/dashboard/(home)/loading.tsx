import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col space-y-8 p-4 sm:p-6 md:p-8">
      <div>
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="mt-2 h-4 w-48 rounded-md" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card rounded-2xl border p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Skeleton className="h-100 w-full rounded-2xl lg:col-span-2" />
        <Skeleton className="h-100 w-full rounded-2xl" />
      </div>
    </div>
  );
}
