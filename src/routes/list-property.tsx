import { createFileRoute } from "@tanstack/react-router";
import { ListingForm } from "@/components/ListingForm";

export const Route = createFileRoute("/list-property")({
  head: () => ({ meta: [{ title: "List your property | Nestoria" }] }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-950">List your property</h1>
      <p className="mt-2 text-slate-600">Complete the details below to publish your listing.</p>
      <div className="mt-8">
        <ListingForm />
      </div>
    </div>
  ),
});
