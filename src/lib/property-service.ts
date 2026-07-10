import { supabase } from "@/integrations/supabase/client";
import type { Property, ListingMode } from "@/data/marketplace";
import { agents as mockAgents, agencies as mockAgencies } from "@/data/marketplace";

// Fallback stock image lookup for seeded slug-style urls (prop-1..prop-7)
const STOCK: Record<string, string> = {
  "prop-1": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
  "prop-2": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  "prop-3": "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
  "prop-4": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80",
  "prop-5": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
  "prop-6": "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80",
  "prop-7": "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80",
};

function resolveImage(url: string | null | undefined): string {
  if (!url) return STOCK["prop-1"];
  if (/^https?:\/\//.test(url)) return url;
  if (STOCK[url]) return STOCK[url];
  return STOCK["prop-1"];
}

const propertyTypeLabel: Record<string, string> = {
  house: "House",
  apartment: "Apartment",
  townhouse: "Townhouse",
  land: "Land",
  new_development: "New development",
  villa: "House",
  studio: "Apartment",
};

function relativeTime(iso: string | null): string {
  if (!iso) return "Recently listed";
  const then = new Date(iso).getTime();
  const now = Date.now();
  const days = Math.floor((now - then) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Listed today";
  if (days === 1) return "Listed yesterday";
  if (days < 7) return `Listed ${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "Listed 1 week ago";
  if (weeks < 5) return `Listed ${weeks} weeks ago`;
  return `Listed ${Math.floor(days / 30)} months ago`;
}

function formatPrice(cents: number, listingType: string, rentPeriod: string | null): { price: number; label: string } {
  const price = Math.round(cents / 100);
  const formatted = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(price);
  if (listingType === "rent") {
    const period = rentPeriod === "month" ? "per month" : "per week";
    return { price, label: `${formatted} ${period}` };
  }
  return { price, label: formatted };
}

// Types for raw DB shape
export type PropertyRow = {
  id: string;
  title: string;
  description: string;
  listing_type: string;
  property_type: string;
  price_cents: number;
  rent_period: string | null;
  address_line: string;
  suburb: string;
  state: string;
  postcode: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  land_size_sqm: number | null;
  building_size_sqm: number | null;
  features: string[] | null;
  is_published: boolean;
  featured: boolean;
  published_at: string | null;
  owner_id: string | null;
  agent_id: string | null;
  agency_id: string | null;
  property_images?: { url: string; sort_order: number }[] | null;
};

export function mapProperty(row: PropertyRow): Property {
  const rawImages = (row.property_images ?? [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => resolveImage(i.url));
  const images = rawImages.length ? rawImages : [STOCK["prop-1"]];
  const { price, label } = formatPrice(row.price_cents, row.listing_type, row.rent_period);
  const mode: ListingMode = row.listing_type === "rent" ? "Rent" : "Buy";
  const landSize = row.land_size_sqm
    ? `${row.land_size_sqm} sqm`
    : row.building_size_sqm
    ? `${row.building_size_sqm} sqm`
    : "—";

  // Fallback agent/agency (frontend components need something)
  const agentId = row.agent_id ?? mockAgents[0].id;
  const agencyId = row.agency_id ?? mockAgencies[0].id;

  const tags: string[] = [];
  if (row.featured) tags.push("Featured");
  const daysSince = row.published_at ? Math.floor((Date.now() - new Date(row.published_at).getTime()) / 86_400_000) : 999;
  if (daysSince <= 2) tags.push("New");

  return {
    id: row.id,
    title: row.title,
    address: row.address_line,
    suburb: row.suburb,
    state: row.state,
    postcode: row.postcode,
    mode,
    propertyType: propertyTypeLabel[row.property_type] ?? row.property_type,
    price,
    priceLabel: label,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    parking: row.parking,
    landSize,
    description: row.description,
    images,
    features: row.features ?? [],
    inspectionTimes: [],
    agentId,
    agencyId,
    tags: tags.length ? tags : ["Listed"],
    listedAt: relativeTime(row.published_at),
  };
}

const SELECT = `
  id, title, description, listing_type, property_type, price_cents, rent_period,
  address_line, suburb, state, postcode, bedrooms, bathrooms, parking,
  land_size_sqm, building_size_sqm, features, is_published, featured,
  published_at, owner_id, agent_id, agency_id,
  property_images ( url, sort_order )
` as const;

export type PropertyFilters = {
  mode?: "buy" | "rent" | "";
  state?: string;
  suburb?: string;
  location?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
};

type DbPropertyType = "house" | "apartment" | "townhouse" | "land" | "rural";
type DbState = "ACT" | "NSW" | "NT" | "QLD" | "SA" | "TAS" | "VIC" | "WA";

const dbPropertyType: Record<string, DbPropertyType> = {
  House: "house",
  Apartment: "apartment",
  Townhouse: "townhouse",
  Land: "land",
  "New development": "house",
};

const VALID_STATES: DbState[] = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"];

export async function fetchPublishedProperties(filters: PropertyFilters = {}): Promise<Property[]> {
  let q = supabase
    .from("properties")
    .select(SELECT)
    .eq("is_published", true)
    .is("deleted_at", null)
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false });

  if (filters.mode) q = q.eq("listing_type", filters.mode === "rent" ? "rent" : "sale");
  if (filters.state && (VALID_STATES as string[]).includes(filters.state)) q = q.eq("state", filters.state as DbState);
  if (filters.type && dbPropertyType[filters.type]) q = q.eq("property_type", dbPropertyType[filters.type]);
  if (filters.bedrooms) q = q.gte("bedrooms", filters.bedrooms);
  if (filters.bathrooms) q = q.gte("bathrooms", filters.bathrooms);
  if (filters.parking) q = q.gte("parking", filters.parking);
  if (filters.minPrice) q = q.gte("price_cents", filters.minPrice * 100);
  if (filters.maxPrice) q = q.lte("price_cents", filters.maxPrice * 100);
  const searchTerm = filters.suburb || filters.location;
  if (searchTerm) {
    const t = searchTerm.trim();
    q = q.or(`suburb.ilike.%${t}%,postcode.ilike.%${t}%,address_line.ilike.%${t}%,title.ilike.%${t}%`);
  }

  const { data, error } = await q;
  if (error) throw error;
  return (data as PropertyRow[]).map(mapProperty);
}

export async function fetchPropertyById(id: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .select(SELECT)
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return mapProperty(data as PropertyRow);
}

export async function fetchMyProperties(userId: string): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select(SELECT)
    .eq("owner_id", userId)
    .is("deleted_at", null)
    .order("published_at", { ascending: false, nullsFirst: false });
  if (error) throw error;
  return (data as PropertyRow[]).map(mapProperty);
}

export async function fetchSavedProperties(userId: string): Promise<Property[]> {
  const { data: favs, error: favErr } = await supabase
    .from("favourites")
    .select("property_id")
    .eq("user_id", userId);
  if (favErr) throw favErr;
  const ids = (favs ?? []).map((f) => f.property_id);
  if (ids.length === 0) return [];
  const { data, error } = await supabase.from("properties").select(SELECT).in("id", ids).is("deleted_at", null);
  if (error) throw error;
  return (data as PropertyRow[]).map(mapProperty);
}

// ---------- Writes ----------

export type PropertyInput = {
  title: string;
  description: string;
  listing_type: "sale" | "rent";
  property_type: DbPropertyType;
  price_cents: number;
  rent_period?: "week" | "month" | null;
  address_line: string;
  suburb: string;
  state: DbState;
  postcode: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  land_size_sqm?: number | null;
  features?: string[];
  is_published?: boolean;
};

export async function createProperty(userId: string, input: PropertyInput): Promise<string> {
  const { data, error } = await supabase
    .from("properties")
    .insert({ ...input, owner_id: userId, features: input.features ?? [], is_published: input.is_published ?? true })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function updateProperty(id: string, patch: Partial<PropertyInput>): Promise<void> {
  const { error } = await supabase.from("properties").update(patch).eq("id", id);
  if (error) throw error;
}

export async function softDeleteProperty(id: string): Promise<void> {
  const { error } = await supabase.from("properties").update({ deleted_at: new Date().toISOString(), is_published: false }).eq("id", id);
  if (error) throw error;
}

// ---------- Image storage ----------

const BUCKET = "property-images";
const SIGNED_URL_SECONDS = 60 * 60 * 24 * 365 * 20; // ~20 years

export async function uploadPropertyImages(propertyId: string, userId: string, files: File[]): Promise<void> {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${userId}/${propertyId}/${Date.now()}-${i}.${ext}`;
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false, contentType: file.type });
    if (upErr) throw upErr;
    const { data: signed, error: signErr } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_SECONDS);
    if (signErr) throw signErr;
    const { error: rowErr } = await supabase
      .from("property_images")
      .insert({ property_id: propertyId, url: signed.signedUrl, storage_path: path, sort_order: i });
    if (rowErr) throw rowErr;
  }
}

export async function deletePropertyImages(propertyId: string): Promise<void> {
  const { data, error } = await supabase.from("property_images").select("storage_path").eq("property_id", propertyId);
  if (error) throw error;
  const paths = (data ?? []).map((r) => r.storage_path).filter((p): p is string => !!p);
  if (paths.length) await supabase.storage.from(BUCKET).remove(paths);
  await supabase.from("property_images").delete().eq("property_id", propertyId);
}
