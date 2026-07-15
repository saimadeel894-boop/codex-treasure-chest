import { Bath, BedDouble, Car, MapPin } from "lucide-react";
import { useState, type MouseEvent } from "react";
import { Image } from "@/components/compat/Image";
import { Link } from "@/components/compat/Link";
import { QuickViewModal } from "@/components/QuickViewModal";
import { SaveButton } from "@/components/SaveButton";
import type { Property } from "@/data/marketplace";
import { getAgentForProperty } from "@/data/marketplace";

type PropertyCardProps = {
  property: Property;
  compact?: boolean;
};

export function PropertyCard({ property, compact = false }: PropertyCardProps) {
  const agent = getAgentForProperty(property);
  const [quickOpen, setQuickOpen] = useState(false);

  const openQuick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickOpen(true);
  };

  return (
    <article className="group overflow-hidden rounded-3xl border border-border/70 bg-surface shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-luxury">
      <Link href={`/properties/${property.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            loading="lazy"
            className="object-cover transition duration-[900ms] ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-70" />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-background/95 px-3 py-1 text-eyebrow text-charcoal shadow-soft">
              For {property.mode}
            </span>
            {property.tags.slice(0, 1).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary px-3 py-1 text-eyebrow text-primary-foreground shadow-soft"
              >
                {tag}
              </span>
            ))}
          </div>

          <SaveButton
            propertyId={property.id}
            label={property.title}
            className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-background/95 text-charcoal-soft shadow-soft transition hover:text-primary"
          />

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
            <div className="text-background">
              <p className="text-eyebrow text-background/80">
                {property.propertyType}
              </p>
              <p className="mt-1 font-serif text-h3 leading-none">{property.priceLabel}</p>
            </div>
            <button
              type="button"
              onClick={openQuick}
              className="rounded-full bg-background/95 px-3 py-1.5 text-caption text-charcoal shadow-soft opacity-0 transition hover:bg-primary hover:text-primary-foreground group-hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`Quick view ${property.title}`}
            >
              Quick view
            </button>
          </div>
        </div>
      </Link>

      <div className={compact ? "p-5" : "p-6"}>
        <h3 className="line-clamp-2 font-serif text-tile text-charcoal">
          <Link href={`/properties/${property.id}`} className="transition hover:text-primary">
            {property.title}
          </Link>
        </h3>

        <p className="mt-3 flex items-center gap-2 text-caption text-muted-foreground">
          <MapPin size={15} className="shrink-0 text-primary" aria-hidden="true" />
          <span className="truncate">
            {property.suburb}, {property.state} {property.postcode}
          </span>
        </p>

        <div className="mt-5 grid grid-cols-4 gap-1.5 border-t border-border/70 pt-4 text-caption text-charcoal-soft sm:gap-2">
          <span className="flex min-w-0 items-center gap-1 sm:gap-1.5">
            <BedDouble size={16} className="shrink-0 text-primary" aria-hidden="true" />
            <span className="truncate">{property.bedrooms}</span>
          </span>
          <span className="flex min-w-0 items-center gap-1 sm:gap-1.5">
            <Bath size={16} className="shrink-0 text-primary" aria-hidden="true" />
            <span className="truncate">{property.bathrooms}</span>
          </span>
          <span className="flex min-w-0 items-center gap-1 sm:gap-1.5">
            <Car size={16} className="shrink-0 text-primary" aria-hidden="true" />
            <span className="truncate">{property.parking}</span>
          </span>
          <span className="min-w-0 truncate text-right text-caption text-muted-foreground">
            {property.landSize}
          </span>
        </div>

        {!compact && (
          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Image
                src={agent.image}
                alt={agent.name}
                width={36}
                height={36}
                className="size-9 rounded-full object-cover ring-2 ring-primary-soft"
              />
              <div>
                <p className="text-caption font-semibold text-charcoal">{agent.name}</p>
                <p className="text-caption text-muted-foreground">{property.listedAt}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={openQuick}
              className="rounded-full border border-border px-4 py-2 text-caption text-charcoal transition hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              Quick view
            </button>
          </div>
        )}
      </div>

      <QuickViewModal property={property} open={quickOpen} onClose={() => setQuickOpen(false)} />
    </article>
  );
}
