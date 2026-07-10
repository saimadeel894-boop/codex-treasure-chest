import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  fullName: string;
  phone: string;
  avatarUrl: string | null;
};

export type Inquiry = {
  id: string;
  propertyId: string;
  propertyTitle: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  createdAt: string;
};

export type Notification = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  createdAt: string;
};

export async function fetchProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  return {
    id: userId,
    fullName: data?.full_name ?? "",
    phone: data?.phone ?? "",
    avatarUrl: data?.avatar_url ?? null,
  };
}

export async function updateProfile(userId: string, patch: { full_name?: string; phone?: string }) {
  const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
  if (error) throw error;
}

export async function fetchInquiriesForOwner(userId: string): Promise<Inquiry[]> {
  const { data, error } = await supabase
    .from("property_inquiries")
    .select("id, property_id, name, email, phone, message, status, created_at, properties!inner(title, owner_id)")
    .eq("properties.owner_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    id: r.id,
    propertyId: r.property_id,
    propertyTitle: r.properties?.title ?? "Listing",
    name: r.name,
    email: r.email,
    phone: r.phone,
    message: r.message,
    status: r.status,
    createdAt: r.created_at,
  }));
}

export async function fetchMyInquiries(userId: string): Promise<Inquiry[]> {
  const { data, error } = await supabase
    .from("property_inquiries")
    .select("id, property_id, name, email, phone, message, status, created_at, properties(title)")
    .eq("from_user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    id: r.id,
    propertyId: r.property_id,
    propertyTitle: r.properties?.title ?? "Listing",
    name: r.name,
    email: r.email,
    phone: r.phone,
    message: r.message,
    status: r.status,
    createdAt: r.created_at,
  }));
}

export async function fetchNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    id: r.id,
    type: r.type,
    title: r.title,
    body: r.body,
    link: r.link,
    read: r.read,
    createdAt: r.created_at,
  }));
}

export async function markNotificationRead(id: string) {
  await supabase.from("notifications").update({ read: true }).eq("id", id);
}

export async function markAllNotificationsRead(userId: string) {
  await supabase.from("notifications").update({ read: true }).eq("user_id", userId).eq("read", false);
}
