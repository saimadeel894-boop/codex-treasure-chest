import { AlertCircle, CheckCircle2, Loader2, Mail, MessageCircle, Phone, Send, User } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { Agent, Property } from "@/data/marketplace";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

type ContactAgentFormProps = {
  agent: Agent;
  property?: Property;
};

export function ContactAgentForm({ agent, property }: ContactAgentFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!property) {
      setError("This form is not linked to a listing.");
      return;
    }
    setError(null);
    setLoading(true);
    const fd = new FormData(event.currentTarget);
    const payload = {
      property_id: property.id,
      from_user_id: user?.id ?? null,
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim() || null,
      message: String(fd.get("message") || "").trim(),
    };
    const { error: err } = await supabase.from("property_inquiries").insert(payload);
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSubmitted(true);
    (event.target as HTMLFormElement).reset();
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="rounded-lg bg-slate-50 p-4">
        <p className="text-caption font-semibold text-charcoal">Contact {agent.name}</p>
        <p className="mt-1 text-caption text-charcoal-soft">
          {property ? `About ${property.title}` : "Ask about a listing, appraisal, or inspection."}
        </p>
      </div>

      <label className="block text-caption font-semibold text-charcoal">
        Name
        <span className="relative mt-2 block">
          <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
          <input required name="name" minLength={2} placeholder="Alex Johnson"
            className="h-12 w-full rounded-md border border-slate-200 pl-10 pr-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
        </span>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-caption font-semibold text-charcoal">
          Email
          <span className="relative mt-2 block">
            <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
            <input required type="email" name="email" placeholder="alex@example.com"
              className="h-12 w-full rounded-md border border-slate-200 pl-10 pr-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
          </span>
        </label>
        <label className="block text-caption font-semibold text-charcoal">
          Phone
          <span className="relative mt-2 block">
            <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
            <input name="phone" minLength={8} placeholder="0400 000 000"
              className="h-12 w-full rounded-md border border-slate-200 pl-10 pr-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
          </span>
        </label>
      </div>

      <label className="block text-caption font-semibold text-charcoal">
        Message
        <span className="relative mt-2 block">
          <MessageCircle className="pointer-events-none absolute left-3 top-4 text-slate-400" size={18} aria-hidden="true" />
          <textarea required name="message" minLength={10} rows={5}
            defaultValue={property ? `Hi ${agent.name}, I would like to know more about ${property.address}, ${property.suburb}.` : undefined}
            placeholder="How can the agent help?"
            className="w-full rounded-md border border-slate-200 py-3 pl-10 pr-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
        </span>
      </label>

      {error ? (
        <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-caption font-semibold text-rose-800">
          <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </div>
      ) : null}
      {submitted ? (
        <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-caption font-semibold text-emerald-800">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          Enquiry sent. The agent will be in touch shortly.
        </div>
      ) : null}

      <button type="submit" disabled={loading}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-emerald-700 text-caption font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60">
        {loading ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}
        {loading ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
