import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ListingForm } from "@/components/ListingForm";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/list-property")({
  head: () => ({ meta: [{ title: "List your property | Nestoria" }] }),
  component: ListProperty,
});

function ListProperty() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-950">List your property</h1>
      <p className="mt-2 text-slate-600">Complete the details below to publish your listing.</p>
      <div className="mt-8">
        {loading ? <p className="text-caption text-muted-foreground">Loading…</p> : user ? <ListingForm /> : null}
      </div>
    </div>
  );
}
