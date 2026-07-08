import { Mail, Phone, Star } from "lucide-react";
import { Image } from "@/components/compat/Image";
import { Link } from "@/components/compat/Link";
import type { Agent } from "@/data/marketplace";
import { getAgencyById } from "@/data/marketplace";

type AgentCardProps = {
  agent: Agent;
};

export function AgentCard({ agent }: AgentCardProps) {
  const agency = getAgencyById(agent.agencyId);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex gap-4">
        <Image
          src={agent.image}
          alt={agent.name}
          width={88}
          height={88}
          className="size-22 rounded-lg object-cover"
        />
        <div className="min-w-0">
          <Link href={`/agents/${agent.id}`} className="text-lg font-bold text-slate-950 hover:text-emerald-800">
            {agent.name}
          </Link>
          <p className="mt-1 text-sm font-semibold text-slate-600">{agent.title}</p>
          <Link href={`/agencies/${agency.id}`} className="mt-1 block text-sm text-emerald-800 hover:text-emerald-900">
            {agency.name}
          </Link>
          <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <Star size={16} className="fill-amber-400 text-amber-400" aria-hidden="true" />
            {agent.rating} rating
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-y border-slate-100 py-4 text-sm">
        <div>
          <p className="font-bold text-slate-950">{agent.activeListings}</p>
          <p className="text-slate-500">Active listings</p>
        </div>
        <div>
          <p className="font-bold text-slate-950">{agent.soldLastYear}</p>
          <p className="text-slate-500">Sold last year</p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <a
          href={`tel:${agent.phone.replace(/\s/g, "")}`}
          className="flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
        >
          <Phone size={16} aria-hidden="true" />
          Call
        </a>
        <a
          href={`mailto:${agent.email}`}
          className="flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 text-sm font-bold text-white transition hover:bg-emerald-800"
        >
          <Mail size={16} aria-hidden="true" />
          Email
        </a>
      </div>
    </article>
  );
}
