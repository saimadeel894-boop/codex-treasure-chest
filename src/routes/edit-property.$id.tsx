import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { ListingForm } from "@/components/ListingForm";
import { useAuth } from "@/hooks/use-auth";
import { fetchPropertyById } from "@/lib/property-service";

export const Route = createFileRoute("/edit-property/$id")({
  head: () => ({ meta: [{ title: "Edit listing | Nestoria" }] }),
  component: EditPage,
});

function EditPage() {
  const { id } = Route.useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ["property", id],
    queryFn: () => fetchPropertyById(id),
  });

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [authLoading, user, navigate]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-950">Edit listing</h1>
      {isLoading || authLoading ? (
        <p className="mt-4 text-caption text-muted-foreground">Loading listing…</p>
      ) : error || !data ? (
        <p className="mt-4 text-caption text-rose-600">Listing not found or you don't have access.</p>
      ) : (
        <>
          <p className="mt-2 text-slate-600">Editing: {data.title}</p>
          <div className="mt-8">
            <ListingForm existing={data} />
          </div>
        </>
      )}
    </div>
  );
}
