import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@/components/compat/Link";
import { FilterComponent } from "@/components/FilterComponent";
import { Pagination } from "@/components/Pagination";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyCardSkeletonGrid } from "@/components/PropertyCardSkeleton";
import { properties } from "@/data/marketplace";

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
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SearchResultsPage",
          name: "Search properties",
          url: "https://project--a0d96297-61d4-4523-ae1a-a95bf868e3f0.lovable.app/search",
          isPartOf: {
            "@id": "https://project--a0d96297-61d4-4523-ae1a-a95bf868e3f0.lovable.app/#website",
          },
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate:
                "https://project--a0d96297-61d4-4523-ae1a-a95bf868e3f0.lovable.app/search?location={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
        }),
      },
    ],

  }),
  component: SearchPage,
});

function getParam(search: URLSearchParams, key: string) {
  const v = search.get(key);
  return v && v !== "Any" && v !== "Any type" ? v : "";
}

function SearchPage() {
  const [hydrated, setHydrated] = useState(false);
  const [page, setPage] = useState(1);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const search =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();

  const filtered = useMemo(() => {
    const mode = (search.get("mode") || "").toLowerCase();
    const state = getParam(search, "state");
    const suburb = (getParam(search, "suburb") || search.get("location") || "").toLowerCase();
    const type = getParam(search, "type");
    const minPrice = Number(getParam(search, "minPrice")) || 0;
    const maxPrice = Number(getParam(search, "maxPrice")) || Infinity;
    const beds = parseInt(getParam(search, "bedrooms")) || 0;
    const baths = parseInt(getParam(search, "bathrooms")) || 0;
    const parking = parseInt(getParam(search, "parking")) || 0;

    return properties.filter((p) => {
      if (mode && p.mode.toLowerCase() !== mode) return false;
      if (state && p.state !== state) return false;
      if (suburb && !`${p.suburb} ${p.address} ${p.postcode}`.toLowerCase().includes(suburb)) return false;
      if (type && p.propertyType !== type) return false;
      if (p.price < minPrice || p.price > maxPrice) return false;
      if (beds && p.bedrooms < beds) return false;
      if (baths && p.bathrooms < baths) return false;
      if (parking && p.parking < parking) return false;
      return true;
    });
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [filtered.length]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="text-eyebrow text-primary">Marketplace</p>
        <h1 className="mt-2 font-serif text-h2 text-charcoal">Search properties</h1>
        <p className="mt-2 text-caption text-muted-foreground">
          {hydrated ? `${filtered.length} results found` : "Loading listings…"}
        </p>
      </header>
      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <FilterComponent />
        <div>
          {!hydrated ? (
            <PropertyCardSkeletonGrid count={4} columns="md:grid-cols-2" />
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border/70 bg-surface p-12 text-center">
              <p className="text-eyebrow text-primary">No matches</p>
              <h2 className="mt-2 font-serif text-h3 text-charcoal">No properties match your filters</h2>
              <p className="mx-auto mt-3 max-w-md text-caption text-muted-foreground">
                Try widening your price range, removing a suburb, or clearing filters to see more homes.
              </p>
              <Link
                href="/search"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-caption font-semibold text-charcoal transition hover:border-primary hover:text-primary"
              >
                Reset filters
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                {pageItems.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={(next) => {
                  setPage(next);
                  if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                totalItems={filtered.length}
                perPage={PER_PAGE}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
