import { createFileRoute, notFound } from "@tanstack/react-router";
import { Bath, BedDouble, Car, CheckCircle2, MapPin, Quote, Ruler, Star } from "lucide-react";
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

type PropertyTestimonial = {
  author: string;
  role: string;
  rating: number;
  datePublished: string;
  body: string;
};

const TESTIMONIAL_TEMPLATES: Array<Omit<PropertyTestimonial, "body"> & { body: (suburb: string) => string }> = [
  {
    author: "Amelia Foster",
    role: "Buyer",
    rating: 5,
    datePublished: "2026-04-18",
    body: (suburb) =>
      `The inspection was flawlessly organised and the listing photography matched the home perfectly. We felt genuinely guided through every step of buying in ${suburb}.`,
  },
  {
    author: "Liam Bennett",
    role: "Neighbour",
    rating: 5,
    datePublished: "2026-03-02",
    body: (suburb) =>
      `Beautifully presented home in a quiet pocket of ${suburb}. The Nestoria team ran a considered, calm campaign — refreshing compared with other portals.`,
  },
  {
    author: "Priya Anand",
    role: "Investor",
    rating: 4.5,
    datePublished: "2026-02-14",
    body: (suburb) =>
      `Data on the ${suburb} listing was transparent — rental yield, comparable sales and inspection interest all clearly reported. Made due diligence straightforward.`,
  },
];

function buildTestimonials(suburb: string): PropertyTestimonial[] {
  return TESTIMONIAL_TEMPLATES.map((t) => ({
    author: t.author,
    role: t.role,
    rating: t.rating,
    datePublished: t.datePublished,
    body: t.body(suburb),
  }));
}


export const Route = createFileRoute("/properties/$id")({
  head: ({ params }) => {
    const property = getPropertyById(params.id);
    if (!property) {
      return { meta: [{ title: "Property not found" }] };
    }
    const testimonials = buildTestimonials(property.suburb);
    const path = `/properties/${params.id}`;
    const description = property.description?.slice(0, 155) ?? "Property details";
    return {
      meta: [
        { title: `${property.title} | Nestoria` },
        { name: "description", content: description },
        { property: "og:title", content: property.title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: path },
        { property: "og:image", content: property.images[0] },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: property.images[0] },
      ],
      links: [{ rel: "canonical", href: path }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["Product", "Residence"],
            name: property.title,
            description: property.description,
            image: property.images,
            url: path,
            address: {
              "@type": "PostalAddress",
              streetAddress: property.address,
              addressLocality: property.suburb,
              addressRegion: property.state,
              postalCode: property.postcode,
              addressCountry: "AU",
            },
            numberOfRooms: property.bedrooms,
            numberOfBathroomsTotal: property.bathrooms,
            floorSize: property.landSize,
            offers: {
              "@type": "Offer",
              price: property.price,
              priceCurrency: "AUD",
              availability: "https://schema.org/InStock",
              category:
                property.mode === "Rent" ? "https://schema.org/RentAction" : "https://schema.org/SellAction",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: (
                testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length
              ).toFixed(2),
              bestRating: 5,
              worstRating: 1,
              reviewCount: testimonials.length,
            },
            review: testimonials.map((t) => ({
              "@type": "Review",
              itemReviewed: {
                "@type": "Residence",
                name: property.title,
                url: path,
              },
              reviewRating: {
                "@type": "Rating",
                ratingValue: t.rating,
                bestRating: 5,
                worstRating: 1,
              },
              author: { "@type": "Person", name: t.author },
              datePublished: t.datePublished,
              reviewBody: t.body,
            })),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              {
                "@type": "ListItem",
                position: 2,
                name: property.mode === "Rent" ? "Rent" : "Buy",
                item: `/search?mode=${property.mode.toLowerCase()}`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: `${property.suburb}, ${property.state}`,
                item: `/search?mode=${property.mode.toLowerCase()}&state=${property.state}&suburb=${encodeURIComponent(property.suburb)}`,
              },
              { "@type": "ListItem", position: 4, name: property.title, item: path },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: `What is the price of ${property.title}?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `${property.title} is listed for ${property.priceLabel} (${property.mode === "Rent" ? "for rent" : "for sale"}).`,
                },
              },
              {
                "@type": "Question",
                name: `Where is ${property.title} located?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `${property.address}, ${property.suburb}, ${property.state} ${property.postcode}, Australia.`,
                },
              },
              {
                "@type": "Question",
                name: "How many bedrooms and bathrooms does this property have?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `This ${property.propertyType.toLowerCase()} has ${property.bedrooms} bedroom${property.bedrooms === 1 ? "" : "s"}, ${property.bathrooms} bathroom${property.bathrooms === 1 ? "" : "s"}, and ${property.parking} parking space${property.parking === 1 ? "" : "s"}.`,
                },
              },
              {
                "@type": "Question",
                name: "What is the land size?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `The land size is ${property.landSize}.`,
                },
              },
              {
                "@type": "Question",
                name: "What are the key features of this property?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: property.features.join(", ") + ".",
                },
              },
              {
                "@type": "Question",
                name: "When can I inspect this property?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: property.inspectionTimes.length
                    ? `Scheduled inspection times: ${property.inspectionTimes.join("; ")}.`
                    : "Contact the listing agent to arrange a private inspection.",
                },
              },
            ],
          }),
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
  const testimonials = buildTestimonials(property.suburb);

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

      <section className="mt-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Reviews</h2>
            <p className="mt-1 text-sm text-slate-600">
              What buyers and neighbours are saying about listings in {property.suburb}.
            </p>
          </div>
          <p className="text-sm font-semibold text-slate-700">
            {(
              testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length
            ).toFixed(1)}{" "}
            / 5 · {testimonials.length} reviews
          </p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <article
              key={t.author}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <Quote size={18} className="text-emerald-700" aria-hidden="true" />
              <p className="mt-3 text-sm leading-6 text-slate-700">{t.body}</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-950">{t.author}</p>
                  <p className="text-xs text-slate-500">
                    {t.role} ·{" "}
                    <time dateTime={t.datePublished}>
                      {new Date(t.datePublished).toLocaleDateString("en-AU", {
                        month: "short",
                        year: "numeric",
                      })}
                    </time>
                  </p>
                </div>
                <span className="flex items-center gap-1 text-sm font-semibold text-amber-600">
                  <Star size={14} className="fill-amber-400 text-amber-400" aria-hidden="true" />
                  {t.rating.toFixed(1)}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

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
