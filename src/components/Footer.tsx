import { Building2, Mail, MapPin, MessageCircle, Phone, Share2, Users } from "lucide-react";
import { Link } from "@/components/compat/Link";

const footerGroups = [
  {
    title: "Explore",
    links: [
      { href: "/search?mode=buy", label: "Buy property" },
      { href: "/search?mode=rent", label: "Rent property" },
      { href: "/list-property", label: "List property" },
      { href: "/agents/mia-carter", label: "Find an agent" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/contact", label: "Contact" },
      { href: "/blog", label: "Blog" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/blog", label: "Market insights" },
      { href: "/search", label: "Suburb guides" },
      { href: "/blog", label: "Buyer guides" },
      { href: "/blog", label: "Rental advice" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_2fr] lg:px-8">
        <div>
          <Link href="/" className="flex items-center gap-3" aria-label="Nestoria Australia home">
            <span className="flex size-11 items-center justify-center rounded-md bg-emerald-500 text-slate-950">
              <Building2 size={23} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-xl font-bold leading-none">Nestoria</span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Australia
              </span>
            </span>
          </Link>
          <p className="mt-5 max-w-md text-sm leading-6 text-slate-300">
            A modern Australian property marketplace concept for buying, renting, selling, and
            discovering homes with confidence.
          </p>
          <div className="mt-6 space-y-3 text-sm text-slate-300">
            <p className="flex items-center gap-3">
              <MapPin size={17} aria-hidden="true" />
              Sydney, Melbourne, Brisbane, Perth and beyond
            </p>
            <p className="flex items-center gap-3">
              <Phone size={17} aria-hidden="true" />
              1300 000 123
            </p>
            <p className="flex items-center gap-3">
              <Mail size={17} aria-hidden="true" />
              hello@nestoria.example
            </p>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-300">
                {group.title}
              </h2>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-slate-300 transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>&copy; 2026 Nestoria Australia. Frontend prototype.</p>
          <div className="flex items-center gap-2">
            {[MessageCircle, Share2, Users].map((Icon, index) => (
              <span
                key={index}
                className="flex size-9 items-center justify-center rounded-md border border-white/10 text-slate-300"
              >
                <Icon size={17} aria-hidden="true" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
