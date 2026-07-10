import { BarChart3, Bell, CheckCircle2, Edit2, ExternalLink, Heart, Home, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@/components/compat/Link";
import { PropertyCard } from "@/components/PropertyCard";
import { useAuth } from "@/hooks/use-auth";
import { fetchMyProperties, fetchSavedProperties } from "@/lib/property-service";
import {
  fetchInquiriesForOwner,
  fetchMyInquiries,
  fetchNotifications,
  fetchProfile,
  markAllNotificationsRead,
  markNotificationRead,
  updateProfile,
} from "@/lib/dashboard-service";

type DashboardPanelProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function DashboardPanel({ activeTab, setActiveTab }: DashboardPanelProps) {
  const { user } = useAuth();
  const userId = user?.id;
  const qc = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfile(userId!),
    enabled: !!userId,
  });
  const { data: saved = [] } = useQuery({
    queryKey: ["saved-props", userId],
    queryFn: () => fetchSavedProperties(userId!),
    enabled: !!userId,
  });
  const { data: listings = [] } = useQuery({
    queryKey: ["my-props", userId],
    queryFn: () => fetchMyProperties(userId!),
    enabled: !!userId,
  });
  const { data: inbox = [] } = useQuery({
    queryKey: ["inquiries-owner", userId],
    queryFn: () => fetchInquiriesForOwner(userId!),
    enabled: !!userId,
  });
  const { data: sent = [] } = useQuery({
    queryKey: ["inquiries-mine", userId],
    queryFn: () => fetchMyInquiries(userId!),
    enabled: !!userId,
  });
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => fetchNotifications(userId!),
    enabled: !!userId,
  });

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName);
      setPhone(profile.phone);
    }
  }, [profile]);

  const updateProfileMut = useMutation({
    mutationFn: () => updateProfile(userId!, { full_name: fullName, phone }),
    onSuccess: () => {
      setProfileSuccess(true);
      qc.invalidateQueries({ queryKey: ["profile", userId] });
      setTimeout(() => setProfileSuccess(false), 3000);
    },
  });

  const markRead = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications", userId] }),
  });
  const markAll = useMutation({
    mutationFn: () => markAllNotificationsRead(userId!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications", userId] }),
  });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const messages = [...inbox, ...sent];

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="p-5 sm:p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-6">
              <h2 className="text-xl font-bold text-slate-950">
                Welcome back{profile?.fullName ? `, ${profile.fullName.split(" ")[0]}` : ""}!
              </h2>
              <p className="mt-2 text-sm text-slate-700 leading-6">
                You have {saved.length} saved {saved.length === 1 ? "property" : "properties"},{" "}
                {listings.length} active {listings.length === 1 ? "listing" : "listings"}, and{" "}
                {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <StatCard icon={Heart} label="Saved" value={saved.length} onClick={() => setActiveTab("saved")} color="rose" />
              <StatCard icon={Home} label="Listings" value={listings.length} onClick={() => setActiveTab("listings")} color="emerald" />
              <StatCard icon={MessageSquare} label="Enquiries" value={inbox.length} onClick={() => setActiveTab("messages")} color="amber" />
            </div>

            {notifications.length > 0 && (
              <div className="border border-slate-200 rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-950 flex items-center gap-2">
                    <Bell size={16} className="text-emerald-700" /> Recent activity
                  </h3>
                  <button onClick={() => setActiveTab("notifications")} className="text-xs font-bold text-emerald-800 hover:underline">
                    See all
                  </button>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {notifications.slice(0, 3).map((n) => (
                    <li key={n.id} className="flex justify-between gap-3">
                      <span className={n.read ? "text-slate-500" : "font-semibold text-slate-800"}>{n.title}</span>
                      <span className="shrink-0 text-xs text-slate-400">{timeAgo(n.createdAt)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Profile</h2>
              <p className="mt-2 text-slate-600">Manage your public details.</p>
              <form
                className="mt-6 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  updateProfileMut.mutate();
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Full name
                    <input
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    />
                  </label>
                  <label className="text-sm font-semibold text-slate-700">
                    Email address
                    <input
                      value={user?.email ?? ""}
                      disabled
                      className="mt-2 h-12 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-slate-500"
                    />
                  </label>
                  <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                    Phone number
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-2 h-12 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    />
                  </label>
                </div>

                {profileSuccess && (
                  <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                    Profile updated successfully.
                  </div>
                )}
                {updateProfileMut.isError && (
                  <p className="text-sm font-semibold text-rose-700">
                    Could not save changes. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={updateProfileMut.isPending}
                  className="h-11 rounded-md bg-emerald-700 px-5 text-sm font-bold text-white transition hover:bg-emerald-800 shadow-sm disabled:opacity-60"
                >
                  {updateProfileMut.isPending ? "Saving…" : "Save profile changes"}
                </button>
              </form>
            </div>
            <div className="rounded-lg bg-slate-50 p-5 self-start">
              <p className="flex items-center gap-2 text-sm font-bold text-slate-950">
                <BarChart3 size={17} aria-hidden="true" /> Account snapshot
              </p>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p>{saved.length} saved properties</p>
                <p>{inbox.length} enquiries received</p>
                <p>{listings.length} active listings</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "saved" && (
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Saved properties</h2>
            {saved.length === 0 ? (
              <p className="mt-4 text-slate-600">No saved properties yet. Tap the heart on any listing to save it.</p>
            ) : (
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {saved.map((property) => (
                  <PropertyCard key={property.id} property={property} compact />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "listings" && (
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-950">My listings</h2>
              <Link href="/list-property" className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800">
                + New listing
              </Link>
            </div>
            {listings.length === 0 ? (
              <p className="mt-4 text-slate-600">You have not published any listings yet.</p>
            ) : (
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {listings.map((property) => (
                  <div key={property.id} className="flex flex-col border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                    <div className="flex-1">
                      <PropertyCard property={property} compact />
                    </div>
                    <div className="border-t border-slate-100 p-3 bg-slate-50 flex gap-2">
                      <Link
                        href={`/edit-property/${property.id}`}
                        className="flex-1 flex h-10 items-center justify-center gap-1.5 rounded-md bg-slate-950 text-xs font-bold text-white transition hover:bg-emerald-800"
                      >
                        <Edit2 size={13} aria-hidden="true" /> Edit
                      </Link>
                      <Link
                        href={`/properties/${property.id}`}
                        className="px-4 flex h-10 items-center justify-center gap-1.5 rounded-md border border-slate-200 text-xs font-bold text-slate-700 bg-white transition hover:bg-slate-50"
                      >
                        <ExternalLink size={13} aria-hidden="true" /> View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "messages" && (
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Messages & enquiries</h2>
            {messages.length === 0 ? (
              <p className="mt-4 text-slate-600">No enquiries yet.</p>
            ) : (
              <div className="mt-6 space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-slate-950">{m.name} — {m.propertyTitle}</p>
                        <p className="text-xs text-slate-500">{m.email}{m.phone ? ` · ${m.phone}` : ""}</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-800">
                        {m.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-700">{m.message}</p>
                    <p className="mt-2 text-xs text-slate-400">{timeAgo(m.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "notifications" && (
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-950">Notifications</h2>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAll.mutate()}
                  className="text-sm font-bold text-emerald-800 hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>
            {notifications.length === 0 ? (
              <p className="mt-4 text-slate-600">You are all caught up.</p>
            ) : (
              <div className="mt-6 space-y-2">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => !n.read && markRead.mutate(n.id)}
                    className={`w-full rounded-lg border p-4 text-left transition ${
                      n.read ? "border-slate-200 bg-white" : "border-emerald-200 bg-emerald-50/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className={n.read ? "font-semibold text-slate-700" : "font-bold text-slate-950"}>
                          {n.title}
                        </p>
                        {n.body && <p className="mt-1 text-sm text-slate-600">{n.body}</p>}
                      </div>
                      <span className="shrink-0 text-xs text-slate-400">{timeAgo(n.createdAt)}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Settings</h2>
            <p className="mt-2 text-slate-600">Manage your account and email preferences.</p>
            <div className="mt-6 space-y-4">
              <Link href="/forgot-password" className="block rounded-lg border border-slate-200 p-4 hover:border-emerald-300 hover:bg-emerald-50">
                <p className="font-bold text-slate-950">Change password</p>
                <p className="mt-1 text-sm text-slate-600">Send yourself a password reset email.</p>
              </Link>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="font-bold text-slate-950">Email preferences</p>
                <p className="mt-1 text-sm text-slate-600">
                  Manage which property alerts and market updates you receive. Coming soon.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  onClick,
  color,
}: {
  icon: typeof Heart;
  label: string;
  value: number;
  onClick: () => void;
  color: "rose" | "emerald" | "amber";
}) {
  const styles = {
    rose: "text-rose-600 bg-rose-50",
    emerald: "text-emerald-700 bg-emerald-50",
    amber: "text-amber-700 bg-amber-50",
  }[color];
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-slate-200 bg-white p-5 text-left transition hover:border-emerald-300 hover:shadow-sm"
    >
      <div className={`inline-flex size-9 items-center justify-center rounded-md ${styles}`}>
        <Icon size={18} />
      </div>
      <p className="mt-3 text-3xl font-bold text-slate-950">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </button>
  );
}
