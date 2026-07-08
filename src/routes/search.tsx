import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { FilterComponent } from "@/components/FilterComponent";
import { PropertyCard } from "@/components/PropertyCard";
import { properties } from "@/data/marketplace";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search properties | Nestoria Australia" },
      { name: "description", content: "Search homes for sale and rent across Australia." },
    ],
  }),
  component: SearchPage,
});

function getParam(search: URLSearchParams, key: string) {
  const v = search.get(key);
  return v && v !== "Any" && v !== "Any type" ? v : "";
}

function SearchPage() {
  const search = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-950">Search properties</h1>
        <p className="mt-2 text-slate-600">{filtered.length} results found</p>
      </header>
      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <FilterComponent />
        <div>
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
              <h2 className="text-lg font-bold text-slate-950">No properties match your filters</h2>
              <p className="mt-2 text-sm text-slate-600">Try adjusting or resetting your filters.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filtered.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
