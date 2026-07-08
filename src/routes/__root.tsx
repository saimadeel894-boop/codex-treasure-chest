import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";



function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Nestoria Australia | Property Marketplace" },
      {
        name: "description",
        content:
          "A modern Australian real estate marketplace for buying, renting, listing, and discovering properties.",
      },
      { name: "author", content: "Nestoria Australia" },
      { property: "og:title", content: "Nestoria Australia | Property Marketplace" },
      {
        property: "og:description",
        content:
          "Buy, rent, sell and discover premium homes across Australia in a polished marketplace experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@300;400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Nestoria Australia",
          url: "/",
          logo: "/favicon.ico",
          description:
            "A modern Australian real estate marketplace for buying, renting, listing, and discovering premium properties.",
          areaServed: "AU",
          sameAs: [
            "https://www.instagram.com/",
            "https://twitter.com/",
            "https://www.linkedin.com/",
          ],
          contactPoint: [
            {
              "@type": "ContactPoint",
              telephone: "+61-1300-000-123",
              contactType: "customer support",
              areaServed: "AU",
              availableLanguage: ["English"],
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": "/#website",
          name: "Nestoria Australia",
          alternateName: "Nestoria AU",
          url: "/",
          inLanguage: "en-AU",
          publisher: { "@type": "Organization", name: "Nestoria Australia" },
          potentialAction: [
            {
              "@type": "SearchAction",
              name: "Search properties",
              target: {
                "@type": "EntryPoint",
                urlTemplate: "/search?location={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
            {
              "@type": "SearchAction",
              name: "Search saved properties",
              target: {
                "@type": "EntryPoint",
                urlTemplate: "/saved-properties?q={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
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
              name: "Is Nestoria Australia free to use for buyers and renters?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Browsing listings, saving properties, contacting agents and booking inspections on Nestoria Australia is completely free for buyers and renters.",
              },
            },
            {
              "@type": "Question",
              name: "How do I list a property for sale or rent?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Create a free account, then use the List a property flow to add photos, description, price and inspection times. Your listing is reviewed and published within one business day.",
              },
            },
            {
              "@type": "Question",
              name: "Which Australian cities and suburbs are covered?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Nestoria covers every capital city — Sydney, Melbourne, Brisbane, Perth, Adelaide, Hobart, Darwin and Canberra — plus major regional centres across NSW, VIC, QLD, WA, SA, TAS, NT and ACT.",
              },
            },
            {
              "@type": "Question",
              name: "How do I contact a listing agent?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Every property detail page includes the listing agent's profile, phone number and an enquiry form. Messages are delivered to the agent instantly and copied to your Nestoria inbox.",
              },
            },
            {
              "@type": "Question",
              name: "Can I save searches and get alerts for new listings?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Signed-in users can save searches by suburb, price and property type, and receive email alerts whenever matching new listings go live.",
              },
            },
            {
              "@type": "Question",
              name: "How are listings verified?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Every listing is submitted by a verified agent or vendor and quality-checked by the Nestoria team for accurate address, price, photography and inspection details before going live.",
              },
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </QueryClientProvider>
  );
}
