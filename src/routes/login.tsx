import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/AuthForm";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login | Nestoria Australia" }] }),
  component: () => (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold text-slate-950">Welcome back</h1>
      <AuthForm mode="login" />
    </div>
  ),
});
