import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@/components/compat/Link";
import { Pagination } from "@/components/Pagination";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyCardSkeletonGrid } from "@/components/PropertyCardSkeleton";
import { useFavorites } from "@/hooks/use-favorites";
import { properties } from "@/data/marketplace";

const PER_PAGE = 9;

export const Route = createFileRoute("/saved-properties")({
  head: () => ({
    meta: [
      { title: "Saved properties | Nestoria" },
      {
        name: "description",
        content:
          "View and search your saved Australian properties on Nestoria. Get alerts for new listings that match your saved searches.",
      },
      { property: "og:title", content: "Saved properties | Nestoria" },
      {
        property: "og:description",
        content:
          "View and search your saved Australian properties on Nestoria.",
      },
      { property: "og:url", content: "/saved-properties" },
    ],
    links: [{ rel: "canonical", href: "/saved-properties" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SearchResultsPage",
          name: "Saved properties",
          url: "https://project--a0d96297-61d4-4523-ae1a-a95bf868e3f0.lovable.app/saved-properties",
          isPartOf: {
            "@id": "https://project--a0d96297-61d4-4523-ae1a-a95bf868e3f0.lovable.app/#website",
          },
          about: {
            "@type": "Thing",
            name: "Saved property searches on Nestoria Australia",
          },
          potentialAction: {
            "@type": "SearchAction",
            name: "Search saved properties",
            target: {
              "@type": "EntryPoint",
              urlTemplate:
                "https://project--a0d96297-61d4-4523-ae1a-a95bf868e3f0.lovable.app/saved-properties?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
        }),
      },
    ],
  }),
  component: SavedProperties,
});

function SavedProperties() {
  const { ids } = useFavorites();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const saved = useMemo(() => properties.filter((p) => ids.includes(p.id)), [ids]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [saved.length]);

  const totalPages = Math.max(1, Math.ceil(saved.length / PER_PAGE));
  const pageItems = saved.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-wrap items-center gap-3">
        <Heart className="text-primary" aria-hidden="true" />
        <h1 className="font-serif text-h2 text-charcoal">Saved properties</h1>
        {hydrated && saved.length > 0 && (
          <span className="text-caption text-muted-foreground">({saved.length})</span>
        )}
      </header>

      {!hydrated ? (
        <PropertyCardSkeletonGrid count={6} />
      ) : saved.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/70 bg-surface p-12 text-center">
          <p className="text-eyebrow text-primary">Nothing here yet</p>
          <h2 className="mt-2 font-serif text-h3 text-charcoal">Your shortlist is empty</h2>
          <p className="mx-auto mt-3 max-w-md text-caption text-muted-foreground">
            Tap the heart on any listing to keep it close. We'll notify you when the price or status changes.
          </p>
          <Link
            href="/search"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-caption font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Browse properties →
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={setPage}
            totalItems={saved.length}
            perPage={PER_PAGE}
          />
        </>
      )}
    </div>
  );
}
