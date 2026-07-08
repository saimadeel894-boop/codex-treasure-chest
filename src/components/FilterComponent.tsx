

import { CheckCircle2, SlidersHorizontal } from "lucide-react";
const useRouter = () => ({
  push: (url: string) => {
    if (typeof window !== "undefined") window.location.href = url;
  },
});
const useSearchParams = () => {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.search);
};
import { useState } from "react";
import { propertyTypes, states } from "@/data/marketplace";

const bedroomsList = ["Any", "Studio", "1+", "2+", "3+", "4+", "5+"];
const bathroomsList = ["Any", "1+", "2+", "3+", "4+"];
const parkingList = ["Any", "1+", "2+", "3+"];

export function FilterComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state directly from URLSearchParams
  const [suburb, setSuburb] = useState(() => searchParams.get("suburb") || searchParams.get("location") || "");
  const [state, setState] = useState(() => searchParams.get("state") || "Any");
  const [mode, setMode] = useState(() => {
    const modeParam = searchParams.get("mode");
    return modeParam ? modeParam.charAt(0).toUpperCase() + modeParam.slice(1).toLowerCase() : "Buy";
  });
  const [propertyType, setPropertyType] = useState(() => searchParams.get("type") || "Any type");
  const [minPrice, setMinPrice] = useState(() => searchParams.get("minPrice") || "Any");
  const [maxPrice, setMaxPrice] = useState(() => searchParams.get("maxPrice") || "Any");
  const [selectedBedroom, setSelectedBedroom] = useState(() => searchParams.get("bedrooms") || "Any");
  const [selectedBathroom, setSelectedBathroom] = useState(() => searchParams.get("bathrooms") || "Any");
  const [selectedParking, setSelectedParking] = useState(() => searchParams.get("parking") || "Any");
  const [minLandSize, setMinLandSize] = useState(() => searchParams.get("minLandSize") || "");
  const [applied, setApplied] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (suburb) params.set("suburb", suburb);
    if (state && state !== "Any") params.set("state", state);
    params.set("mode", mode.toLowerCase());
    if (propertyType && propertyType !== "Any type") params.set("type", propertyType);
    if (minPrice && minPrice !== "Any") params.set("minPrice", minPrice);
    if (maxPrice && maxPrice !== "Any") params.set("maxPrice", maxPrice);
    if (selectedBedroom && selectedBedroom !== "Any") params.set("bedrooms", selectedBedroom);
    if (selectedBathroom && selectedBathroom !== "Any") params.set("bathrooms", selectedBathroom);
    if (selectedParking && selectedParking !== "Any") params.set("parking", selectedParking);
    if (minLandSize) params.set("minLandSize", minLandSize);

    setApplied(true);
    router.push(`/search?${params.toString()}`);
  };

  const handleReset = () => {
    setSuburb("");
    setState("Any");
    setMode("Buy");
    setPropertyType("Any type");
    setMinPrice("Any");
    setMaxPrice("Any");
    setSelectedBedroom("Any");
    setSelectedBathroom("Any");
    setSelectedParking("Any");
    setMinLandSize("");
    setApplied(false);
    router.push("/search");
  };

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-28">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-950">
          <SlidersHorizontal size={18} aria-hidden="true" />
          Filters
        </h2>
        <button
          type="button"
          onClick={handleReset}
          className="text-sm font-semibold text-emerald-800 hover:text-emerald-900"
        >
          Reset
        </button>
      </div>

      <form className="mt-5 space-y-5" onSubmit={handleApply}>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-semibold text-slate-700">
            State
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              <option>Any</option>
              {states.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Suburb
            <input
              placeholder="e.g. Mosman"
              value={suburb}
              onChange={(e) => setSuburb(e.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-semibold text-slate-700">
            Buy or Rent
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              <option>Buy</option>
              <option>Rent</option>
            </select>
          </label>

          <label className="text-sm font-semibold text-slate-700">
            Property type
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              <option>Any type</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-semibold text-slate-700">
            Min price
            <select
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              <option>Any</option>
              {mode === "Buy" ? (
                <>
                  <option value="500000">$500k</option>
                  <option value="1000000">$1m</option>
                  <option value="1500000">$1.5m</option>
                  <option value="2000000">$2m</option>
                  <option value="3000000">$3m</option>
                </>
              ) : (
                <>
                  <option value="500">$500/pw</option>
                  <option value="700">$700/pw</option>
                  <option value="900">$900/pw</option>
                  <option value="1200">$1200/pw</option>
                </>
              )}
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Max price
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              <option>Any</option>
              {mode === "Buy" ? (
                <>
                  <option value="1000000">$1m</option>
                  <option value="1500000">$1.5m</option>
                  <option value="2000000">$2m</option>
                  <option value="3000000">$3m</option>
                  <option value="5000000">$5m+</option>
                </>
              ) : (
                <>
                  <option value="750">$750/pw</option>
                  <option value="1000">$1000/pw</option>
                  <option value="1500">$1500/pw</option>
                  <option value="2500">$2500/pw+</option>
                </>
              )}
            </select>
          </label>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-700">Bedrooms</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {bedroomsList.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSelectedBedroom(item)}
                className={`h-9 px-3 rounded-md border text-xs font-semibold transition ${
                  selectedBedroom === item
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-700">Bathrooms</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {bathroomsList.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSelectedBathroom(item)}
                className={`h-9 px-3 rounded-md border text-xs font-semibold transition ${
                  selectedBathroom === item
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-700">Parking</p>
            <div className="mt-2 flex gap-1">
              {parkingList.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSelectedParking(item)}
                  className={`h-9 flex-1 rounded-md border text-xs font-semibold transition ${
                    selectedParking === item
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <label className="text-sm font-semibold text-slate-700">
            Min Land Size
            <input
              type="number"
              placeholder="e.g. 200"
              value={minLandSize}
              onChange={(e) => setMinLandSize(e.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </label>
        </div>

        <button
          type="submit"
          className="h-11 w-full rounded-md bg-emerald-700 text-sm font-bold text-white transition hover:bg-emerald-800 shadow-sm"
        >
          Apply filters
        </button>

        {applied ? (
          <p className="flex items-center gap-2 rounded-md bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
            <CheckCircle2 size={15} aria-hidden="true" />
            Filters applied successfully.
          </p>
        ) : null}
      </form>
    </aside>
  );
}
