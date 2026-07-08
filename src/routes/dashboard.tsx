import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardPanel } from "@/components/DashboardPanel";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard | Nestoria Australia" }] }),
  component: Dashboard,
});

function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <DashboardPanel activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
