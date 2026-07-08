import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Home, LogOut, Menu, User } from "lucide-react";
import { useState } from "react";
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
  const navigate = useNavigate();
  const qc = useQueryClient();

  async function handleSignOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition group-hover:scale-105">
            <Home size={18} />
          </span>
          <span className="font-display text-2xl font-semibold tracking-tight text-ink">Domicile</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md transition hover:text-ink hover:bg-muted"
              activeProps={{ className: "text-ink bg-muted" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {!loading && signedIn && (
            <Link
              to="/favourites"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-ink hover:bg-muted transition"
            >
              <Heart size={16} /> Saved
            </Link>
          )}
          {!loading && !signedIn && (
            <Link
              to="/auth"
              className="inline-flex items-center rounded-full bg-ink text-background px-4 py-2 text-sm font-semibold shadow-sm transition hover:bg-primary"
            >
              Sign in
            </Link>
          )}
          {!loading && signedIn && (
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-ink hover:border-ink transition"
              title={user?.email ?? "Sign out"}
            >
              <User size={14} /> <span className="hidden sm:inline max-w-[9rem] truncate">{user?.email}</span>
              <LogOut size={14} />
            </button>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground"
            aria-label="Menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-ink"
              >
                {n.label}
              </Link>
            ))}
            {signedIn && (
              <Link
                to="/favourites"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-ink"
              >
                Saved properties
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
