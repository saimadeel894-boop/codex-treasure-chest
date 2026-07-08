import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password | Domicile" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash.includes("type=recovery")) setRecoveryMode(true);
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setRecoveryMode(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function request(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("Check your email for the reset link.");
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function updatePassword(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated");
      navigate({ to: "/", replace: true });
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-3xl bg-card border border-border shadow-sm p-8">
        <h1 className="font-display text-3xl font-semibold text-ink text-center">
          {recoveryMode ? "Set new password" : "Reset password"}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {recoveryMode ? "Choose a new password below." : "We'll email you a link to reset it."}
        </p>

        {recoveryMode ? (
          <form onSubmit={updatePassword} className="mt-6 space-y-3">
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink"
            />
            <button
              disabled={busy}
              className="w-full rounded-full bg-primary text-primary-foreground px-4 py-3 text-sm font-semibold disabled:opacity-50"
            >
              Update password
            </button>
          </form>
        ) : (
          <form onSubmit={request} className="mt-6 space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink"
            />
            <button
              disabled={busy}
              className="w-full rounded-full bg-primary text-primary-foreground px-4 py-3 text-sm font-semibold disabled:opacity-50"
            >
              Send reset link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
