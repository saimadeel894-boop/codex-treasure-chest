import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Link } from "@/components/compat/Link";
import { PropertyCard } from "@/components/PropertyCard";
import { properties } from "@/data/marketplace";

export const Route = createFileRoute("/saved-properties")({
  head: () => ({ meta: [{ title: "Saved properties | Nestoria" }] }),
  component: SavedProperties,
});

function SavedProperties() {
  // Mock: pretend the first two are saved
  const saved = properties.slice(0, 2);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 flex items-center gap-3">
        <Heart className="text-rose-500" aria-hidden="true" />
        <h1 className="text-3xl font-bold text-slate-950">Saved properties</h1>
      </header>
      {saved.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-slate-600">You haven't saved any properties yet.</p>
          <Link href="/search" className="mt-4 inline-block font-bold text-emerald-800 hover:text-emerald-900">
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
