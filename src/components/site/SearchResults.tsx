import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { PropertyCard } from "@/components/site/PropertyCard";
import { SearchBar } from "@/components/site/SearchBar";
import { listProperties, type ListingType } from "@/lib/properties.functions";

export type SearchParams = {
  location: string;
  propertyType: string;
  minBeds: number;
  minBaths: number;
  minParking: number;
  minPrice: number;
  maxPrice: number;
  sort: string;
};

export function validateSearchParams(input: Record<string, unknown>): SearchParams {
  const num = (v: unknown) => {
    const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
    return Number.isFinite(n) ? n : 0;
  };
  const str = (v: unknown, d = "") => (typeof v === "string" ? v : d);
  return {
    location: str(input.location, ""),
    propertyType: str(input.propertyType, "any"),
    minBeds: num(input.minBeds),
    minBaths: num(input.minBaths),
    minParking: num(input.minParking),
    minPrice: num(input.minPrice),
    maxPrice: num(input.maxPrice),
    sort: str(input.sort, "newest"),
  };
}

export function searchQuery(listingType: ListingType, s: SearchParams) {
  return queryOptions({
    queryKey: ["properties", listingType, s],
    queryFn: () =>
      listProperties({
        data: {
          listingType,
          location: s.location || undefined,
          propertyType: (s.propertyType as any) || "any",
          minBeds: s.minBeds || undefined,
          minBaths: s.minBaths || undefined,
          minParking: s.minParking || undefined,
          minPrice: s.minPrice || undefined,
          maxPrice: s.maxPrice || undefined,
          sort: (s.sort as any) || "newest",
        },
      }),
  });
}

const TYPES = [
  { v: "any", l: "Any type" },
  { v: "house", l: "House" },
  { v: "apartment", l: "Apartment" },
  { v: "townhouse", l: "Townhouse" },
  { v: "land", l: "Land" },
  { v: "rural", l: "Rural" },
];

const SORTS = [
  { v: "newest", l: "Newest" },
  { v: "price_asc", l: "Price: low → high" },
  { v: "price_desc", l: "Price: high → low" },
];

export function SearchResults({
  listingType,
  search,
  title,
  intro,
}: {
  listingType: ListingType;
  search: SearchParams;
  title: string;
  intro: string;
}) {
  const navigate = useNavigate();
  const { data: properties } = useSuspenseQuery(searchQuery(listingType, search));

  const update = (patch: Partial<SearchParams>) => {
    navigate({ search: ((prev: any) => ({ ...prev, ...patch })) as any });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-start justify-between flex-wrap gap-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink">{title}</h1>
          <p className="mt-2 text-muted-foreground">{intro}</p>
        </div>
      </div>

      <div className="mt-6">
        <SearchBar
          initialTab={listingType}
          initialLocation={search.location}
          variant="inline"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3 items-center">
        <select
          value={search.propertyType}
          onChange={(e) => update({ propertyType: e.target.value })}
          className="rounded-full border border-border bg-card px-4 py-2 text-sm text-ink"
        >
          {TYPES.map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}
        </select>
        <select
          value={String(search.minBeds)}
          onChange={(e) => update({ minBeds: Number(e.target.value) })}
          className="rounded-full border border-border bg-card px-4 py-2 text-sm text-ink"
        >
          <option value="0">Any beds</option>
          {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+ beds</option>)}
        </select>
        <select
          value={String(search.minBaths)}
          onChange={(e) => update({ minBaths: Number(e.target.value) })}
          className="rounded-full border border-border bg-card px-4 py-2 text-sm text-ink"
        >
          <option value="0">Any baths</option>
          {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}+ baths</option>)}
        </select>
        <select
          value={String(search.minParking)}
          onChange={(e) => update({ minParking: Number(e.target.value) })}
          className="rounded-full border border-border bg-card px-4 py-2 text-sm text-ink"
        >
          <option value="0">Any parking</option>
          {[1, 2, 3].map((n) => <option key={n} value={n}>{n}+ parking</option>)}
        </select>
        <input
          type="number"
          min={0}
          placeholder="Min $"
          value={search.minPrice || ""}
          onChange={(e) => update({ minPrice: Number(e.target.value) || 0 })}
          className="w-28 rounded-full border border-border bg-card px-4 py-2 text-sm text-ink"
        />
        <input
          type="number"
          min={0}
          placeholder="Max $"
          value={search.maxPrice || ""}
          onChange={(e) => update({ maxPrice: Number(e.target.value) || 0 })}
          className="w-28 rounded-full border border-border bg-card px-4 py-2 text-sm text-ink"
        />
        <select
          value={search.sort}
          onChange={(e) => update({ sort: e.target.value })}
          className="ml-auto rounded-full border border-border bg-card px-4 py-2 text-sm text-ink"
        >
          {SORTS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
        </select>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {properties.length} {properties.length === 1 ? "property" : "properties"} found
      </p>

      {properties.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <h3 className="font-display text-xl text-ink">No matches</h3>
          <p className="mt-2 text-muted-foreground">Try broadening your filters or searching another suburb.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => <PropertyCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}
