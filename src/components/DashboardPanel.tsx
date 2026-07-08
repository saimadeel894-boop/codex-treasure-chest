

import { BarChart3, Heart, Home, MessageSquare, Settings, User, CheckCircle2, Edit2, ExternalLink, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { Link } from "@/components/compat/Link";
import { PropertyCard } from "@/components/PropertyCard";
import { properties } from "@/data/marketplace";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "profile", label: "Profile", icon: User },
  { id: "saved", label: "Saved properties", icon: Heart },
  { id: "listings", label: "My listings", icon: Home },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
];

type DashboardPanelProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export function DashboardPanel({ activeTab, setActiveTab }: DashboardPanelProps) {

  // Form states
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    phone: "0400 000 000",
    role: "Buyer account",
  });

  const [settingsData, setSettingsData] = useState({
    emailAlerts: true,
    reminders: true,
    enquiries: true,
    reports: true,
  });

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 4000);
    } else {
      form.reportValidity();
    }
  };

  const handleSettingsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 4000);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex gap-2 overflow-x-auto border-b border-slate-100 p-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex h-11 shrink-0 items-center gap-2 rounded-md px-4 text-sm font-bold transition ${
                activeTab === tab.id
                  ? "bg-emerald-700 text-white"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              <Icon size={17} aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="p-5 sm:p-6">
        {activeTab === "overview" ? (
          <div className="space-y-6">
            <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-6">
              <h2 className="text-xl font-bold text-slate-950">Welcome back, Alex!</h2>
              <p className="mt-2 text-sm text-slate-700 leading-6">
                Here&apos;s what is happening with your property search and listings today. You have new inquiries on your listings, and some new properties match your saved search criteria.
              </p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="border border-slate-200 rounded-lg p-5">
                <h3 className="font-bold text-slate-950 flex items-center gap-2">
                  <Heart size={16} className="text-rose-500" />
                  Recent Saved Properties
                </h3>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <p>Mosman Family Retreat - $4,250,000</p>
                  <p>South Yarra Townhouse - $1,725,000</p>
                </div>
                <button type="button" onClick={() => setActiveTab("saved")} className="mt-4 text-xs font-bold text-emerald-800 hover:underline cursor-pointer">
                  View all saved properties
                </button>
              </div>

              <div className="border border-slate-200 rounded-lg p-5">
                <h3 className="font-bold text-slate-950 flex items-center gap-2">
                  <MessageSquare size={16} className="text-emerald-700" />
                  Recent Messages
                </h3>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <p>Inspection request for Mosman - 1 day ago</p>
                  <p>Rental enquiry in Noosa - 2 days ago</p>
                </div>
                <button type="button" onClick={() => setActiveTab("messages")} className="mt-4 text-xs font-bold text-emerald-800 hover:underline cursor-pointer">
                  View all messages
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === "profile" ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Profile</h2>
              <p className="mt-2 text-slate-600">
                Manage your public details before backend account storage is connected.
              </p>

              <form className="mt-6 space-y-4" onSubmit={handleProfileSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Full name
                    <input
                      required
                      name="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    />
                  </label>
                  <label className="text-sm font-semibold text-slate-700">
                    Email address
                    <input
                      required
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    />
                  </label>
                  <label className="text-sm font-semibold text-slate-700">
                    Phone number
                    <input
                      required
                      name="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    />
                  </label>
                  <label className="text-sm font-semibold text-slate-700">
                    Role / Account Type
                    <select
                      name="role"
                      value={profileData.role}
                      onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                      className="mt-2 h-12 w-full rounded-md border border-slate-200 bg-white px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    >
                      <option>Buyer account</option>
                      <option>Seller account</option>
                      <option>Real estate agent</option>
                      <option>Property developer</option>
                    </select>
                  </label>
                </div>

                {profileSuccess ? (
                  <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                    Profile details updated successfully! (Frontend simulation complete)
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="h-11 rounded-md bg-emerald-700 px-5 text-sm font-bold text-white transition hover:bg-emerald-800 shadow-sm"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
            <div className="rounded-lg bg-slate-50 p-5 self-start">
              <p className="flex items-center gap-2 text-sm font-bold text-slate-950">
                <BarChart3 size={17} aria-hidden="true" />
                Account snapshot
              </p>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p>3 saved properties</p>
                <p>2 active enquiries</p>
                <p>2 active listings</p>
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === "saved" ? (
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Saved properties</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {properties.slice(0, 2).map((property) => (
                <PropertyCard key={property.id} property={property} compact />
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === "listings" ? (
          <div>
            <h2 className="text-2xl font-bold text-slate-950">My listings</h2>
            <p className="mt-2 text-sm text-slate-600">
              Manage your property ads. Click Edit to update listings or View to open the public details page.
            </p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {properties.slice(2, 4).map((property) => (
                <div key={property.id} className="flex flex-col border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                  <div className="flex-1">
                    <PropertyCard property={property} compact />
                  </div>
                  <div className="border-t border-slate-100 p-3 bg-slate-50 flex gap-2">
                    <Link
                      href={`/edit-property/${property.id}`}
                      className="flex-1 flex h-10 items-center justify-center gap-1.5 rounded-md bg-slate-950 text-xs font-bold text-white transition hover:bg-emerald-800"
                    >
                      <Edit2 size={13} aria-hidden="true" />
                      Edit Listing
                    </Link>
                    <Link
                      href={`/properties/${property.id}`}
                      className="px-4 flex h-10 items-center justify-center gap-1.5 rounded-md border border-slate-200 text-xs font-bold text-slate-700 bg-white transition hover:bg-slate-50"
                    >
                      <ExternalLink size={13} aria-hidden="true" />
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === "messages" ? (
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Messages</h2>
            <div className="mt-6 space-y-3">
              {["Inspection request for Mosman", "Rental enquiry in Noosa", "Agent follow-up"].map(
                (message, index) => (
                  <div key={message} className="rounded-lg border border-slate-200 p-4">
                    <p className="font-bold text-slate-950">{message}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {index + 1} day{index === 0 ? "" : "s"} ago
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        ) : null}

        {activeTab === "settings" ? (
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Settings</h2>
            <p className="mt-2 text-slate-600">
              Configure your notifications and listing visibility updates.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSettingsSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4 text-sm font-semibold text-slate-700 cursor-pointer hover:border-slate-300">
                  Email property alerts
                  <input
                    type="checkbox"
                    checked={settingsData.emailAlerts}
                    onChange={(e) => setSettingsData({ ...settingsData, emailAlerts: e.target.checked })}
                    className="size-5 accent-emerald-700"
                  />
                </label>
                <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4 text-sm font-semibold text-slate-700 cursor-pointer hover:border-slate-300">
                  Inspection reminders
                  <input
                    type="checkbox"
                    checked={settingsData.reminders}
                    onChange={(e) => setSettingsData({ ...settingsData, reminders: e.target.checked })}
                    className="size-5 accent-emerald-700"
                  />
                </label>
                <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4 text-sm font-semibold text-slate-700 cursor-pointer hover:border-slate-300">
                  Agent enquiry updates
                  <input
                    type="checkbox"
                    checked={settingsData.enquiries}
                    onChange={(e) => setSettingsData({ ...settingsData, enquiries: e.target.checked })}
                    className="size-5 accent-emerald-700"
                  />
                </label>
                <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4 text-sm font-semibold text-slate-700 cursor-pointer hover:border-slate-300">
                  Market report emails
                  <input
                    type="checkbox"
                    checked={settingsData.reports}
                    onChange={(e) => setSettingsData({ ...settingsData, reports: e.target.checked })}
                    className="size-5 accent-emerald-700"
                  />
                </label>
              </div>

              {settingsSuccess ? (
                <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                  Settings saved successfully! (Frontend simulation complete)
                </div>
              ) : null}

              <button
                type="submit"
                className="h-11 rounded-md bg-emerald-700 px-5 text-sm font-bold text-white transition hover:bg-emerald-800 shadow-sm"
              >
                Save Settings
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
}
