import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  CheckCircle2,
  Compass,
  Quote,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Link } from "@/components/compat/Link";
import { Image } from "@/components/compat/Image";
import heroPoster from "@/assets/hero-poster.jpg";
import { AgentCard } from "@/components/AgentCard";
import { PropertyCard } from "@/components/PropertyCard";
import { SearchComponent } from "@/components/SearchComponent";
import {
  agents,
  blogPosts,
  popularLocations,
  properties,
} from "@/data/marketplace";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nestoria Australia — Luxury Property Marketplace" },
      {
        name: "description",
        content:
          "Discover Australia's most considered homes. A premium marketplace to buy, rent, and list distinctive properties across every capital city.",
      },
      { property: "og:title", content: "Nestoria Australia — Luxury Property Marketplace" },
      {
        property: "og:description",
        content:
          "A curated real estate experience for buyers, renters, and sellers across Australia.",
      },
      { property: "og:image", content: heroPoster },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroPoster },
    ],
    links: [
      { rel: "preload", as: "image", href: heroPoster, fetchpriority: "high" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Nestoria Australia",
          url: "/",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: 4.9,
            bestRating: 5,
            worstRating: 1,
            ratingCount: 1284,
            reviewCount: 1284,
          },
          review: testimonials.map((t) => ({
            "@type": "Review",
            reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5 },
            author: { "@type": "Person", name: t.name },
            reviewBody: t.quote,
            itemReviewed: {
              "@type": "Organization",
              name: "Nestoria Australia",
            },
          })),
        }),
      },
    ],
  }),
  component: Home,
});

const trustPillars = [
  {
    title: "Verified listings",
    text: "Every property is quality-checked with premium photography and rich detail before it goes live.",
    icon: ShieldCheck,
  },
  {
    title: "Concierge search",
    text: "Suburb intelligence, price context and inspection planning built into every discovery flow.",
    icon: Compass,
  },
  {
    title: "Award-winning agents",
    text: "A hand-selected network of Australia's most trusted principal agents and boutique agencies.",
    icon: Award,
  },
];

const stats = [
  { value: 38240, suffix: "+", label: "Curated listings" },
  { value: 720, suffix: "+", label: "Trusted agents" },
  { value: 62, suffix: "", label: "Suburbs covered" },
  { value: 98, suffix: "%", label: "Client satisfaction" },
];

const testimonials = [
  {
    quote:
      "Nestoria felt like a private concierge. The photography, the shortlist, the calm agents — it was the first time home hunting felt considered.",
    name: "Isabelle & Marcus",
    role: "Bought in Mosman, NSW",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80",
  },
  {
    quote:
      "We listed our townhouse and had three qualified inspections within a week. The presentation of our home on the platform was flawless.",
    name: "Daniel Whitaker",
    role: "Sold in South Yarra, VIC",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  },
  {
    quote:
      "The suburb intelligence and neighbourhood pages gave us confidence relocating from Sydney to Noosa. A genuinely premium experience.",
    name: "Sophia Nguyen",
    role: "Rented in Noosa Heads, QLD",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
  },
];

function useCountUp(target: number, duration = 1600) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === "undefined") {
      setValue(target);
      return;
    }
    const el = ref.current;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(Math.round(target * eased));
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, duration]);

  return { value, ref };
}

