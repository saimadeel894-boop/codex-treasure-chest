import { Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
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
      { href: "/blog", label: "Insights" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms & conditions" },
      { href: "/my-listings", label: "My listings" },
      { href: "/saved-properties", label: "Saved properties" },
    ],
  },

];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-charcoal text-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-primary/25 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.3fr_2fr] lg:px-8">
        <div>
          <Link href="/" className="group flex items-center gap-3" aria-label="Real Estate Marketplace Australia home">
            <span className="relative flex size-12 items-center justify-center rounded-sm border border-primary/50 bg-gradient-to-br from-primary/15 to-transparent text-primary transition-all duration-300 group-hover:border-primary">
              <span className="font-serif text-h3 italic leading-none tracking-tight">R</span>
              <span className="absolute -bottom-0.5 -right-0.5 size-1.5 rounded-full bg-primary" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-serif text-tile leading-none tracking-tight">
                Real <span className="italic text-primary">Estate</span> Marketplace
              </span>
              <span className="mt-1 block text-[0.65rem] font-medium uppercase tracking-[0.28em] text-background/60">
                — Australia
              </span>
            </span>
          </Link>
          <p className="mt-6 max-w-md font-serif text-h3 text-background/85">
            Where Australia&rsquo;s most considered homes meet their next chapter.
          </p>
          <div className="mt-8 space-y-3 text-caption text-background/70">
            <p className="flex items-center gap-3">
              <MapPin size={16} className="text-primary" aria-hidden="true" />
              Sydney &middot; Melbourne &middot; Brisbane &middot; Perth
            </p>
            <p className="flex items-center gap-3">
              <Phone size={16} className="text-primary" aria-hidden="true" />
              1300 000 123
            </p>
            <p className="flex items-center gap-3">
              <Mail size={16} className="text-primary" aria-hidden="true" />
              hello@nestoria.example
            </p>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-eyebrow text-primary">
                {group.title}
              </h2>
              <ul className="mt-5 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-caption text-background/75 transition hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="relative border-t border-background/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-caption text-background/60 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>&copy; 2026 Real Estate Marketplace Australia &mdash; Handcrafted for discerning homeowners.</p>
          <div className="flex items-center gap-2">
            {[Instagram, Twitter, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex size-9 items-center justify-center rounded-full border border-background/15 text-background/70 transition hover:border-primary hover:text-primary"
                aria-label="Social link"
              >
                <Icon size={15} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
