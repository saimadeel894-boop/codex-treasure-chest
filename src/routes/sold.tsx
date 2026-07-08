import { createFileRoute } from "@tanstack/react-router";
import { SearchResults, searchQuery, validateSearchParams } from "@/components/site/SearchResults";

export const Route = createFileRoute("/sold")({
  validateSearch: (raw) => validateSearchParams(raw as Record<string, unknown>),
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(searchQuery("sold", deps)),
  head: () => ({
    meta: [
      { title: "Recently sold properties in Australia | Domicile" },
      { name: "description", content: "Track the Australian sold market. Explore recently sold homes and prices on Domicile." },
      { property: "og:title", content: "Recently sold properties in Australia | Domicile" },
      { property: "og:description", content: "Track the Australian sold market. Explore recently sold homes and prices on Domicile." },
    ],
  }),
  component: SoldPage,
  errorComponent: ({ error }) => <div className="p-8 text-destructive">Error: {error.message}</div>,
  notFoundComponent: () => <div className="p-8">Not found</div>,
});

function SoldPage() {
  const search = Route.useSearch();
  return (
    <SearchResults
      listingType="sold"
      search={search}
      title="Recently sold"
      intro="See what's changed hands across Australia."
    />
  );
}
