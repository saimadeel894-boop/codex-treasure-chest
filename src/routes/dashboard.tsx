import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardPanel } from "@/components/DashboardPanel";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard | Nestoria Australia" }] }),
  component: Dashboard,
});

function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <div className="mx-auto max-w-3xl px-4 py-24 text-center text-slate-500">Loading your dashboard…</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <DashboardPanel activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
