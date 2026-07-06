import { createFileRoute, notFound } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { AgentCard } from "@/components/AgentCard";
import { PropertyCard } from "@/components/PropertyCard";
import { agents, getAgencyById, getPropertiesForAgency } from "@/data/marketplace";

export const Route = createFileRoute("/agencies/$id")({
  head: ({ params }) => {
    const a = getAgencyById(params.id);
    return { meta: [{ title: a ? `${a.name} | Agency | Nestoria` : "Agency" }] };
  },
  loader: ({ params }) => {
    const agency = getAgencyById(params.id);
    if (!agency) throw notFound();
    return { agency };
  },
  component: AgencyPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-slate-950">Agency not found</h1>
    </div>
  ),
});

function AgencyPage() {
  const { agency } = Route.useLoaderData();
  const teamAgents = agents.filter((a) => a.agencyId === agency.id);
  const listings = getPropertiesForAgency(agency.id);

  return (
    <div>
      <div className="relative h-64 sm:h-80">
        <img src={agency.heroImage} alt={agency.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-slate-950/60" />
        <div className="relative mx-auto flex h-full max-w-7xl items-end px-4 pb-8 sm:px-6 lg:px-8">
          <div className="text-white">
            <p className="text-sm font-bold uppercase tracking-wider text-emerald-300">{agency.initials}</p>
            <h1 className="mt-1 text-4xl font-bold">{agency.name}</h1>
            <p className="mt-2 flex items-center gap-2"><MapPin size={16} /> {agency.suburb}, {agency.state}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="leading-7 text-slate-700">{agency.description}</p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <Stat value={agency.stats.listings} label="Listings" />
              <Stat value={agency.stats.agents} label="Agents" />
              <Stat value={agency.stats.years} label="Years" />
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="font-bold text-slate-950">Contact</h2>
            <a href={`tel:${agency.phone}`} className="mt-3 flex items-center gap-2 text-slate-700 hover:text-emerald-800">
              <Phone size={16} /> {agency.phone}
            </a>
            <a href={`mailto:${agency.email}`} className="mt-2 flex items-center gap-2 text-slate-700 hover:text-emerald-800">
              <Mail size={16} /> {agency.email}
            </a>
          </div>
        </div>

        {teamAgents.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-slate-950">Our team</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {teamAgents.map((a) => <AgentCard key={a.id} agent={a} />)}
            </div>
          </section>
        )}

        {listings.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-slate-950">Current listings</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 text-center">
      <p className="text-2xl font-bold text-slate-950">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}
