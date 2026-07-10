import { Bell, Heart, Home, LayoutDashboard, MessageSquare, Settings, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const dashboardLinks = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "profile", label: "Profile", icon: User },
  { id: "saved", label: "Saved properties", icon: Heart },
  { id: "listings", label: "My listings", icon: Home },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

type DashboardSidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

function initials(name?: string | null, email?: string | null) {
  const base = (name && name.trim()) || email || "?";
  return base.split(/\s+|@/).map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

export function DashboardSidebar({ activeTab, setActiveTab }: DashboardSidebarProps) {
  const { user, roles } = useAuth();
  const displayName = (user?.user_metadata as any)?.full_name || user?.email?.split("@")[0] || "Your account";
  const roleLabel = roles.length ? `${roles[0].charAt(0).toUpperCase()}${roles[0].slice(1)} account` : "Signed in";

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm lg:sticky lg:top-28">
      <div className="flex items-center gap-3 border-b border-slate-100 p-3">
        <div className="flex size-11 items-center justify-center rounded-md bg-emerald-100 font-bold text-emerald-800">
          {initials(displayName, user?.email)}
        </div>
        <div className="min-w-0">
          <p className="truncate font-bold text-slate-950">{displayName}</p>
          <p className="text-sm text-slate-500">{roleLabel}</p>
        </div>
      </div>

      <nav className="mt-3 space-y-1">
        {dashboardLinks.map((link) => {
          const Icon = link.icon;
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              type="button"
              onClick={() => setActiveTab(link.id)}
              className={`w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition cursor-pointer ${
                isActive
                  ? "bg-emerald-700 text-white"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              <Icon size={18} aria-hidden="true" />
              {link.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="flex items-center gap-2 text-sm font-bold text-amber-900">
          <Bell size={16} aria-hidden="true" />
          Subscription
        </p>
        <p className="mt-2 text-sm leading-6 text-amber-800">
          Upgrade later for seller analytics, featured listings, and priority enquiries.
        </p>
      </div>
    </aside>
  );
}
