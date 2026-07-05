

import { CheckCircle2, ImagePlus, Upload } from "lucide-react";
import { useState } from "react";
import { propertyTypes, states } from "@/data/marketplace";

export function ListingForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        setSubmitted(form.checkValidity());
        form.reportValidity();
      }}
    >
      <label className="text-sm font-semibold text-slate-700">
        Address
        <input
          required
          name="address"
          placeholder="24 Awaba Street, Mosman NSW"
          className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-sm font-semibold text-slate-700">
          Property type
          <select
            name="propertyType"
            className="mt-2 h-12 w-full rounded-md border border-slate-200 bg-white px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          >
            {propertyTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold text-slate-700">
          State
          <select
            name="state"
            className="mt-2 h-12 w-full rounded-md border border-slate-200 bg-white px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          >
            {states.map((state) => (
              <option key={state}>{state}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Price
          <input
            required
            name="price"
            type="number"
            min="1"
            placeholder="1250000"
            className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { name: "bedrooms", label: "Bedrooms" },
          { name: "bathrooms", label: "Bathrooms" },
          { name: "parking", label: "Parking" },
          { name: "landSize", label: "Land size" },
        ].map((field) => (
          <label key={field.name} className="text-sm font-semibold text-slate-700">
            {field.label}
            <input
              required
              name={field.name}
              placeholder={field.name === "landSize" ? "612 sqm" : "2"}
              className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </label>
        ))}
      </div>

      <label className="text-sm font-semibold text-slate-700">
        Description
        <textarea
          required
          name="description"
          minLength={30}
          rows={6}
          placeholder="Describe the property, lifestyle, location, and key features."
          className="mt-2 w-full rounded-md border border-slate-200 px-3 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </label>

      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-md bg-white text-emerald-800 shadow-sm">
          <ImagePlus size={24} aria-hidden="true" />
        </div>
        <p className="mt-3 text-sm font-bold text-slate-950">Upload property images</p>
        <p className="mt-1 text-sm text-slate-500">Drag and drop UI placeholder. Backend storage connects later.</p>
        <input className="sr-only" type="file" multiple accept="image/*" />
      </div>

      {submitted ? (
        <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          Listing form is valid. Submission is intentionally frontend-only for this phase.
        </div>
      ) : null}

      <button
        type="submit"
        className="flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-700 px-5 text-sm font-bold text-white transition hover:bg-emerald-800 sm:w-fit"
      >
        <Upload size={18} aria-hidden="true" />
        Preview listing
      </button>
    </form>
  );
}
