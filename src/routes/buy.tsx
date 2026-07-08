import { createFileRoute } from "@tanstack/react-router";
import { SearchResults, searchQuery, validateSearchParams } from "@/components/site/SearchResults";

export const Route = createFileRoute("/buy")({
  validateSearch: (raw) => validateSearchParams(raw as Record<string, unknown>),
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(searchQuery("sale", deps)),
  head: () => ({
    meta: [
      { title: "Properties for sale in Australia | Domicile" },
      { name: "description", content: "Browse homes for sale across Australia. Filter by suburb, price, beds, and more on Domicile." },
      { property: "og:title", content: "Properties for sale in Australia | Domicile" },
      { property: "og:description", content: "Browse homes for sale across Australia. Filter by suburb, price, beds, and more on Domicile." },
    ],
  }),
  component: BuyPage,
  errorComponent: ({ error }) => <div className="p-8 text-destructive">Error: {error.message}</div>,
  notFoundComponent: () => <div className="p-8">Not found</div>,
});

function BuyPage() {
  const search = Route.useSearch();
  return (
    <SearchResults
      listingType="sale"
      search={search}
      title="Homes for sale"
      intro="Browse Australian properties currently on the market."
    />
  );
}
