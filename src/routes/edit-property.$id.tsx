import { createFileRoute, notFound } from "@tanstack/react-router";
import { ListingForm } from "@/components/ListingForm";
import { getPropertyById } from "@/data/marketplace";

export const Route = createFileRoute("/edit-property/$id")({
  head: () => ({ meta: [{ title: "Edit listing | Nestoria" }] }),
  loader: ({ params }) => {
    const property = getPropertyById(params.id);
    if (!property) throw notFound();
    return { property };
  },
  component: EditPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-slate-950">Listing not found</h1>
    </div>
  ),
});

function EditPage() {
  const { property } = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-950">Edit listing</h1>
      <p className="mt-2 text-slate-600">Editing: {property.title}</p>
      <div className="mt-8">
        <ListingForm />
      </div>
    </div>
  );
}
