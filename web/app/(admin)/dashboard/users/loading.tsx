import { Skeleton } from "@/components/ui/skeleton";

export default function UsersLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 pb-20 sm:p-6 md:space-y-8 md:p-8 md:pb-8">
      {/* HEADER SKELETON */}
      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 sm:h-10 sm:w-56" />
          <Skeleton className="h-4 w-72 sm:w-96" />
        </div>
      </div>

      <div className="relative z-10 space-y-4 sm:space-y-6">
        {/* FILTERS SKELETON */}
        <div className="flex w-full flex-row items-center gap-2 sm:gap-3">
          <Skeleton className="h-9 flex-1 sm:h-10 sm:max-w-xs" />
          <Skeleton className="h-9 w-9 shrink-0 sm:h-10 sm:w-45" />
        </div>

        {/* LIST/TABLE SKELETON */}
        <div className="bg-card space-y-4 rounded-md border p-4 shadow-sm">
          <div className="flex items-center justify-between border-b pb-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="hidden h-6 w-32 md:block" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div className="w-1/3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="hidden h-4 w-24 md:block" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
