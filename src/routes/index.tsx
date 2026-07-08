import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Building2, MapPin, ShieldCheck, TrendingUp } from "lucide-react";

import { Link } from "@/components/compat/Link";
import heroPoster from "@/assets/hero-poster.jpg";
import { AgentCard } from "@/components/AgentCard";
import { PropertyCard } from "@/components/PropertyCard";
import { SearchComponent } from "@/components/SearchComponent";
import { agents, popularLocations, properties } from "@/data/marketplace";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nestoria Australia | Property Marketplace" },
      {
        name: "description",
        content:
          "A modern Australian real estate marketplace for buying, renting, listing, and discovering properties.",
      },
      { property: "og:title", content: "Nestoria Australia | Property Marketplace" },
      {
        property: "og:description",
        content:
          "Buy, rent, sell and discover premium homes across Australia in a polished marketplace experience.",
      },
      { property: "og:image", content: heroPoster },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroPoster },
    ],
    links: [
      { rel: "preload", as: "image", href: heroPoster, fetchpriority: "high" },
    ],
  }),
  component: Home,
});

const featureHighlights = [
  {
    title: "Verified listing flows",
    text: "Clean listing cards, enquiry paths, and seller-friendly presentation are ready for backend connection.",
    icon: ShieldCheck,
  },
  {
    title: "Suburb-first discovery",
    text: "Search and popular location sections are structured for future maps, school zones, and market data.",
    icon: MapPin,
  },
  {
    title: "Growth-ready UI",
    text: "The frontend supports future valuation tools, agent analytics, subscriptions, and saved searches.",
    icon: TrendingUp,
  },
];

function Home() {
  const featuredProperties = properties.slice(0, 3);
  const latestProperties = properties.slice(3);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [inView, setInView] = useState(false);

  // Observe visibility + wire error/playing listeners.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const markFailed = () => setVideoFailed(true);
    video.addEventListener("error", markFailed);

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return () => video.removeEventListener("error", markFailed);
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(video);
    return () => {
      observer.disconnect();
      video.removeEventListener("error", markFailed);
    };
  }, []);

  // Trigger source injection on first visibility.
  useEffect(() => {
    if (inView && !videoLoaded) setVideoLoaded(true);
  }, [inView, videoLoaded]);

  // After sources are in the DOM, load and play; pause when offscreen.
  // Retries up to 3 times with backoff if play() rejects or stalls.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoLoaded) return;

    if (!inView) {
      video.pause();
      return;
    }

    const MAX_ATTEMPTS = 3;
    let attempt = 0;
    let stallTimer: ReturnType<typeof setTimeout> | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const clearTimers = () => {
      if (stallTimer) clearTimeout(stallTimer);
      if (retryTimer) clearTimeout(retryTimer);
      stallTimer = null;
      retryTimer = null;
    };

    const onPlaying = () => {
      clearTimers();
      setVideoFailed(false);
    };
    video.addEventListener("playing", onPlaying);

    const tryPlay = () => {
      if (cancelled) return;
      attempt += 1;

      video.preload = "auto";
      try {
        video.load();
      } catch {
        /* ignore */
      }

      stallTimer = setTimeout(() => {
        if (cancelled) return;
        if (video.readyState < 3 || video.paused) scheduleRetry();
      }, 4000);

      void video.play().catch(() => {
        if (!cancelled) scheduleRetry();
      });
    };

    const scheduleRetry = () => {
      clearTimers();
      if (attempt >= MAX_ATTEMPTS) {
        setVideoFailed(true);
        return;
      }
      const backoff = 600 * attempt; // 600ms, 1200ms
      retryTimer = setTimeout(tryPlay, backoff);
    };

    tryPlay();

    return () => {
      cancelled = true;
      clearTimers();
      video.removeEventListener("playing", onPlaying);
    };
  }, [videoLoaded, inView]);





  return (
    <>
      <section className="relative isolate min-h-[92vh] overflow-hidden bg-slate-950">
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
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${videoFailed ? "opacity-0" : "opacity-100"}`}
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
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950/80" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="animate-[fadeInUp_0.9s_ease-out_both] max-w-4xl">
            <p className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md">
              Premium Australian Property Marketplace
            </p>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Find Your Perfect Home <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">Across Australia</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-100/90 sm:text-lg">
              Discover homes, apartments, and investment properties from trusted agents across Australia.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/search"
                className="group inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/40 transition hover:-translate-y-0.5 hover:bg-emerald-500 hover:shadow-emerald-900/60"
              >
                Browse Properties
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <Link
                href="/list-property"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                List Your Property
              </Link>
            </div>
          </div>

          <div className="mt-12 w-full max-w-5xl animate-[fadeInUp_1.1s_ease-out_0.15s_both] [animation:fadeInUp_1.1s_ease-out_0.15s_both,floaty_6s_ease-in-out_2s_infinite]">
            <div className="rounded-2xl border border-white/25 bg-white/15 p-2 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
              <SearchComponent />
            </div>
          </div>

          <div className="mt-12 grid w-full max-w-3xl gap-6 text-white sm:grid-cols-3">
            <div>
              <p className="text-3xl font-bold">38k+</p>
              <p className="text-sm text-slate-200">Australian listings</p>
            </div>
            <div>
              <p className="text-3xl font-bold">720+</p>
              <p className="text-sm text-slate-200">Agent partners</p>
            </div>
            <div>
              <p className="text-3xl font-bold">24/7</p>
              <p className="text-sm text-slate-200">Property discovery</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
                Featured properties
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">Fresh homes worth inspecting</h2>
            </div>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-900"
            >
              View all properties
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.65fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
                Buy or rent
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">
                Marketplace sections ready for every property journey
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                The UI separates buying, renting, agent discovery, and listing creation while
                keeping navigation simple on desktop and mobile.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {[
                  { label: "Buy a home", href: "/search?mode=buy" },
                  { label: "Rent a property", href: "/search?mode=rent" },
                  { label: "List with an agent", href: "/list-property" },
                  { label: "Explore agencies", href: "/agencies/harbour-north" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 text-sm font-bold text-slate-800 shadow-sm transition hover:border-emerald-300 hover:text-emerald-800"
                  >
                    {item.label}
                    <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {featureHighlights.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <span className="flex size-11 items-center justify-center rounded-md bg-emerald-100 text-emerald-800">
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-lg font-bold text-slate-950">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{feature.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
                Latest properties
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">Recently listed across Australia</h2>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
                Popular locations
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">Browse by capital city</h2>
            </div>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-900"
            >
              Explore suburbs
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularLocations.map((location) => (
              <Link
                key={`${location.name}-${location.state}`}
                href="/search"
                className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-lg hover:shadow-slate-950/5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-950 group-hover:text-emerald-800">
                      {location.name}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-slate-500">{location.state}</p>
                  </div>
                  <span className="flex size-11 items-center justify-center rounded-md bg-slate-100 text-emerald-800">
                    <Building2 size={21} aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-5 text-sm text-slate-600">
                  {location.listings.toLocaleString()} listings available
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.6fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
                Agent network
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">Meet the local experts</h2>
              <p className="mt-4 leading-7 text-slate-600">
                Agent profiles include listings, agency details, contact actions, and performance
                signals that can later be powered by verified sales data.
              </p>
              <Link
                href="/agents/mia-carter"
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
              >
                View agent profile
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
