import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Building2, MapPin, ShieldCheck, TrendingUp } from "lucide-react";
import { Image } from "@/components/compat/Image";
import { Link } from "@/components/compat/Link";
import { AgentCard } from "@/components/AgentCard";
import { PropertyCard } from "@/components/PropertyCard";
import { SearchComponent } from "@/components/SearchComponent";
import { agents, popularLocations, properties } from "@/data/marketplace";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nestoria Australia | Property Marketplace" },
      {
        name: "description",
        content:
          "A modern Australian real estate marketplace for buying, renting, listing, and discovering properties.",
      },
      { property: "og:title", content: "Nestoria Australia | Property Marketplace" },
      {
        property: "og:description",
        content:
          "Buy, rent, sell and discover premium homes across Australia in a polished marketplace experience.",
      },
    ],
  }),
  component: Home,
});

const featureHighlights = [
  {
    title: "Verified listing flows",
    text: "Clean listing cards, enquiry paths, and seller-friendly presentation are ready for backend connection.",
    icon: ShieldCheck,
  },
  {
    title: "Suburb-first discovery",
    text: "Search and popular location sections are structured for future maps, school zones, and market data.",
    icon: MapPin,
  },
  {
    title: "Growth-ready UI",
    text: "The frontend supports future valuation tools, agent analytics, subscriptions, and saved searches.",
    icon: TrendingUp,
  },
];

function Home() {
  const featuredProperties = properties.slice(0, 3);
  const latestProperties = properties.slice(3);

  return (
    <>
      <section className="relative isolate min-h-[620px] overflow-hidden bg-slate-950">
        <Image
          src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=2200&q=80"
          alt="Modern Australian home exterior"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="relative mx-auto flex min-h-[620px] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-md bg-white/15 px-3 py-1.5 text-sm font-bold text-white backdrop-blur">
              Buy, rent, sell and discover property across Australia
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-6xl">
              Find your next Australian address with confidence.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-100">
              Search premium homes, rentals, agencies, and local market opportunities in a polished
              marketplace experience built for modern buyers and sellers.
            </p>
          </div>

          <div className="mt-9 max-w-5xl">
            <SearchComponent />
          </div>

          <div className="mt-8 grid max-w-3xl gap-3 text-white sm:grid-cols-3">
            <div>
              <p className="text-3xl font-bold">38k+</p>
              <p className="text-sm text-slate-200">Australian listings</p>
            </div>
            <div>
              <p className="text-3xl font-bold">720+</p>
              <p className="text-sm text-slate-200">Agent partners</p>
            </div>
            <div>
              <p className="text-3xl font-bold">24/7</p>
              <p className="text-sm text-slate-200">Property discovery</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
                Featured properties
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">Fresh homes worth inspecting</h2>
            </div>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-900"
            >
              View all properties
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.65fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
                Buy or rent
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">
                Marketplace sections ready for every property journey
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                The UI separates buying, renting, agent discovery, and listing creation while
                keeping navigation simple on desktop and mobile.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {[
                  { label: "Buy a home", href: "/search?mode=buy" },
                  { label: "Rent a property", href: "/search?mode=rent" },
                  { label: "List with an agent", href: "/list-property" },
                  { label: "Explore agencies", href: "/agencies/harbour-north" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 text-sm font-bold text-slate-800 shadow-sm transition hover:border-emerald-300 hover:text-emerald-800"
                  >
                    {item.label}
                    <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {featureHighlights.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <span className="flex size-11 items-center justify-center rounded-md bg-emerald-100 text-emerald-800">
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-lg font-bold text-slate-950">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{feature.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
                Latest properties
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">Recently listed across Australia</h2>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
                Popular locations
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">Browse by capital city</h2>
            </div>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-900"
            >
              Explore suburbs
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularLocations.map((location) => (
              <Link
                key={`${location.name}-${location.state}`}
                href="/search"
                className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-lg hover:shadow-slate-950/5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-950 group-hover:text-emerald-800">
                      {location.name}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-slate-500">{location.state}</p>
                  </div>
                  <span className="flex size-11 items-center justify-center rounded-md bg-slate-100 text-emerald-800">
                    <Building2 size={21} aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-5 text-sm text-slate-600">
                  {location.listings.toLocaleString()} listings available
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.6fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
                Agent network
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">Meet the local experts</h2>
              <p className="mt-4 leading-7 text-slate-600">
                Agent profiles include listings, agency details, contact actions, and performance
                signals that can later be powered by verified sales data.
              </p>
              <Link
                href="/agents/mia-carter"
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
              >
                View agent profile
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
