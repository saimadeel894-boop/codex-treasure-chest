import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { SearchBar } from "@/components/site/SearchBar";
import { PropertyCard } from "@/components/site/PropertyCard";
import { listFeatured } from "@/lib/properties.functions";
import heroImg from "@/assets/marketplace/hero.jpg";

const featuredQuery = queryOptions({
  queryKey: ["featured"],
  queryFn: () => listFeatured(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Domicile — Buy, rent and discover Australian homes" },
      { name: "description", content: "The premium way to browse Australian property. Search homes for sale, rentals, and sold prices across every state." },
      { property: "og:title", content: "Domicile — Buy, rent and discover Australian homes" },
      { property: "og:description", content: "The premium way to browse Australian property. Search homes for sale, rentals, and sold prices across every state." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(featuredQuery),
  component: HomePage,
  errorComponent: ({ error }) => (
    <div className="p-8 text-center text-destructive">Failed to load: {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-8">Not found</div>,
});

const CITIES = [
  { name: "Sydney", state: "NSW" },
  { name: "Melbourne", state: "VIC" },
  { name: "Brisbane", state: "QLD" },
  { name: "Perth", state: "WA" },
  { name: "Adelaide", state: "SA" },
  { name: "Hobart", state: "TAS" },
];

function HomePage() {
  const { data: featured } = useSuspenseQuery(featuredQuery);
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="Australian coastal suburb at golden hour" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-ink/40 to-ink/70" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-36 flex flex-col items-center text-center text-background">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-medium text-white ring-1 ring-white/30">
            🇦🇺 Australia's premium property discovery
          </span>
          <h1 className="mt-6 font-display text-4xl md:text-6xl font-semibold leading-[1.05] max-w-3xl">
            Find a place that <span className="italic text-primary">feels like home</span>.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/85">
            Search thousands of homes for sale and for rent across every Australian state. Beautiful listings, no clutter.
          </p>
          <div className="mt-8 flex justify-center w-full">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink">Featured properties</h2>
            <p className="mt-2 text-muted-foreground">Handpicked homes from across Australia</p>
          </div>
          <Link to="/buy" className="text-sm font-semibold text-primary hover:underline">
            Browse all for sale →
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="mt-10 text-muted-foreground">No featured properties yet.</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => <PropertyCard key={p.id} p={p} />)}
          </div>
        )}
      </section>

      {/* Cities */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink">Explore by city</h2>
        <p className="mt-2 text-muted-foreground">Popular Australian markets</p>
        <div className="mt-8 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {CITIES.map((c) => (
            <Link
              key={c.name}
              to="/buy"
              search={{ location: c.name } as any}
              className="rounded-2xl border border-border bg-card px-4 py-6 text-center transition hover:border-primary hover:shadow-md"
            >
              <p className="font-display text-xl font-semibold text-ink">{c.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{c.state}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Value props */}
      <section className="bg-surface/60 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 grid gap-8 md:grid-cols-3">
          {[
            { t: "Every state, one place", d: "From Bondi to Fremantle — discover homes across Australia in a single feed." },
            { t: "Save what you love", d: "Sign in to bookmark listings and revisit them anytime, on any device." },
            { t: "Beautifully quiet UX", d: "No pop-ups, no noise. Just the properties, at a pace that suits you." },
          ].map((v) => (
            <div key={v.t} className="rounded-2xl bg-card p-6 border border-border">
              <h3 className="font-display text-xl font-semibold text-ink">{v.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
