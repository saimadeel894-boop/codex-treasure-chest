import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | Nestoria Australia" },
      { name: "description", content: "Get in touch with the Nestoria Australia team." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-950">Contact us</h1>
      <p className="mt-2 text-slate-600">We'd love to hear from you.</p>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <ContactForm />
        <aside className="space-y-4">
          <InfoCard icon={<Phone size={18} />} label="Phone" value="1300 000 000" />
          <InfoCard icon={<Mail size={18} />} label="Email" value="hello@nestoria.example" />
          <InfoCard icon={<MapPin size={18} />} label="Head office" value="Level 12, 100 Market St, Sydney NSW 2000" />
        </aside>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">{icon} {label}</p>
      <p className="mt-2 font-semibold text-slate-950">{value}</p>
    </div>
  );
}
