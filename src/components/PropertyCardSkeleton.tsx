export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border/70 bg-surface shadow-soft">
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <div className="space-y-4 p-6">
        <div className="space-y-2">
          <div className="h-3 w-24 animate-pulse rounded-full bg-muted" />
          <div className="h-5 w-3/4 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="h-3 w-1/2 animate-pulse rounded-full bg-muted" />
        <div className="grid grid-cols-4 gap-2 border-t border-border/70 pt-4">
          <div className="h-3 animate-pulse rounded-full bg-muted" />
          <div className="h-3 animate-pulse rounded-full bg-muted" />
          <div className="h-3 animate-pulse rounded-full bg-muted" />
          <div className="h-3 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
      <span className="sr-only">Loading listing…</span>
    </div>
  );
}

export function PropertyCardSkeletonGrid({
  count = 6,
  columns = "md:grid-cols-2 lg:grid-cols-3",
}: {
  count?: number;
  columns?: string;
}) {
  return (
    <div
      className={`grid gap-6 ${columns}`}
      role="status"
      aria-live="polite"
      aria-label="Loading listings"
    >
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}
