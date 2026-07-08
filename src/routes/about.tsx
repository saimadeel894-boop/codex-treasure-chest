import { createFileRoute } from "@tanstack/react-router";
import { Building2, Shield, TrendingUp, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | Nestoria Australia" },
      { name: "description", content: "Learn about Nestoria Australia — a modern property marketplace." },
    ],
  }),
  component: About,
});

const values = [
  { icon: Shield, title: "Trusted listings", text: "Verified data, transparent pricing, no clutter." },
  { icon: Users, title: "Agents you can reach", text: "Direct contact with local specialists." },
  { icon: TrendingUp, title: "Market intelligence", text: "Suburb-level insights to inform every decision." },
  { icon: Building2, title: "Every property type", text: "Houses, apartments, land and new developments." },
];

function About() {
  return (
    <div>
      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-300">About Nestoria</p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Making Australian property simple.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-200">
            We're building the property marketplace we always wanted — clear, fast, and honest.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <span className="flex size-11 items-center justify-center rounded-md bg-emerald-100 text-emerald-800">
                  <Icon size={22} />
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-950">{v.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{v.text}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
