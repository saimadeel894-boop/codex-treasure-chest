import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Bath, BedDouble, Car, CheckCircle2, MapPin, Ruler } from "lucide-react";
import { getProperty } from "@/lib/properties.functions";
import { formatPrice } from "@/lib/format";
import { resolvePropertyImage } from "@/lib/property-images";
import { FavouriteButton } from "@/components/site/FavouriteButton";

const propertyQuery = (id: string) =>
  queryOptions({
    queryKey: ["property", id],
    queryFn: async () => {
      const p = await getProperty({ data: { id } });
      if (!p) throw notFound();
      return p;
    },
  });

export const Route = createFileRoute("/properties/$id")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(propertyQuery(params.id)),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Property not found | Domicile" }, { name: "robots", content: "noindex" }] };
    }
    const p: any = loaderData;
    const price = formatPrice(p.price_cents, p.listing_type, p.rent_period);
    const title = `${p.title} — ${p.suburb}, ${p.state} | Domicile`;
    const desc = `${price} · ${p.bedrooms} bed · ${p.bathrooms} bath · ${p.parking} car in ${p.suburb}, ${p.state}. ${p.description.slice(0, 100)}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: PropertyDetail,
  errorComponent: ({ error }) => <div className="p-8 text-destructive">Error: {error.message}</div>,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="font-display text-4xl font-semibold text-ink">Property not found</h1>
      <p className="mt-2 text-muted-foreground">This listing may have been removed.</p>
      <Link to="/buy" className="mt-6 inline-flex rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold">
        Browse properties
      </Link>
    </div>
  ),
});

function PropertyDetail() {
  const { id } = Route.useParams();
  const { data: p } = useSuspenseQuery(propertyQuery(id));
  const images = p.images.length ? p.images : [{ url: "prop-1", alt: p.title }];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Gallery */}
      <div className="grid gap-2 grid-cols-4 rounded-2xl overflow-hidden">
        <div className="col-span-4 md:col-span-3 relative aspect-[16/10] bg-muted">
          <img src={resolvePropertyImage(images[0].url)} alt={images[0].alt ?? p.title} className="h-full w-full object-cover" />
          <FavouriteButton propertyId={p.id} className="absolute right-4 top-4" size={20} />
        </div>
        <div className="hidden md:grid gap-2 col-span-1 grid-rows-2">
          {[images[1] ?? images[0], images[2] ?? images[0]].map((img, i) => (
            <div key={i} className="relative aspect-[4/3] bg-muted overflow-hidden">
              <img src={resolvePropertyImage(img.url)} alt={img.alt ?? p.title} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-full bg-primary/10 text-primary px-3 py-1 font-semibold">
              {p.listing_type === "sale" ? "For sale" : p.listing_type === "rent" ? "For rent" : "Sold"}
            </span>
            <span className="rounded-full bg-muted text-muted-foreground px-3 py-1 font-semibold capitalize">
              {p.property_type}
            </span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold text-ink">{p.title}</h1>
          <p className="mt-2 flex items-center gap-1 text-muted-foreground">
            <MapPin size={16} /> {p.address_line}, {p.suburb} {p.state} {p.postcode}
          </p>

          <div className="mt-6 flex items-center gap-6 text-ink border-y border-border py-4">
            <div className="flex items-center gap-2"><BedDouble size={20} /> <span className="font-semibold">{p.bedrooms}</span> beds</div>
            <div className="flex items-center gap-2"><Bath size={20} /> <span className="font-semibold">{p.bathrooms}</span> baths</div>
            <div className="flex items-center gap-2"><Car size={20} /> <span className="font-semibold">{p.parking}</span> car</div>
            {p.land_size_sqm && (
              <div className="hidden sm:flex items-center gap-2"><Ruler size={20} /> {p.land_size_sqm}m² land</div>
            )}
          </div>

          <div className="mt-8">
            <h2 className="font-display text-2xl font-semibold text-ink">About this property</h2>
            <p className="mt-3 text-ink/80 whitespace-pre-line leading-7">{p.description}</p>
          </div>

          {p.features.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-2xl font-semibold text-ink">Features</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-ink/80">
                    <CheckCircle2 size={16} className="text-primary" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <p className="font-display text-3xl font-semibold text-ink">
              {formatPrice(p.price_cents, p.listing_type, p.rent_period)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{p.suburb}, {p.state}</p>
            <div className="mt-6 flex flex-col gap-3">
              <a href="mailto:hello@domicile.example" className="inline-flex justify-center items-center rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold hover:opacity-95">
                Contact the seller
              </a>
              <FavouriteButton propertyId={p.id} className="self-center" />
            </div>
            <p className="mt-4 text-xs text-muted-foreground text-center">
              Sign in to save this property to your favourites.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
