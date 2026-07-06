import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/AuthForm";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account | Nestoria Australia" }] }),
  component: () => (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold text-slate-950">Create your account</h1>
      <AuthForm mode="register" />
    </div>
  ),
});
