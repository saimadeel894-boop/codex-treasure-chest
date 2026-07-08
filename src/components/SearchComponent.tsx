

import { MapPin, Search } from "lucide-react";
import { useState } from "react";
import { propertyTypes, states } from "@/data/marketplace";

type SearchComponentProps = {
  compact?: boolean;
};

export function SearchComponent({ compact = false }: SearchComponentProps) {
  const [mode, setMode] = useState<"buy" | "rent">("buy");

  return (
    <form
      action="/search"
      className={`rounded-lg border border-slate-200 bg-white p-3 shadow-xl shadow-slate-950/10 ${
        compact ? "" : "sm:p-4"
      }`}
    >
      <div className="mb-3 grid grid-cols-2 gap-2 rounded-md bg-slate-100 p-1 text-sm font-semibold text-slate-700 sm:w-64">
        <label
          className={`cursor-pointer rounded-md px-4 py-2 text-center transition ${
            mode === "buy" ? "bg-white text-emerald-800 shadow-sm" : "hover:bg-white/70"
          }`}
        >
          <input
            className="sr-only"
            type="radio"
            name="mode"
            value="buy"
            checked={mode === "buy"}
            onChange={() => setMode("buy")}
          />
          Buy
        </label>
        <label
          className={`cursor-pointer rounded-md px-4 py-2 text-center transition ${
            mode === "rent" ? "bg-white text-emerald-800 shadow-sm" : "hover:bg-white/70"
          }`}
        >
          <input
            className="sr-only"
            type="radio"
            name="mode"
            value="rent"
            checked={mode === "rent"}
            onChange={() => setMode("rent")}
          />
          Rent
        </label>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.5fr_0.9fr_0.9fr_auto]">
        <label className="relative block">
          <span className="sr-only">Search by location</span>
          <MapPin
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={19}
            aria-hidden="true"
          />
          <input
            name="location"
            placeholder="Suburb, postcode or address"
            className="h-12 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </label>

        <label>
          <span className="sr-only">State</span>
          <select
            name="state"
            className="h-12 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            defaultValue=""
          >
            <option value="">Any state</option>
            {states.map((state) => (
              <option key={state}>{state}</option>
            ))}
          </select>
        </label>

        <label>
          <span className="sr-only">Property type</span>
          <select
            name="type"
            className="h-12 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            defaultValue=""
          >
            <option value="">Any type</option>
            {propertyTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-700 px-6 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800"
        >
          <Search size={18} aria-hidden="true" />
          Search
        </button>
      </div>
    </form>
  );
}
