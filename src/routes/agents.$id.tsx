import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Mail, Phone } from "lucide-react";
import { Link } from "@/components/compat/Link";
import { PropertyCard } from "@/components/PropertyCard";
import { fetchAgencyById, fetchAgentBySlug, fetchPropertiesByAgent } from "@/lib/directory-service";

export const Route = createFileRoute("/agents/$id")({
  head: ({ params }) => ({
    meta: [{ title: "Agent | Nestoria" }],
    links: [{ rel: "canonical", href: `/agents/${params.id}` }],
  }),
  component: AgentPage,
});

function AgentPage() {
  const { id } = Route.useParams();
  const { data: agent, isLoading } = useQuery({ queryKey: ["agent", id], queryFn: () => fetchAgentBySlug(id) });
  const { data: agency } = useQuery({
    queryKey: ["agency-by-id", agent?.agencyId],
    queryFn: () => (agent?.agencyId ? fetchAgencyById(agent.agencyId) : Promise.resolve(null)),
    enabled: !!agent?.agencyId,
  });
  const { data: listings = [] } = useQuery({
    queryKey: ["properties-by-agent", agent?.id],
    queryFn: () => (agent ? fetchPropertiesByAgent(agent.id) : Promise.resolve([])),
    enabled: !!agent,
  });

  if (isLoading) return <div className="mx-auto max-w-3xl px-4 py-24 text-center text-slate-500">Loading…</div>;
  if (!agent) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-slate-950">Agent not found</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row">
          <img src={agent.image} alt={agent.name} className="size-32 rounded-lg object-cover" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-950">{agent.name}</h1>
            {agent.title && <p className="mt-1 text-slate-600">{agent.title}</p>}
            {agency && (
              <Link href={`/agencies/${agency.slug}`} className="mt-1 block font-semibold text-emerald-800 hover:text-emerald-900">
                {agency.name}
              </Link>
            )}
            {agent.yearsExperience != null && (
              <p className="mt-3 text-sm text-slate-600">{agent.yearsExperience} years experience</p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {agent.phone && (
                <a href={`tel:${agent.phone}`} className="flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800">
                  <Phone size={16} /> {agent.phone}
                </a>
              )}
              {agent.email && (
                <a href={`mailto:${agent.email}`} className="flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800">
                  <Mail size={16} /> Email
                </a>
              )}
            </div>
          </div>
        </div>
        {agent.bio && <p className="mt-6 leading-7 text-slate-700">{agent.bio}</p>}
        {agent.specialties.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {agent.specialties.map((s) => (
              <span key={s} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">{s}</span>
            ))}
          </div>
        )}
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-slate-950">Current listings ({listings.length})</h2>
        {listings.length === 0 ? (
          <p className="mt-4 text-slate-600">No active listings.</p>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
