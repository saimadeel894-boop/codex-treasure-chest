import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@/components/compat/Link";
import { FilterComponent } from "@/components/FilterComponent";
import { Pagination } from "@/components/Pagination";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyCardSkeletonGrid } from "@/components/PropertyCardSkeleton";
import { fetchPublishedProperties, type PropertyFilters } from "@/lib/property-service";

const PER_PAGE = 8;

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search properties | Nestoria Australia" },
      { name: "description", content: "Search homes for sale and rent across Australia." },
      { property: "og:title", content: "Search properties | Nestoria Australia" },
      { property: "og:description", content: "Search homes for sale and rent across Australia." },
      { property: "og:url", content: "/search" },
    ],
    links: [{ rel: "canonical", href: "/search" }],
  }),
  component: SearchPage,
});

function getParam(search: URLSearchParams, key: string) {
  const v = search.get(key);
  return v && v !== "Any" && v !== "Any type" ? v : "";
}

function SearchPage() {
  const [page, setPage] = useState(1);
  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    setSearchString(typeof window !== "undefined" ? window.location.search : "");
    const onPop = () => setSearchString(window.location.search);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const filters: PropertyFilters = useMemo(() => {
    const s = new URLSearchParams(searchString);
    const mode = (s.get("mode") || "").toLowerCase();
    return {
      mode: mode === "rent" ? "rent" : mode === "buy" ? "buy" : "",
      state: getParam(s, "state"),
      suburb: getParam(s, "suburb"),
      location: s.get("location") ?? undefined,
      type: getParam(s, "type"),
      minPrice: Number(getParam(s, "minPrice")) || undefined,
      maxPrice: Number(getParam(s, "maxPrice")) || undefined,
      bedrooms: parseInt(getParam(s, "bedrooms")) || undefined,
      bathrooms: parseInt(getParam(s, "bathrooms")) || undefined,
      parking: parseInt(getParam(s, "parking")) || undefined,
    };
  }, [searchString]);

  const { data: results = [], isLoading, error } = useQuery({
    queryKey: ["search", filters],
    queryFn: () => fetchPublishedProperties(filters),
  });

  useEffect(() => setPage(1), [results.length]);

  const totalPages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const pageItems = results.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="text-eyebrow text-primary">Marketplace</p>
        <h1 className="mt-2 font-serif text-h2 text-charcoal">Search properties</h1>
        <p className="mt-2 text-caption text-muted-foreground">
          {isLoading ? "Loading listings…" : `${results.length} results found`}
        </p>
      </header>
      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <FilterComponent />
        <div>
          {isLoading ? (
            <PropertyCardSkeletonGrid count={4} columns="md:grid-cols-2" />
          ) : error ? (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-caption text-rose-700">
              Could not load listings. Please retry.
            </div>
          ) : results.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border/70 bg-surface p-12 text-center">
              <p className="text-eyebrow text-primary">No matches</p>
              <h2 className="mt-2 font-serif text-h3 text-charcoal">No properties match your filters</h2>
              <p className="mx-auto mt-3 max-w-md text-caption text-muted-foreground">
                Try widening your price range, removing a suburb, or clearing filters to see more homes.
              </p>
              <Link href="/search"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-caption font-semibold text-charcoal transition hover:border-primary hover:text-primary">
                Reset filters
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                {pageItems.map((p) => <PropertyCard key={p.id} property={p} />)}
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={(next) => {
                  setPage(next);
                  if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                totalItems={results.length}
                perPage={PER_PAGE}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
