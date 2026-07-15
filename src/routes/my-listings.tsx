import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@/components/compat/Link";
import { Pagination } from "@/components/Pagination";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyCardSkeletonGrid } from "@/components/PropertyCardSkeleton";
import { useAuth } from "@/hooks/use-auth";
import { fetchMyProperties, softDeleteProperty } from "@/lib/property-service";

const PER_PAGE = 6;

export const Route = createFileRoute("/my-listings")({
  head: () => ({
    meta: [
      { title: "My listings | Real Estate Marketplace Australia" },
      { name: "description", content: "Manage the properties you have listed on Real Estate Marketplace Australia." },
    ],
  }),
  component: MyListingsPage,
});

function MyListingsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [authLoading, user, navigate]);

  const { data: mine = [], isLoading } = useQuery({
    queryKey: ["my-listings", user?.id],
    queryFn: () => (user ? fetchMyProperties(user.id) : Promise.resolve([])),
    enabled: !!user,
  });

  const del = useMutation({
    mutationFn: (id: string) => softDeleteProperty(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-listings", user?.id] }),
  });

  const ready = !authLoading && !isLoading;
  const totalPages = Math.max(1, Math.ceil(mine.length / PER_PAGE));
  const pageItems = mine.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-eyebrow text-primary">Your portfolio</p>
          <h1 className="mt-2 font-serif text-h2 text-charcoal">My listings</h1>
          <p className="mt-2 text-caption text-muted-foreground">
            {ready ? `${mine.length} active listing${mine.length === 1 ? "" : "s"} across your account.` : "Loading your listings…"}
          </p>
        </div>
        <Link href="/list-property"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-caption font-semibold text-primary-foreground shadow-soft transition hover:bg-primary/90">
          <Plus size={16} aria-hidden="true" />
          Add new listing
        </Link>
      </header>

      <div className="mt-8">
        {!ready ? (
          <PropertyCardSkeletonGrid count={3} />
        ) : mine.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border/70 bg-surface p-8 text-center sm:p-12 md:p-16">
            <p className="text-eyebrow text-primary">Empty portfolio</p>
            <h2 className="mt-2 font-serif text-h3 text-charcoal">No listings yet</h2>
            <p className="mx-auto mt-3 max-w-md text-caption text-muted-foreground">
              Start showcasing your property to thousands of buyers and renters across Australia.
            </p>
            <Link href="/list-property"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-caption font-semibold text-primary-foreground">
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
                    <Link href={`/edit-property/${p.id}`}
                      className="flex-1 rounded-full border border-border px-4 py-2 text-center text-eyebrow text-charcoal transition hover:border-primary hover:text-primary">
                      Edit
                    </Link>
                    <Link href={`/properties/${p.id}`}
                      className="flex-1 rounded-full bg-charcoal px-4 py-2 text-center text-eyebrow text-background transition hover:bg-primary">
                      View
                    </Link>
                    <button
                      type="button"
                      disabled={del.isPending}
                      onClick={() => {
                        if (confirm(`Delete "${p.title}"? This can't be undone.`)) del.mutate(p.id);
                      }}
                      className="flex items-center justify-center rounded-full border border-border px-3 py-2 text-charcoal-soft transition hover:border-rose-400 hover:text-rose-600 disabled:opacity-60"
                      aria-label={`Delete ${p.title}`}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={mine.length} perPage={PER_PAGE} />
          </>
        )}
      </div>
    </div>
  );
}
