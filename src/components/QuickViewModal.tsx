import { Bath, BedDouble, Car, MapPin, Ruler, X } from "lucide-react";
import { useEffect } from "react";
import { Image } from "@/components/compat/Image";
import { Link } from "@/components/compat/Link";
import { SaveButton } from "@/components/SaveButton";
import type { Property } from "@/data/marketplace";
import { getAgentForProperty } from "@/data/marketplace";

type QuickViewModalProps = {
  property: Property;
  open: boolean;
  onClose: () => void;
};

export function QuickViewModal({ property, open, onClose }: QuickViewModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  const agent = getAgentForProperty(property);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/70 px-3 py-4 backdrop-blur-sm animate-in fade-in sm:px-4 sm:py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`quickview-${property.id}`}
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-background shadow-luxury sm:rounded-3xl md:max-h-[calc(100dvh-4rem)] md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-background/95 text-charcoal shadow-soft transition hover:bg-primary hover:text-primary-foreground sm:right-4 sm:top-4 sm:size-10"
          aria-label="Close quick view"
        >
          <X size={18} />
        </button>

        <div className="relative h-48 shrink-0 overflow-hidden bg-muted sm:h-64 md:h-auto md:w-[55%]">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover"
          />
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
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto p-5 sm:p-6 md:p-8">
          <p className="text-eyebrow text-primary">
            {property.propertyType}
          </p>
          <h2
            id={`quickview-${property.id}`}
            className="mt-2 font-serif text-2xl leading-tight text-charcoal text-balance sm:text-h3"
          >
            {property.title}
          </h2>
          <p className="mt-2 flex items-center gap-2 text-caption text-muted-foreground">
            <MapPin size={15} className="shrink-0 text-primary" aria-hidden="true" />
            <span className="truncate">{property.suburb}, {property.state} {property.postcode}</span>
          </p>

          <p className="mt-4 font-serif text-2xl text-charcoal sm:text-h2">{property.priceLabel}</p>

          <div className="mt-5 grid grid-cols-4 gap-2 border-y border-border/70 py-4 text-caption text-charcoal-soft sm:gap-3">
            <span className="flex min-w-0 flex-col items-start gap-1">
              <BedDouble size={16} className="shrink-0 text-primary" aria-hidden="true" />
              <span className="truncate">{property.bedrooms} beds</span>
            </span>
            <span className="flex min-w-0 flex-col items-start gap-1">
              <Bath size={16} className="shrink-0 text-primary" aria-hidden="true" />
              <span className="truncate">{property.bathrooms} baths</span>
            </span>
            <span className="flex min-w-0 flex-col items-start gap-1">
              <Car size={16} className="shrink-0 text-primary" aria-hidden="true" />
              <span className="truncate">{property.parking} parking</span>
            </span>
            <span className="flex min-w-0 flex-col items-start gap-1">
              <Ruler size={16} className="shrink-0 text-primary" aria-hidden="true" />
              <span className="truncate text-eyebrow">{property.landSize}</span>
            </span>
          </div>

          <p className="mt-4 line-clamp-4 text-body text-charcoal-soft">
            {property.description}
          </p>

          <div className="mt-5 flex items-center gap-3 border-t border-border/70 pt-4">
            <Image
              src={agent.image}
              alt={agent.name}
              width={40}
              height={40}
              className="size-10 rounded-full object-cover ring-2 ring-primary-soft"
            />
            <div>
              <p className="text-caption font-semibold text-charcoal">{agent.name}</p>
              <p className="text-caption text-muted-foreground">{property.listedAt}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={`/properties/${property.id}`}
              className="flex-1 rounded-full bg-primary px-5 py-2.5 text-center text-caption font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              View full listing
            </Link>
            <SaveButton
              propertyId={property.id}
              label={property.title}
              withText
              className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-caption font-semibold text-charcoal transition hover:border-primary hover:text-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
