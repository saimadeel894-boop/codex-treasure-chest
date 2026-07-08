import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { PropertyCard } from "@/components/site/PropertyCard";
import { listFavouriteProperties } from "@/lib/favourites.functions";
import { Heart } from "lucide-react";

const favouritesQuery = queryOptions({
  queryKey: ["favourites"],
  queryFn: () => listFavouriteProperties(),
});

export const Route = createFileRoute("/_authenticated/favourites")({
  head: () => ({
    meta: [
      { title: "Saved properties | Domicile" },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(favouritesQuery),
  component: FavouritesPage,
  errorComponent: ({ error }) => <div className="p-8 text-destructive">Error: {error.message}</div>,
  notFoundComponent: () => <div className="p-8">Not found</div>,
});

function FavouritesPage() {
  const { data: props } = useSuspenseQuery(favouritesQuery);
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3">
        <Heart className="text-primary" size={22} />
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink">Saved properties</h1>
      </div>
      <p className="mt-2 text-muted-foreground">Homes you've bookmarked to revisit.</p>

      {props.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <h3 className="font-display text-2xl text-ink">No saved properties yet</h3>
          <p className="mt-2 text-muted-foreground">Tap the heart on any listing to save it here.</p>
          <Link to="/buy" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            Browse properties
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {props.map((p: any) => <PropertyCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}
