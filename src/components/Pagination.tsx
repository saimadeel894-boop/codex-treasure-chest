import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  totalItems?: number;
  perPage?: number;
};

function buildPages(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - (sorted[i - 1] as number) > 1) out.push("…");
    out.push(p);
  });
  return out;
}

export function Pagination({ page, totalPages, onChange, totalItems, perPage }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = buildPages(page, totalPages);
  const rangeStart = perPage ? (page - 1) * perPage + 1 : undefined;
  const rangeEnd = perPage && totalItems ? Math.min(page * perPage, totalItems) : undefined;

  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border/70 pt-6"
      aria-label="Pagination"
    >
      {rangeStart && totalItems ? (
        <p className="text-caption text-muted-foreground">
          Showing <span className="text-charcoal">{rangeStart}–{rangeEnd}</span> of{" "}
          <span className="text-charcoal">{totalItems}</span>
        </p>
      ) : (
        <p className="text-caption text-muted-foreground">
          Page <span className="text-charcoal">{page}</span> of{" "}
          <span className="text-charcoal">{totalPages}</span>
        </p>
      )}

      <ul className="flex items-center gap-1.5">
        <li>
          <button
            type="button"
            onClick={() => onChange(page - 1)}
            disabled={page <= 1}
            className="flex h-10 items-center gap-1.5 rounded-full border border-border px-4 text-eyebrow text-charcoal transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-charcoal"
            aria-label="Previous page"
          >
            <ChevronLeft size={14} aria-hidden="true" />
            Prev
          </button>
        </li>
        {pages.map((p, i) =>
          p === "…" ? (
            <li key={`gap-${i}`} className="px-1 text-caption text-muted-foreground" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                onClick={() => onChange(p)}
                aria-current={p === page ? "page" : undefined}
                className={
                  p === page
                    ? "flex size-10 items-center justify-center rounded-full bg-charcoal text-eyebrow text-background"
                    : "flex size-10 items-center justify-center rounded-full border border-border text-eyebrow text-charcoal transition hover:border-primary hover:text-primary"
                }
              >
                {p}
              </button>
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            onClick={() => onChange(page + 1)}
            disabled={page >= totalPages}
            className="flex h-10 items-center gap-1.5 rounded-full border border-border px-4 text-eyebrow text-charcoal transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-charcoal"
            aria-label="Next page"
          >
            Next
            <ChevronRight size={14} aria-hidden="true" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
