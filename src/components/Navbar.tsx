

import {
  Building2,
  Heart,
  Home,
  LayoutDashboard,
  LogIn,
  Menu,
  PlusCircle,
  Search,
  X,
} from "lucide-react";
import { Link } from "@/components/compat/Link";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/list-property", label: "List", icon: PlusCircle },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

const mobileMoreLinks = [
  { href: "/saved-properties", label: "Saved properties" },
  { href: "/agents/mia-carter", label: "Agent profile" },
  { href: "/agencies/harbour-north", label: "Agency profile" },
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact us" },
  { href: "/blog", label: "Blog" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Nestoria Australia home">
          <span className="flex size-10 items-center justify-center rounded-md bg-emerald-700 text-white shadow-sm">
            <Building2 size={22} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-lg font-bold leading-none text-slate-950">Nestoria</span>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Australia
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
              >
                <Icon size={16} aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/saved-properties"
            className="hidden size-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 sm:flex"
            aria-label="Saved properties"
            title="Saved properties"
          >
            <Heart size={18} aria-hidden="true" />
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >
            <LogIn size={16} aria-hidden="true" />
            Login
          </Link>
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="flex size-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 transition hover:bg-slate-100 md:hidden"
            aria-label="Toggle mobile menu"
            aria-expanded={open}
          >
            {open ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <div className="border-t border-slate-100 px-4 pb-3 md:hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-4 gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex min-h-11 flex-col items-center justify-center gap-1 rounded-md text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-emerald-800"
              >
                <Icon size={17} aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      {open ? (
        <div className="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            {mobileMoreLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-emerald-800"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
