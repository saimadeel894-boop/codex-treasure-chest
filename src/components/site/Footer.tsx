import { Link } from "@tanstack/react-router";
import { Home } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Home size={18} />
            </span>
            <span className="font-display text-2xl font-semibold text-ink">Domicile</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            A modern Australian property marketplace. Find your next home to buy or rent, or track the sold market with confidence.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink">Browse</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/buy" className="text-muted-foreground hover:text-ink">Buy</Link></li>
            <li><Link to="/rent" className="text-muted-foreground hover:text-ink">Rent</Link></li>
            <li><Link to="/sold" className="text-muted-foreground hover:text-ink">Sold</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink">Account</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/auth" className="text-muted-foreground hover:text-ink">Sign in / Sign up</Link></li>
            <li><Link to="/favourites" className="text-muted-foreground hover:text-ink">Saved properties</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink">About</h4>
          <p className="mt-3 text-sm text-muted-foreground">
            Independent AU property discovery. Listings shown are demonstration data.
          </p>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Domicile. All rights reserved.
      </div>
    </footer>
  );
}
