import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Link } from "@/components/compat/Link";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Set new password | Nestoria" }, { name: "robots", content: "noindex" }] }),
  component: ResetPassword,
});

function ResetPassword() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase places recovery tokens in the URL hash; the client picks them up automatically.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError("");
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setDone(true);
    setTimeout(() => navigate({ to: "/dashboard" }), 1500);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold text-slate-950">Set a new password</h1>
      <p className="mb-6 text-slate-600">Choose a strong password to secure your Nestoria account.</p>
      {done ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
          Password updated. Redirecting to your dashboard…
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700">
            New password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6}
              className="mt-2 h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              required />
          </label>
          {!ready && <p className="text-xs text-slate-500">Verifying reset link…</p>}
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button disabled={loading || !ready} className="h-11 w-full rounded-md bg-slate-950 font-bold text-white hover:bg-emerald-800 disabled:opacity-60">
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      )}
      <p className="mt-4 text-sm text-slate-600">
        <Link href="/login" className="font-bold text-emerald-800 hover:text-emerald-900">Back to login</Link>
      </p>
    </div>
  );
}
