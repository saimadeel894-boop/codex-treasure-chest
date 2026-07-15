import { Heart, LogIn, LogOut, Menu, User as UserIcon, X } from "lucide-react";
import { Link } from "@/components/compat/Link";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "@tanstack/react-router";

const navLinks = [
  { href: "/search?mode=buy", label: "Buy" },
  { href: "/search?mode=rent", label: "Rent" },
  { href: "/list-property", label: "Sell" },
  { href: "/agents/mia-carter", label: "Agents" },
  { href: "/blog", label: "Insights" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/70 bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent bg-background/60 backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label="Real Estate Marketplace Australia home">
          <span className="relative flex size-11 items-center justify-center rounded-sm border border-primary/40 bg-gradient-to-br from-primary/10 to-transparent text-primary transition-all duration-300 group-hover:border-primary group-hover:from-primary/20">
            <span className="font-serif text-h3 italic leading-none tracking-tight">R</span>
            <span className="absolute -bottom-0.5 -right-0.5 size-1.5 rounded-full bg-primary" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-tile text-charcoal tracking-tight">
              Real <span className="italic text-primary">Estate</span> Marketplace
            </span>
            <span className="mt-0.5 block text-[0.65rem] font-medium uppercase tracking-[0.28em] text-charcoal/60">
              — Australia
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className="relative rounded-full px-4 py-2 text-caption text-charcoal-soft transition hover:text-primary">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/saved-properties"
            className="hidden size-10 items-center justify-center rounded-full border border-border text-charcoal-soft transition hover:border-primary hover:text-primary sm:flex"
            aria-label="Saved properties">
            <Heart size={17} aria-hidden="true" />
          </Link>

          {user ? (
            <>
              <Link href="/dashboard"
                className="hidden items-center gap-2 rounded-full border border-border px-4 py-2 text-caption text-charcoal transition hover:border-primary hover:text-primary sm:flex">
                <UserIcon size={15} aria-hidden="true" />
                Dashboard
              </Link>
              <button type="button" onClick={handleSignOut}
                className="hidden items-center gap-2 rounded-full bg-charcoal px-4 py-2.5 text-caption text-background shadow-soft transition hover:bg-primary md:inline-flex">
                <LogOut size={14} aria-hidden="true" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login"
                className="hidden items-center gap-2 rounded-full border border-border px-4 py-2 text-caption text-charcoal transition hover:border-primary hover:text-primary sm:flex">
                <LogIn size={15} aria-hidden="true" />
                Sign in
              </Link>
              <Link href="/list-property"
                className="hidden items-center gap-2 rounded-full bg-charcoal px-4 py-2.5 text-caption text-background shadow-soft transition hover:bg-primary md:inline-flex">
                List property
              </Link>
            </>
          )}

          <button type="button" onClick={() => setOpen((v) => !v)}
            className="flex size-10 items-center justify-center rounded-full border border-border text-charcoal-soft transition hover:border-primary hover:text-primary lg:hidden"
            aria-label="Toggle mobile menu" aria-expanded={open}>
            {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-1 px-4 py-4 sm:px-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-body font-medium text-charcoal-soft transition hover:bg-primary-soft hover:text-primary">
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-body font-medium text-charcoal-soft transition hover:bg-primary-soft hover:text-primary">
                  Dashboard
                </Link>
                <button type="button" onClick={() => { setOpen(false); handleSignOut(); }}
                  className="mt-2 flex items-center justify-center gap-2 rounded-full bg-charcoal px-4 py-3 text-caption font-semibold text-background">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-body font-medium text-charcoal-soft transition hover:bg-primary-soft hover:text-primary">
                  Sign in
                </Link>
                <Link href="/list-property" onClick={() => setOpen(false)}
                  className="mt-2 flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-caption font-semibold text-primary-foreground">
                  List your property
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
