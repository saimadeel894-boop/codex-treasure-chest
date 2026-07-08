

import { CheckCircle2, Mail, MessageCircle, Phone, Send, User } from "lucide-react";
import { useState } from "react";
import type { Agent, Property } from "@/data/marketplace";

type ContactAgentFormProps = {
  agent: Agent;
  property?: Property;
};

export function ContactAgentForm({ agent, property }: ContactAgentFormProps) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        setSubmitted(form.checkValidity());
        form.reportValidity();
      }}
    >
      <div className="rounded-lg bg-slate-50 p-4">
        <p className="text-sm font-bold text-slate-950">Contact {agent.name}</p>
        <p className="mt-1 text-sm text-slate-600">
          {property ? `About ${property.title}` : "Ask about a listing, appraisal, or inspection."}
        </p>
      </div>

      <label className="block text-sm font-semibold text-slate-700">
        Name
        <span className="relative mt-2 block">
          <User
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
            aria-hidden="true"
          />
          <input
            required
            name="name"
            minLength={2}
            placeholder="Alex Johnson"
            className="h-12 w-full rounded-md border border-slate-200 pl-10 pr-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </span>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700">
          Email
          <span className="relative mt-2 block">
            <Mail
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
              aria-hidden="true"
            />
            <input
              required
              type="email"
              name="email"
              placeholder="alex@example.com"
              className="h-12 w-full rounded-md border border-slate-200 pl-10 pr-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </span>
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Phone
          <span className="relative mt-2 block">
            <Phone
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
              aria-hidden="true"
            />
            <input
              required
              name="phone"
              minLength={8}
              placeholder="0400 000 000"
              className="h-12 w-full rounded-md border border-slate-200 pl-10 pr-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </span>
        </label>
      </div>

      <label className="block text-sm font-semibold text-slate-700">
        Message
        <span className="relative mt-2 block">
          <MessageCircle
            className="pointer-events-none absolute left-3 top-4 text-slate-400"
            size={18}
            aria-hidden="true"
          />
          <textarea
            required
            name="message"
            minLength={10}
            rows={5}
            defaultValue={
              property
                ? `Hi ${agent.name}, I would like to know more about ${property.address}, ${property.suburb}.`
                : undefined
            }
            placeholder="How can the agent help?"
            className="w-full rounded-md border border-slate-200 py-3 pl-10 pr-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </span>
      </label>

      {submitted ? (
        <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          Enquiry validated locally. Backend email/CRM delivery can be connected later.
        </div>
      ) : null}

      <button
        type="submit"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-emerald-700 text-sm font-bold text-white transition hover:bg-emerald-800"
      >
        <Send size={18} aria-hidden="true" />
        Send enquiry
      </button>
    </form>
  );
}
