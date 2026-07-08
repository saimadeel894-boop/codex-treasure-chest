import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Heart, LogOut, Menu, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const NAV = [
  { to: "/buy", label: "Buy" },
  { to: "/rent", label: "Rent" },
  { to: "/sold", label: "Sold" },
] as const;

export function SiteHeader() {
  const { signedIn, user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  async function handleSignOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  const transparent = isHome && !scrolled && !open;
  const shellClass = transparent
    ? "absolute inset-x-0 top-0 z-40 text-white"
    : "sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur text-ink";
  const linkColor = transparent
    ? "text-white/85 hover:text-white"
    : "text-ink/70 hover:text-ink";

  return (
    <header className={shellClass}>
      <div className="mx-auto grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 py-6 md:grid-cols-[1fr_auto_1fr] md:px-12">
        <Link to="/" className="min-w-0">
          <span
            className="font-display text-2xl tracking-[0.2em] uppercase"
            style={{ letterSpacing: "0.18em" }}
          >
            Domicile
          </span>
        </Link>

        <nav className="hidden md:flex justify-center items-center gap-10">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`text-[11px] font-semibold uppercase tracking-[0.25em] transition-colors ${linkColor} hover:text-primary`}
              activeProps={{ className: "text-primary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center justify-end gap-6">
          {!loading && signedIn && (
            <Link
              to="/favourites"
              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] ${linkColor} hover:text-primary`}
            >
              <Heart size={13} /> Saved
            </Link>
          )}
          {!loading && !signedIn && (
            <Link
              to="/auth"
              className={`text-[11px] font-semibold uppercase tracking-[0.25em] ${linkColor} hover:text-primary`}
            >
              Sign in
            </Link>
          )}
          {!loading && signedIn && (
            <button
              onClick={handleSignOut}
              className={`inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] ${linkColor} hover:text-primary`}
              title={user?.email ?? "Sign out"}
            >
              <User size={12} />
              <span className="max-w-[10rem] truncate normal-case tracking-normal">
                {user?.email}
              </span>
              <LogOut size={12} />
            </button>
          )}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className={`md:hidden inline-flex size-10 items-center justify-center rounded-full border justify-self-end ${transparent ? "border-white/40 text-white" : "border-border text-ink"}`}
          aria-label="Menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-ink text-white">
          <div className="mx-auto flex max-w-7xl flex-col px-6 py-6">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="border-b border-white/10 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-white/80 hover:text-primary"
              >
                {n.label}
              </Link>
            ))}
            {signedIn ? (
              <>
                <Link
                  to="/favourites"
                  onClick={() => setOpen(false)}
                  className="border-b border-white/10 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-white/80 hover:text-primary"
                >
                  Saved properties
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleSignOut();
                  }}
                  className="py-4 text-left text-sm font-semibold uppercase tracking-[0.25em] text-white/80 hover:text-primary"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="py-4 text-sm font-semibold uppercase tracking-[0.25em] text-white/80 hover:text-primary"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
