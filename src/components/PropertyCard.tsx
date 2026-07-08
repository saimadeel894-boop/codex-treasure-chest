import { Bath, BedDouble, Car, MapPin } from "lucide-react";
import { Image } from "@/components/compat/Image";
import { Link } from "@/components/compat/Link";
import { SaveButton } from "@/components/SaveButton";
import type { Property } from "@/data/marketplace";
import { getAgentForProperty } from "@/data/marketplace";

type PropertyCardProps = {
  property: Property;
  compact?: boolean;
};

export function PropertyCard({ property, compact = false }: PropertyCardProps) {
  const agent = getAgentForProperty(property);

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-950/10">
      <Link href={`/properties/${property.id}`} className="group block">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <span className="rounded-md bg-white/95 px-2.5 py-1 text-xs font-bold text-emerald-800 shadow-sm">
              {property.mode}
            </span>
            <span className="rounded-md bg-emerald-800 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
              {property.propertyType}
            </span>
            {property.tags.slice(0, 1).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-slate-950/85 px-2.5 py-1 text-xs font-bold text-white backdrop-blur"
              >
                {tag}
              </span>
            ))}
          </div>
          <SaveButton
            label={property.title}
            className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-md bg-white/95 text-slate-700 shadow-sm transition hover:text-rose-600"
          />
        </div>
      </Link>

      <div className={compact ? "p-4" : "p-5"}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xl font-bold text-slate-950">{property.priceLabel}</p>
            <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-6 text-slate-900">
              <Link href={`/properties/${property.id}`} className="hover:text-emerald-800">
                {property.title}
              </Link>
            </h3>
          </div>
        </div>

        <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
          <MapPin size={16} className="shrink-0 text-emerald-700" aria-hidden="true" />
          <span className="truncate">
            {property.address}, {property.suburb}, {property.state} {property.postcode}
          </span>
        </p>

        <div className="mt-4 grid grid-cols-4 gap-2 border-y border-slate-100 py-3 text-sm font-semibold text-slate-700">
          <span className="flex items-center gap-1.5">
            <BedDouble size={17} aria-hidden="true" />
            {property.bedrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <Bath size={17} aria-hidden="true" />
            {property.bathrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <Car size={17} aria-hidden="true" />
            {property.parking}
          </span>
          <span className="truncate text-right text-xs text-slate-500">{property.landSize}</span>
        </div>

        {!compact && (
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Image
                src={agent.image}
                alt={agent.name}
                width={32}
                height={32}
                className="size-8 rounded-md object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">{agent.name}</p>
                <p className="text-xs text-slate-500">{property.listedAt}</p>
              </div>
            </div>
            <Link
              href={`/properties/${property.id}`}
              className="rounded-md border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
            >
              View Details
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
