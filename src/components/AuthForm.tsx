import { AlertCircle, CheckCircle2, Loader2, Lock, Mail, Phone, User, UserPlus } from "lucide-react";
import { Link } from "@/components/compat/Link";
import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

type AuthFormProps = {
  mode: "login" | "register";
};

const ACCOUNT_TYPE_TO_ROLE: Record<string, "buyer" | "seller" | "agent" | "developer"> = {
  Buyer: "buyer",
  Seller: "seller",
  "Real estate agent": "agent",
  "Property developer": "developer",
};

export function AuthForm({ mode }: AuthFormProps) {
  const isRegister = mode === "register";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    setLoading(true);
    try {
      if (isRegister) {
        const name = String(fd.get("name") || "").trim();
        const phone = String(fd.get("phone") || "").trim();
        const accountType = String(fd.get("accountType") || "Buyer");
        const desiredRole = ACCOUNT_TYPE_TO_ROLE[accountType] ?? "buyer";
        const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/login` : undefined;
        const { data, error: signErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectTo,
            data: { full_name: name, phone, account_type: accountType },
          },
        });
        if (signErr) throw signErr;
        // If session exists (auto-confirm on), assign non-buyer role
        if (data.session && desiredRole !== "buyer") {
          await supabase.from("user_roles").insert({ user_id: data.user!.id, role: desiredRole });
        }
        if (!data.session) {
          setNotice("Check your email to confirm your account, then sign in.");
        } else {
          navigate({ to: "/dashboard" });
        }
      } else {
        const { error: signErr } = await supabase.auth.signInWithPassword({ email, password });
        if (signErr) throw signErr;
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {isRegister ? (
        <label className="block text-caption font-semibold text-charcoal">
          Full name
          <span className="relative mt-2 block">
            <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
            <input required name="name" minLength={2} placeholder="Alex Johnson"
              className="h-12 w-full rounded-md border border-slate-200 pl-10 pr-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
          </span>
        </label>
      ) : null}

      <label className="block text-caption font-semibold text-charcoal">
        Email address
        <span className="relative mt-2 block">
          <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
          <input required type="email" name="email" placeholder="alex@example.com"
            className="h-12 w-full rounded-md border border-slate-200 pl-10 pr-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
        </span>
      </label>

      {isRegister ? (
        <label className="block text-caption font-semibold text-charcoal">
          Phone number
          <span className="relative mt-2 block">
            <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
            <input required name="phone" minLength={8} placeholder="0400 000 000"
              className="h-12 w-full rounded-md border border-slate-200 pl-10 pr-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
          </span>
        </label>
      ) : null}

      <div className="flex items-center justify-between">
        <label className="text-caption font-semibold text-charcoal" htmlFor="auth-password">Password</label>
        {!isRegister && (
          <Link href="/forgot-password" className="text-xs font-bold text-emerald-800 hover:text-emerald-900">Forgot password?</Link>
        )}
      </div>
      <span className="relative mt-2 block">
        <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
        <input required id="auth-password" type="password" name="password" minLength={6} placeholder="Minimum 6 characters"
          className="h-12 w-full rounded-md border border-slate-200 pl-10 pr-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
      </span>

      {isRegister ? (
        <label className="block text-caption font-semibold text-charcoal">
          Account type
          <select name="accountType" defaultValue="Buyer"
            className="mt-2 h-12 w-full rounded-md border border-slate-200 bg-white px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100">
            <option>Buyer</option>
            <option>Seller</option>
            <option>Real estate agent</option>
            <option>Property developer</option>
          </select>
        </label>
      ) : null}

      {error ? (
        <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-800">
          <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </div>
      ) : null}
      {notice ? (
        <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          {notice}
        </div>
      ) : null}

      <button type="submit" disabled={loading}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-emerald-700 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60">
        {loading ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : isRegister ? <UserPlus size={18} aria-hidden="true" /> : <Lock size={18} aria-hidden="true" />}
        {loading ? "Please wait…" : isRegister ? "Create account" : "Login"}
      </button>

      <p className="text-center text-caption text-charcoal-soft">
        {isRegister ? "Already have an account?" : "New to Nestoria?"}{" "}
        <Link href={isRegister ? "/login" : "/register"} className="font-bold text-emerald-800 hover:text-emerald-900">
          {isRegister ? "Login" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
