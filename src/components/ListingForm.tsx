import { AlertCircle, CheckCircle2, ImagePlus, Loader2, Upload, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { propertyTypes, states } from "@/data/marketplace";
import { useAuth } from "@/hooks/use-auth";
import {
  createProperty,
  updateProperty,
  uploadPropertyImages,
  type PropertyInput,
} from "@/lib/property-service";
import type { Property } from "@/data/marketplace";

type ListingFormProps = {
  existing?: Property;
};

type DbPropertyType = "house" | "apartment" | "townhouse" | "land" | "rural";
type DbState = "ACT" | "NSW" | "NT" | "QLD" | "SA" | "TAS" | "VIC" | "WA";

const propertyTypeMap: Record<string, DbPropertyType> = {
  House: "house",
  Apartment: "apartment",
  Townhouse: "townhouse",
  Land: "land",
  "New development": "house",
};

export function ListingForm({ existing }: ListingFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [listingType, setListingType] = useState<"sale" | "rent">(existing?.mode === "Rent" ? "rent" : "sale");
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [authLoading, user, navigate]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      const fd = new FormData(e.currentTarget);
      const propertyTypeLabel = String(fd.get("propertyType") || "House");
      const input: PropertyInput = {
        title: String(fd.get("title") || "").trim(),
        description: String(fd.get("description") || "").trim(),
        listing_type: listingType,
        property_type: propertyTypeMap[propertyTypeLabel] ?? "house",
        price_cents: Math.round(Number(fd.get("price") || 0) * 100),
        rent_period: listingType === "rent" ? "week" : null,
        address_line: String(fd.get("address") || "").trim(),
        suburb: String(fd.get("suburb") || "").trim(),
        state: String(fd.get("state") || "NSW") as DbState,
        postcode: String(fd.get("postcode") || "").trim(),
        bedrooms: Number(fd.get("bedrooms") || 0),
        bathrooms: Number(fd.get("bathrooms") || 0),
        parking: Number(fd.get("parking") || 0),
        land_size_sqm: Number(fd.get("landSize") || 0) || null,
        features: String(fd.get("features") || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        is_published: true,
      };
      if (!input.title || input.title.length < 4) throw new Error("Title must be at least 4 characters");
      if (!input.description || input.description.length < 30) throw new Error("Description must be at least 30 characters");
      if (!input.price_cents || input.price_cents <= 0) throw new Error("Price must be greater than 0");

      let propertyId: string;
      if (existing) {
        await updateProperty(existing.id, input);
        propertyId = existing.id;
      } else {
        propertyId = await createProperty(user.id, input);
      }

      if (files.length > 0) {
        await uploadPropertyImages(propertyId, user.id, files);
      }

      setSuccess(true);
      setTimeout(() => navigate({ to: "/my-listings" }), 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save listing");
    } finally {
      setLoading(false);
    }
  };

  const price = existing ? Math.round(existing.price) : "";

  return (
    <form className="grid gap-5" onSubmit={onSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-caption font-semibold text-charcoal sm:col-span-2">
          Listing title
          <input required name="title" defaultValue={existing?.title} placeholder="Sunlit family home near the beach"
            className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
        </label>

        <label className="text-caption font-semibold text-charcoal">
          Listing type
          <select value={listingType} onChange={(e) => setListingType(e.target.value as "sale" | "rent")}
            className="mt-2 h-12 w-full rounded-md border border-slate-200 bg-white px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100">
            <option value="sale">For sale</option>
            <option value="rent">For rent</option>
          </select>
        </label>
        <label className="text-caption font-semibold text-charcoal">
          Property type
          <select name="propertyType" defaultValue={existing?.propertyType ?? "House"}
            className="mt-2 h-12 w-full rounded-md border border-slate-200 bg-white px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100">
            {propertyTypes.map((type) => <option key={type}>{type}</option>)}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <label className="text-caption font-semibold text-charcoal md:col-span-2">
          Street address
          <input required name="address" defaultValue={existing?.address} placeholder="24 Awaba Street"
            className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
        </label>
        <label className="text-caption font-semibold text-charcoal">
          Suburb
          <input required name="suburb" defaultValue={existing?.suburb} placeholder="Mosman"
            className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
        </label>
        <label className="text-caption font-semibold text-charcoal">
          Postcode
          <input required name="postcode" defaultValue={existing?.postcode} placeholder="2088"
            className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-caption font-semibold text-charcoal">
          State
          <select name="state" defaultValue={existing?.state ?? "NSW"}
            className="mt-2 h-12 w-full rounded-md border border-slate-200 bg-white px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100">
            {states.map((state) => <option key={state}>{state}</option>)}
          </select>
        </label>
        <label className="text-caption font-semibold text-charcoal md:col-span-2">
          Price (AUD {listingType === "rent" ? "per week" : "total"})
          <input required name="price" type="number" min="1" defaultValue={price} placeholder="1250000"
            className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-caption font-semibold text-charcoal">
          Bedrooms
          <input required name="bedrooms" type="number" min="0" defaultValue={existing?.bedrooms} placeholder="4"
            className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
        </label>
        <label className="text-caption font-semibold text-charcoal">
          Bathrooms
          <input required name="bathrooms" type="number" min="0" defaultValue={existing?.bathrooms} placeholder="2"
            className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
        </label>
        <label className="text-caption font-semibold text-charcoal">
          Parking
          <input required name="parking" type="number" min="0" defaultValue={existing?.parking} placeholder="2"
            className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
        </label>
        <label className="text-caption font-semibold text-charcoal">
          Land size (sqm)
          <input name="landSize" type="number" min="0" defaultValue={existing ? parseInt(existing.landSize) || "" : ""} placeholder="612"
            className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
        </label>
      </div>

      <label className="text-caption font-semibold text-charcoal">
        Features (comma-separated)
        <input name="features" defaultValue={existing?.features.join(", ")} placeholder="Pool, Study, North aspect"
          className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
      </label>

      <label className="text-caption font-semibold text-charcoal">
        Description
        <textarea required name="description" minLength={30} rows={6} defaultValue={existing?.description}
          placeholder="Describe the property, lifestyle, location, and key features."
          className="mt-2 w-full rounded-md border border-slate-200 px-3 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
      </label>

      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6">
        <div className="flex flex-col items-center text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-md bg-white text-emerald-800 shadow-sm">
            <ImagePlus size={24} aria-hidden="true" />
          </div>
          <p className="mt-3 text-caption font-semibold text-charcoal">Upload property images</p>
          <p className="mt-1 text-caption text-muted-foreground">JPG or PNG. Add as many as you'd like.</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            className="mt-3 block w-full max-w-xs text-caption text-charcoal file:mr-3 file:rounded-md file:border-0 file:bg-emerald-700 file:px-4 file:py-2 file:text-white hover:file:bg-emerald-800"
          />
        </div>
        {files.length > 0 && (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {files.map((f, i) => (
              <li key={i} className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-caption text-charcoal">
                <span className="truncate">{f.name}</span>
                <button type="button" onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))} className="text-slate-500 hover:text-rose-600" aria-label="Remove file">
                  <X size={14} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error ? (
        <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-4 text-caption font-semibold text-rose-800">
          <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-caption font-semibold text-emerald-800">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          Listing saved. Redirecting to your listings…
        </div>
      ) : null}

      <button type="submit" disabled={loading}
        className="flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-700 px-5 text-caption font-semibold text-white transition hover:bg-emerald-800 sm:w-fit disabled:opacity-60">
        {loading ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <Upload size={18} aria-hidden="true" />}
        {loading ? "Saving…" : existing ? "Save changes" : "Publish listing"}
      </button>
    </form>
  );
}
