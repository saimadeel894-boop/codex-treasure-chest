import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@/components/compat/Link";
import { useState } from "react";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password | Nestoria" }] }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setError("");
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold text-slate-950">Reset your password</h1>
      <p className="mb-6 text-slate-600">Enter your email and we'll send a reset link.</p>
      {sent ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
          If an account exists for <strong>{email}</strong>, a reset link is on its way.
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              required
            />
          </label>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button className="h-11 w-full rounded-md bg-slate-950 font-bold text-white hover:bg-emerald-800">
            Send reset link
          </button>
        </form>
      )}
      <p className="mt-4 text-sm text-slate-600">
        Remembered it?{" "}
        <Link href="/login" className="font-bold text-emerald-800 hover:text-emerald-900">Back to login</Link>
      </p>
    </div>
  );
}