function AnimatedStat({ value, suffix, label }: (typeof stats)[number]) {
  const { value: v, ref } = useCountUp(value);
  return (
    <div className="border-l border-border/60 pl-6 first:border-l-0 first:pl-0">
      <p className="font-serif text-5xl leading-none text-charcoal sm:text-6xl">
        <span ref={ref}>{v.toLocaleString()}</span>
        <span className="text-primary">{suffix}</span>
      </p>
      <p className="mt-3 text-sm uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

function Home() {
  const featured = properties.slice(0, 3);
  const showcase = properties[0];
  const latest = properties.slice(3, 6);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof IntersectionObserver === "undefined") return;
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      video.pause();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!videoLoaded) {
            setVideoLoaded(true);
            video.preload = "auto";
            video.load();
          }
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [videoLoaded]);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative isolate min-h-[94vh] overflow-hidden bg-charcoal">
        <img
          src={heroPoster}
          alt="Luxury Australian coastal home at dusk"
          fetchPriority="high"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={heroPoster}
          width={1920}
          height={1080}
          disableRemotePlayback
          aria-hidden="true"
        >
          {videoLoaded && (
            <>
              <source
                src="https://cdn.coverr.co/videos/coverr-a-luxury-house-with-a-pool-2633/1080p.mp4"
                type="video/mp4"
              />
              <source
                src="https://cdn.coverr.co/videos/coverr-aerial-view-of-a-modern-neighborhood-8801/1080p.mp4"
                type="video/mp4"
              />
            </>
          )}
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/40 to-charcoal/85" />
        <div
          aria-hidden="true"
          className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-primary/25 blur-3xl"
        />

        <div className="relative mx-auto flex min-h-[94vh] max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="max-w-4xl [animation:fadeInUp_0.9s_ease-out_both]">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-background/25 bg-background/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-background backdrop-blur-md">
              <Sparkles size={13} className="text-primary" aria-hidden="true" />
              Australia&rsquo;s premium property marketplace
            </p>
            <h1 className="font-serif text-5xl leading-[1.02] tracking-tight text-background text-balance sm:text-7xl lg:text-8xl">
              Homes with a{" "}
              <em className="not-italic text-primary">quiet</em> sense
              <br className="hidden sm:block" /> of <em className="italic">occasion.</em>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-background/85 sm:text-lg">
              A curated marketplace for buying, renting, and listing Australia&rsquo;s most
              considered residences &mdash; from harbourside estates to coastal retreats.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/search"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-luxury transition hover:-translate-y-0.5 hover:bg-primary/90"
              >
                Explore properties
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/list-property"
                className="inline-flex items-center gap-2 rounded-full border border-background/30 bg-background/10 px-8 py-4 text-sm font-semibold text-background backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-background/20"
              >
                List with Nestoria
              </Link>
            </div>
          </div>

          <div className="mt-14 w-full max-w-5xl [animation:fadeInUp_1.1s_ease-out_0.15s_both]">
            <SearchComponent />
          </div>

          <div className="mt-14 grid w-full max-w-3xl grid-cols-3 gap-6 text-background/90">
            <div>
              <p className="font-serif text-3xl text-background">38k+</p>
              <p className="text-xs uppercase tracking-widest text-background/70">Listings</p>
            </div>
            <div>
              <p className="font-serif text-3xl text-background">720+</p>
              <p className="text-xs uppercase tracking-widest text-background/70">Trusted agents</p>
            </div>
            <div>
              <p className="font-serif text-3xl text-background">4.9★</p>
              <p className="text-xs uppercase tracking-widest text-background/70">Client rating</p>
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-background/70"
        >
          <div className="h-10 w-6 rounded-full border border-background/40 p-1">
            <div className="h-2 w-full rounded-full bg-primary [animation:floaty_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* ================= TRUST PILLARS ================= */}
      <section className="relative -mt-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 rounded-3xl border border-border/70 bg-surface p-6 shadow-luxury sm:grid-cols-3 sm:p-8">
          {trustPillars.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-serif text-lg text-charcoal">{p.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{p.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= FEATURED PROPERTIES ================= */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                — Featured this week
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight text-charcoal sm:text-5xl">
                Handpicked homes worth an inspection
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                A tightly edited shortlist of listings across Sydney, Melbourne and the coast.
              </p>
            </div>
            <Link
              href="/search"
              className="group inline-flex items-center gap-2 self-start rounded-full border border-border px-5 py-3 text-sm font-medium text-charcoal transition hover:border-primary hover:text-primary sm:self-end"
            >
              View all properties
              <ArrowUpRight
                size={15}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= LUXURY SHOWCASE ================= */}
      <section className="relative overflow-hidden bg-charcoal py-24 text-background">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl shadow-luxury">
                <Image
                  src={showcase.images[0]}
                  alt={showcase.title}
                  width={900}
                  height={1100}
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-background/95 p-5 text-charcoal shadow-luxury backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Signature listing
                  </p>
                  <p className="mt-2 font-serif text-2xl leading-tight">{showcase.title}</p>
                  <p className="mt-1 text-sm text-charcoal-soft">
                    {showcase.suburb}, {showcase.state}
                  </p>
                </div>
              </div>
              <div className="absolute -left-6 -top-6 hidden size-32 rounded-full border border-primary/40 md:block" />
              <div className="absolute -bottom-8 -right-6 hidden size-40 rounded-full bg-primary/15 blur-2xl md:block" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                — The Luxury Collection
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight text-background sm:text-5xl">
                Australia&rsquo;s most distinctive residences, presented with intention.
              </h2>
              <p className="mt-5 text-base leading-8 text-background/75">
                Each home in the Nestoria collection is presented with editorial photography,
                floor-plan clarity, and neighbourhood context &mdash; so buyers arrive ready.
              </p>

              <ul className="mt-8 space-y-3">
                {[
                  "Editorial photography & cinematic walkthroughs",
                  "Verified agents with hyper-local expertise",
                  "Suburb intelligence: schools, transport, market data",
                  "Concierge inspection scheduling",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-background/85">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href={`/properties/${showcase.id}`}
                className="group mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-luxury"
              >
                View signature listing
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LATEST LISTINGS ================= */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                — Just listed
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight text-charcoal sm:text-5xl">
                Recently listed across Australia
              </h2>
            </div>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {latest.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= POPULAR LOCATIONS ================= */}
      <section className="bg-muted/60 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              — Popular destinations
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-charcoal sm:text-5xl">
              Explore Australia&rsquo;s most sought-after cities
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {popularLocations.map((location, i) => (
              <Link
                key={`${location.name}-${location.state}`}
                href="/search"
                className="group relative aspect-[4/5] overflow-hidden rounded-3xl shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-luxury"
              >
                <Image
                  src={`https://images.unsplash.com/photo-${
                    [
                      "1506973035872-a4ec16b8e8d9",
                      "1514395462725-fb4566210144",
                      "1524293581917-878a6d017c71",
                      "1523482580672-f109ba8cb9be",
                      "1516571748831-5d81767b788d",
                      "1590650153855-d9e808231d41",
                    ][i % 6]
                  }?auto=format&fit=crop&w=900&q=80`}
                  alt={`${location.name}, ${location.state}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  loading="lazy"
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-background">
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-background/80">
                    {location.state}
                  </p>
                  <div className="mt-1 flex items-end justify-between gap-3">
                    <h3 className="font-serif text-3xl leading-tight">{location.name}</h3>
                    <span className="flex size-10 items-center justify-center rounded-full bg-background/95 text-charcoal transition group-hover:bg-primary group-hover:text-primary-foreground">
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-background/80">
                    {location.listings.toLocaleString()} listings
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 rounded-3xl border border-border/70 bg-surface p-10 shadow-soft sm:grid-cols-2 lg:grid-cols-4 lg:p-14">
            {stats.map((s) => (
              <AnimatedStat key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED AGENTS ================= */}
      <section className="bg-muted/60 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                — Local experts
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight text-charcoal sm:text-5xl">
                Meet the agents behind the listings
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                A boutique network of Australia&rsquo;s most trusted principal agents.
              </p>
            </div>
            <Link
              href="/agents/mia-carter"
              className="group inline-flex items-center gap-2 self-start rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium text-charcoal transition hover:border-primary hover:text-primary sm:self-end"
            >
              Browse all agents
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              — Stories from clients
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-charcoal sm:text-5xl">
              Trusted by buyers, sellers, and renters across the country
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="relative flex flex-col rounded-3xl border border-border/70 bg-surface p-8 shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-luxury"
              >
                <Quote size={28} className="text-primary" aria-hidden="true" />
                <blockquote className="mt-5 font-serif text-xl leading-relaxed text-charcoal">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3 border-t border-border/60 pt-6">
                  <Image
                    src={t.image}
                    alt={t.name}
                    width={44}
                    height={44}
                    className="size-11 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BLOG PREVIEW ================= */}
      <section className="bg-muted/60 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                — Journal
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight text-charcoal sm:text-5xl">
                Insights from the Australian market
              </h2>
            </div>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 self-start rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium text-charcoal transition hover:border-primary hover:text-primary sm:self-end"
            >
              Read the journal
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="group overflow-hidden rounded-3xl border border-border/70 bg-surface shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-luxury"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    loading="lazy"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-primary">
                    <span>{post.category}</span>
                    <span className="text-muted-foreground">{post.readTime}</span>
                  </div>
                  <h3 className="mt-4 font-serif text-2xl leading-snug text-charcoal transition group-hover:text-primary">
                    {post.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <p className="mt-6 text-xs text-muted-foreground">{post.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= NEWSLETTER ================= */}
      <section className="bg-background pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-charcoal p-10 text-background shadow-luxury sm:p-14 lg:p-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
            />
            <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                  — The Nestoria Letter
                </p>
                <h2 className="mt-4 font-serif text-4xl leading-tight text-background sm:text-5xl">
                  New listings, quietly delivered.
                </h2>
                <p className="mt-5 max-w-lg text-base leading-8 text-background/80">
                  Sign up for a considered weekly edit of new listings, market data, and
                  neighbourhood stories from across Australia.
                </p>
              </div>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-3 rounded-2xl bg-background/10 p-3 backdrop-blur-md sm:flex-row"
              >
                <label className="flex-1">
                  <span className="sr-only">Email address</span>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="h-13 w-full rounded-xl border border-background/20 bg-background/5 px-4 py-3.5 text-sm text-background placeholder:text-background/60 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/25"
                  />
                </label>
                <button
                  type="submit"
                  className="flex h-13 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-luxury"
                >
                  Subscribe
                  <ArrowRight size={15} aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
