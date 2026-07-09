import { Link, useRouterState } from "@tanstack/react-router";
import { Home } from "lucide-react";

export function BackToHome() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === "/") return null;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-eyebrow text-charcoal shadow-soft transition hover:border-primary hover:text-primary"
      >
        <Home size={14} aria-hidden="true" />
        Back to home
      </Link>
    </div>
  );
}
