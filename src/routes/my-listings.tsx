import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@/components/compat/Link";
import { Pagination } from "@/components/Pagination";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyCardSkeletonGrid } from "@/components/PropertyCardSkeleton";
import { properties } from "@/data/marketplace";

const PER_PAGE = 6;

export const Route = createFileRoute("/my-listings")({
  head: () => ({
    meta: [
      { title: "My listings | Nestoria Australia" },
      { name: "description", content: "Manage the properties you have listed on Nestoria Australia." },
    ],
  }),
  component: MyListingsPage,
});

function MyListingsPage() {
  // Demo: pretend the current user owns the first three listings.
  const mine = properties.slice(0, 3);
  const [hydrated, setHydrated] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const totalPages = Math.max(1, Math.ceil(mine.length / PER_PAGE));
  const pageItems = mine.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-eyebrow text-primary">Your portfolio</p>
          <h1 className="mt-2 font-serif text-h2 text-charcoal">My listings</h1>
          <p className="mt-2 text-caption text-muted-foreground">
            {hydrated
              ? `${mine.length} active listing${mine.length === 1 ? "" : "s"} across your account.`
              : "Loading your listings…"}
          </p>
        </div>
        <Link
          href="/list-property"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-caption font-semibold text-primary-foreground shadow-soft transition hover:bg-primary/90"
        >
          <Plus size={16} aria-hidden="true" />
          Add new listing
        </Link>
      </header>

      <div className="mt-8">
        {!hydrated ? (
          <PropertyCardSkeletonGrid count={3} />
        ) : mine.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border/70 bg-surface p-16 text-center">
            <p className="text-eyebrow text-primary">Empty portfolio</p>
            <h2 className="mt-2 font-serif text-h3 text-charcoal">No listings yet</h2>
            <p className="mx-auto mt-3 max-w-md text-caption text-muted-foreground">
              Start showcasing your property to thousands of buyers and renters across Australia.
            </p>
            <Link
              href="/list-property"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-caption font-semibold text-primary-foreground"
            >
              <Plus size={16} aria-hidden="true" />
              List a property
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((p) => (
                <div key={p.id} className="space-y-3">
                  <PropertyCard property={p} />
                  <div className="flex gap-2">
                    <Link
                      href={`/edit-property/${p.id}`}
                      className="flex-1 rounded-full border border-border px-4 py-2 text-center text-eyebrow text-charcoal transition hover:border-primary hover:text-primary"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/properties/${p.id}`}
                      className="flex-1 rounded-full bg-charcoal px-4 py-2 text-center text-eyebrow text-background transition hover:bg-primary"
                    >
                      View public listing
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
              totalItems={mine.length}
              perPage={PER_PAGE}
            />
          </>
        )}
      </div>
    </div>
  );
}
