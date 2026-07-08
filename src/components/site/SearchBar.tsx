import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import type { ListingType } from "@/lib/properties.functions";

const TABS: { key: ListingType; label: string }[] = [
  { key: "sale", label: "Buy" },
  { key: "rent", label: "Rent" },
  { key: "sold", label: "Sold" },
];

const ROUTE: Record<ListingType, "/buy" | "/rent" | "/sold"> = {
  sale: "/buy",
  rent: "/rent",
  sold: "/sold",
};

export function SearchBar({
  initialTab = "sale",
  initialLocation = "",
  variant = "hero",
}: {
  initialTab?: ListingType;
  initialLocation?: string;
  variant?: "hero" | "inline";
}) {
  const [tab, setTab] = useState<ListingType>(initialTab);
  const [location, setLocation] = useState(initialLocation);
  const navigate = useNavigate();

  return (
    <div className={variant === "hero" ? "w-full max-w-2xl" : "w-full"}>
      <div className="inline-flex bg-white/85 backdrop-blur rounded-full p-1 shadow-sm border border-white/60">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={
              "px-5 py-2 text-sm font-semibold rounded-full transition " +
              (tab === t.key
                ? "bg-primary text-primary-foreground shadow"
                : "text-ink/80 hover:text-ink")
            }
          >
            {t.label}
          </button>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: ROUTE[tab], search: { location: location || undefined } as any });
        }}
        className="mt-3 flex items-center gap-2 rounded-2xl bg-white border border-border shadow-lg p-2"
      >
        <div className="pl-3 text-muted-foreground"><Search size={18} /></div>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Suburb, postcode or state (e.g. Bondi, 2026, NSW)"
          aria-label="Search location"
          className="flex-1 bg-transparent outline-none text-sm px-2 py-3 placeholder:text-muted-foreground text-ink"
        />
        <button
          type="submit"
          className="rounded-xl bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold shadow-sm hover:opacity-95"
        >
          Search
        </button>
      </form>
    </div>
  );
}
