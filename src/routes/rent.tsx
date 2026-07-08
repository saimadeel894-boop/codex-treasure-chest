import { createFileRoute } from "@tanstack/react-router";
import { SearchResults, searchQuery, validateSearchParams } from "@/components/site/SearchResults";

export const Route = createFileRoute("/rent")({
  validateSearch: (raw) => validateSearchParams(raw as Record<string, unknown>),
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(searchQuery("rent", deps)),
  head: () => ({
    meta: [
      { title: "Rental properties in Australia | Domicile" },
      { name: "description", content: "Find your next Australian rental. Filter by suburb, price, beds and more on Domicile." },
      { property: "og:title", content: "Rental properties in Australia | Domicile" },
      { property: "og:description", content: "Find your next Australian rental. Filter by suburb, price, beds and more on Domicile." },
    ],
  }),
  component: RentPage,
  errorComponent: ({ error }) => <div className="p-8 text-destructive">Error: {error.message}</div>,
  notFoundComponent: () => <div className="p-8">Not found</div>,
});

function RentPage() {
  const search = Route.useSearch();
  return (
    <SearchResults
      listingType="rent"
      search={search}
      title="Homes for rent"
      intro="Discover long-term rental homes across Australia."
    />
  );
}
