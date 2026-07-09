import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Link } from "@/components/compat/Link";
import { PropertyCard } from "@/components/PropertyCard";
import { useFavorites } from "@/hooks/use-favorites";
import { properties } from "@/data/marketplace";

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
  const saved = properties.filter((p) => ids.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 flex items-center gap-3">
        <Heart className="text-primary" aria-hidden="true" />
        <h1 className="font-serif text-h2 text-charcoal">Saved properties</h1>
        {saved.length > 0 && (
          <span className="text-caption text-muted-foreground">({saved.length})</span>
        )}
      </header>
      {saved.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/70 bg-surface p-12 text-center">
          <p className="text-caption text-muted-foreground">You haven't saved any properties yet.</p>
          <Link href="/search" className="mt-4 inline-block text-caption font-semibold text-primary hover:underline">
            Browse properties →
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {saved.map((p) => <PropertyCard key={p.id} property={p} />)}
        </div>
      )}
    </div>
  );
}
