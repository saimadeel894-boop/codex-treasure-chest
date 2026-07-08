import { Link } from "@tanstack/react-router";
import { Bath, BedDouble, Car, MapPin } from "lucide-react";
import { FavouriteButton } from "./FavouriteButton";
import { formatPrice } from "@/lib/format";
import { resolvePropertyImage } from "@/lib/property-images";
import type { PropertyRow } from "@/lib/properties.functions";

const TYPE_LABEL: Record<string, string> = {
  house: "House",
  apartment: "Apartment",
  townhouse: "Townhouse",
  land: "Land",
  rural: "Rural",
};

const MODE_LABEL: Record<string, string> = {
  sale: "For sale",
  rent: "For rent",
  sold: "Sold",
};

export function PropertyCard({ p }: { p: PropertyRow }) {
  const img = resolvePropertyImage(p.images[0]?.url);
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-lg hover:-translate-y-0.5">
      <Link to="/properties/$id" params={{ id: p.id }} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={img}
            alt={p.images[0]?.alt ?? p.title}
            loading="lazy"
            width={1280}
            height={960}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute left-3 top-3 flex gap-2">
            <span className="rounded-full bg-white/95 backdrop-blur px-3 py-1 text-xs font-semibold text-ink shadow-sm">
              {MODE_LABEL[p.listing_type]}
            </span>
            <span className="rounded-full bg-ink/85 backdrop-blur px-3 py-1 text-xs font-semibold text-background">
              {TYPE_LABEL[p.property_type]}
            </span>
          </div>
          <FavouriteButton propertyId={p.id} className="absolute right-3 top-3" />
        </div>
      </Link>
      <div className="p-5">
        <p className="font-display text-xl font-semibold text-ink">
          {formatPrice(p.price_cents, p.listing_type, p.rent_period)}
        </p>
        <h3 className="mt-1 text-base font-medium text-ink line-clamp-1">
          <Link to="/properties/$id" params={{ id: p.id }} className="hover:text-primary">
            {p.title}
          </Link>
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin size={14} />
          <span className="truncate">{p.suburb}, {p.state} {p.postcode}</span>
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1"><BedDouble size={16} />{p.bedrooms}</span>
          <span className="inline-flex items-center gap-1"><Bath size={16} />{p.bathrooms}</span>
          <span className="inline-flex items-center gap-1"><Car size={16} />{p.parking}</span>
        </div>
      </div>
    </article>
  );
}
