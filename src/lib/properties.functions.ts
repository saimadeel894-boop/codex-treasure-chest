import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type ListingType = "sale" | "rent" | "sold";
export type PropertyType = "house" | "apartment" | "townhouse" | "land" | "rural";
export type SortOrder = "newest" | "price_asc" | "price_desc";

export type PropertyRow = {
  id: string;
  title: string;
  description: string;
  listing_type: ListingType;
  property_type: PropertyType;
  price_cents: number;
  rent_period: "week" | "month" | null;
  address_line: string;
  suburb: string;
  state: string;
  postcode: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  land_size_sqm: number | null;
  building_size_sqm: number | null;
  features: string[];
  featured: boolean;
  published_at: string;
  images: { url: string; alt: string | null }[];
};

function serverClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

const SELECT = `
  id, title, description, listing_type, property_type, price_cents, rent_period,
  address_line, suburb, state, postcode, bedrooms, bathrooms, parking,
  land_size_sqm, building_size_sqm, features, featured, published_at,
  images:property_images(url, alt, sort_order)
`;

function normalize(row: any): PropertyRow {
  const images = (row.images ?? [])
    .slice()
    .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((i: any) => ({ url: i.url, alt: i.alt ?? null }));
  return { ...row, images } as PropertyRow;
}

export type ListPropertiesInput = {
  listingType?: ListingType;
  location?: string;
  propertyType?: PropertyType | "any";
  minBeds?: number;
  minBaths?: number;
  minParking?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOrder;
  limit?: number;
};

export const listProperties = createServerFn({ method: "GET" })
  .inputValidator((data: ListPropertiesInput) => data ?? {})
  .handler(async ({ data }) => {
    const supabase = serverClient();
    let q = supabase.from("properties").select(SELECT).eq("is_published", true);

    if (data.listingType) q = q.eq("listing_type", data.listingType);
    if (data.propertyType && data.propertyType !== "any") q = q.eq("property_type", data.propertyType);
    if (data.minBeds) q = q.gte("bedrooms", data.minBeds);
    if (data.minBaths) q = q.gte("bathrooms", data.minBaths);
    if (data.minParking) q = q.gte("parking", data.minParking);
    if (data.minPrice) q = q.gte("price_cents", data.minPrice * 100);
    if (data.maxPrice) q = q.lte("price_cents", data.maxPrice * 100);
    if (data.location && data.location.trim()) {
      const term = `%${data.location.trim()}%`;
      q = q.or(`suburb.ilike.${term},postcode.ilike.${term},state.ilike.${term}`);
    }

    switch (data.sort) {
      case "price_asc": q = q.order("price_cents", { ascending: true }); break;
      case "price_desc": q = q.order("price_cents", { ascending: false }); break;
      default: q = q.order("published_at", { ascending: false });
    }
    q = q.limit(data.limit ?? 60);

    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return (rows ?? []).map(normalize);
  });

export const listFeatured = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverClient();
  const { data, error } = await supabase
    .from("properties")
    .select(SELECT)
    .eq("is_published", true)
    .eq("featured", true)
    .order("published_at", { ascending: false })
    .limit(6);
  if (error) throw new Error(error.message);
  return (data ?? []).map(normalize);
});

export const getProperty = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const supabase = serverClient();
    const { data: row, error } = await supabase
      .from("properties")
      .select(SELECT)
      .eq("id", data.id)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return null;
    return normalize(row);
  });
