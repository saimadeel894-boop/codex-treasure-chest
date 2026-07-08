

import { CheckCircle2, Lock, Mail, Phone, User, UserPlus } from "lucide-react";
import { Link } from "@/components/compat/Link";
import { useState } from "react";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const isRegister = mode === "register";

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        setSubmitted(form.checkValidity());
        form.reportValidity();
      }}
    >
      {isRegister ? (
        <label className="block text-sm font-semibold text-slate-700">
          Full name
          <span className="relative mt-2 block">
            <User
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
              aria-hidden="true"
            />
            <input
              required
              name="name"
              minLength={2}
              placeholder="Alex Johnson"
              className="h-12 w-full rounded-md border border-slate-200 pl-10 pr-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </span>
        </label>
      ) : null}

      <label className="block text-sm font-semibold text-slate-700">
        Email address
        <span className="relative mt-2 block">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
            aria-hidden="true"
          />
          <input
            required
            type="email"
            name="email"
            placeholder="alex@example.com"
            className="h-12 w-full rounded-md border border-slate-200 pl-10 pr-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </span>
      </label>

      {isRegister ? (
        <label className="block text-sm font-semibold text-slate-700">
          Phone number
          <span className="relative mt-2 block">
            <Phone
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
              aria-hidden="true"
            />
            <input
              required
              name="phone"
              minLength={8}
              placeholder="0400 000 000"
              className="h-12 w-full rounded-md border border-slate-200 pl-10 pr-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </span>
        </label>
      ) : null}

      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700" htmlFor="auth-password">
          Password
        </label>
        {!isRegister && (
          <Link
            href="/forgot-password"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900"
          >
            Forgot password?
          </Link>
        )}
      </div>
      <span className="relative mt-2 block">
        <Lock
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
          aria-hidden="true"
        />
        <input
          required
          id="auth-password"
          type="password"
          name="password"
          minLength={6}
          placeholder="Minimum 6 characters"
          className="h-12 w-full rounded-md border border-slate-200 pl-10 pr-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </span>

      {isRegister ? (
        <label className="block text-sm font-semibold text-slate-700">
          Account type
          <select
            name="accountType"
            className="mt-2 h-12 w-full rounded-md border border-slate-200 bg-white px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          >
            <option>Buyer</option>
            <option>Seller</option>
            <option>Real estate agent</option>
            <option>Property developer</option>
          </select>
        </label>
      ) : null}

      {submitted ? (
        <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          Frontend validation passed. Backend authentication can be connected later.
        </div>
      ) : null}

      <button
        type="submit"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-emerald-700 text-sm font-bold text-white transition hover:bg-emerald-800"
      >
        {isRegister ? <UserPlus size={18} aria-hidden="true" /> : <Lock size={18} aria-hidden="true" />}
        {isRegister ? "Create account" : "Login"}
      </button>

      <p className="text-center text-sm text-slate-600">
        {isRegister ? "Already have an account?" : "New to Nestoria?"}{" "}
        <Link
          href={isRegister ? "/login" : "/register"}
          className="font-bold text-emerald-800 hover:text-emerald-900"
        >
          {isRegister ? "Login" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
