

import { CheckCircle2, Mail, MessageCircle, Send, User } from "lucide-react";
import { useState } from "react";

export function ContactForm() {
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
            minLength={2}
            placeholder="Alex Johnson"
            className="h-12 w-full rounded-md border border-slate-200 pl-10 pr-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </span>
      </label>
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
            placeholder="alex@example.com"
            className="h-12 w-full rounded-md border border-slate-200 pl-10 pr-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </span>
      </label>
      <label className="block text-sm font-semibold text-slate-700">
        Topic
        <select className="mt-2 h-12 w-full rounded-md border border-slate-200 bg-white px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100">
          <option>General enquiry</option>
          <option>Listing support</option>
          <option>Agent partnership</option>
          <option>Advertising</option>
        </select>
      </label>
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
            minLength={10}
            rows={5}
            placeholder="Tell us how we can help."
            className="w-full rounded-md border border-slate-200 py-3 pl-10 pr-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </span>
      </label>

      {submitted ? (
        <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          Message validated in the frontend preview.
        </div>
      ) : null}

      <button
        type="submit"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-emerald-700 text-sm font-bold text-white transition hover:bg-emerald-800"
      >
        <Send size={18} aria-hidden="true" />
        Send message
      </button>
    </form>
  );
}
