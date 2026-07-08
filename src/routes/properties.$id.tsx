import { createFileRoute, notFound } from "@tanstack/react-router";
import { Bath, BedDouble, Car, CheckCircle2, MapPin, Ruler } from "lucide-react";
import { ContactAgentForm } from "@/components/ContactAgentForm";
import { ImageGallery } from "@/components/ImageGallery";
import { PropertyCard } from "@/components/PropertyCard";
import { SaveButton } from "@/components/SaveButton";
import {
  getAgencyForProperty,
  getAgentForProperty,
  getPropertyById,
  properties,
} from "@/data/marketplace";

export const Route = createFileRoute("/properties/$id")({
  head: ({ params }) => {
    const property = getPropertyById(params.id);
    return {
      meta: [
        { title: property ? `${property.title} | Nestoria` : "Property not found" },
        {
          name: "description",
          content: property?.description?.slice(0, 150) ?? "Property details",
        },
      ],
    };
  },
  loader: ({ params }) => {
    const property = getPropertyById(params.id);
    if (!property) throw notFound();
    return { property };
  },
  component: PropertyPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-slate-950">Property not found</h1>
      <p className="mt-2 text-slate-600">This listing may have been removed.</p>
    </div>
  ),
});

function PropertyPage() {
  const { property } = Route.useLoaderData();
  const agent = getAgentForProperty(property);
  const agency = getAgencyForProperty(property);
  const similar = properties.filter((p) => p.id !== property.id && p.state === property.state).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <ImageGallery images={property.images} title={property.title} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-3xl font-bold text-emerald-800">{property.priceLabel}</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-950">{property.title}</h1>
              <p className="mt-2 flex items-center gap-2 text-slate-600">
                <MapPin size={18} className="text-emerald-700" aria-hidden="true" />
                {property.address}, {property.suburb}, {property.state} {property.postcode}
              </p>
            </div>
            <SaveButton
              propertyId={property.id}
              label={property.title}
              withText
              className="flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg border border-slate-200 bg-white p-5 sm:grid-cols-4">
            <Spec icon={<BedDouble size={20} />} label="Bedrooms" value={property.bedrooms} />
            <Spec icon={<Bath size={20} />} label="Bathrooms" value={property.bathrooms} />
            <Spec icon={<Car size={20} />} label="Parking" value={property.parking} />
            <Spec icon={<Ruler size={20} />} label="Land size" value={property.landSize} />
          </div>

          <section className="mt-8">
            <h2 className="text-xl font-bold text-slate-950">Description</h2>
            <p className="mt-3 whitespace-pre-line leading-7 text-slate-700">{property.description}</p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold text-slate-950">Features</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {property.features.map((f: string) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-700" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold text-slate-950">Inspection times</h2>
            <ul className="mt-3 space-y-2 text-slate-700">
              {property.inspectionTimes.map((t: string) => (
                <li key={t} className="rounded-md border border-slate-200 bg-white px-4 py-3">{t}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold text-slate-950">Location</h2>
            <div className="mt-3 aspect-[16/9] rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-500">
              Map placeholder — {property.suburb}, {property.state}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Listed by</p>
            <div className="mt-3 flex items-center gap-3">
              <img src={agent.image} alt={agent.name} className="size-14 rounded-md object-cover" />
              <div>
                <p className="font-bold text-slate-950">{agent.name}</p>
                <p className="text-sm text-slate-600">{agency.name}</p>
              </div>
            </div>
          </div>
          <ContactAgentForm agent={agent} property={property} />
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-slate-950">Similar properties</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {similar.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-emerald-700">{icon}</div>
      <p className="mt-2 text-lg font-bold text-slate-950">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
