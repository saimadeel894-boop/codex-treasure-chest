import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Mail, MapPin, Phone } from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import { Link } from "@/components/compat/Link";
import {
  fetchAgencyBySlug,
  fetchAgentsForAgency,
  fetchPropertiesByAgency,
} from "@/lib/directory-service";

export const Route = createFileRoute("/agencies/$id")({
  head: ({ params }) => ({
    meta: [{ title: "Agency | Real Estate Marketplace" }],
    links: [{ rel: "canonical", href: `/agencies/${params.id}` }],
  }),
  component: AgencyPage,
});

function AgencyPage() {
  const { id } = Route.useParams();
  const { data: agency, isLoading } = useQuery({ queryKey: ["agency", id], queryFn: () => fetchAgencyBySlug(id) });
  const { data: team = [] } = useQuery({
    queryKey: ["agency-team", agency?.id],
    queryFn: () => (agency ? fetchAgentsForAgency(agency.id) : Promise.resolve([])),
    enabled: !!agency,
  });
  const { data: listings = [] } = useQuery({
    queryKey: ["agency-listings", agency?.id],
    queryFn: () => (agency ? fetchPropertiesByAgency(agency.id) : Promise.resolve([])),
    enabled: !!agency,
  });

  if (isLoading) return <div className="mx-auto max-w-3xl px-4 py-24 text-center text-slate-500">Loading…</div>;
  if (!agency) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-slate-950">Agency not found</h1>
      </div>
    );
  }

  return (
    <div>
      <div className="relative min-h-[16rem] sm:min-h-80">
        <img src={agency.heroImage} alt={agency.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-slate-950/60" />
        <div className="relative mx-auto flex min-h-[16rem] max-w-7xl items-end px-4 py-8 sm:min-h-80 sm:px-6 lg:px-8">
          <div className="min-w-0 text-white">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-300 sm:text-sm">{agency.initials}</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl md:text-4xl">{agency.name}</h1>
            <p className="mt-2 flex items-center gap-2 text-sm sm:text-base"><MapPin size={16} className="shrink-0" /> <span className="truncate">{agency.suburb}, {agency.state}</span></p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            {agency.description && <p className="leading-7 text-slate-700">{agency.description}</p>}
            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
              <Stat value={listings.length} label="Listings" />
              <Stat value={team.length} label="Agents" />
              <Stat value={new Date().getFullYear() - 2010} label="Years" />
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="font-bold text-slate-950">Contact</h2>
            {agency.phone && (
              <a href={`tel:${agency.phone}`} className="mt-3 flex items-center gap-2 text-slate-700 hover:text-emerald-800">
                <Phone size={16} /> {agency.phone}
              </a>
            )}
            {agency.email && (
              <a href={`mailto:${agency.email}`} className="mt-2 flex items-center gap-2 text-slate-700 hover:text-emerald-800">
                <Mail size={16} /> {agency.email}
              </a>
            )}
          </div>
        </div>

        {team.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-slate-950">Our team</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {team.map((a) => (
                <Link key={a.id} href={`/agents/${a.slug}`} className="group flex gap-4 rounded-lg border border-slate-200 bg-white p-4 transition hover:border-emerald-300 hover:shadow-md">
                  <img src={a.image} alt={a.name} className="size-16 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-slate-950 group-hover:text-emerald-800">{a.name}</p>
                    {a.title && <p className="text-sm text-slate-600">{a.title}</p>}
                  </div>
                </Link>
              ))}
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
