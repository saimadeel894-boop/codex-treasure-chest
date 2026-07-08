import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listFavouriteIds = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("favourites")
      .select("property_id");
    if (error) throw new Error(error.message);
    return (data ?? []).map((r: any) => r.property_id as string);
  });

const SELECT = `
  id, title, description, listing_type, property_type, price_cents, rent_period,
  address_line, suburb, state, postcode, bedrooms, bathrooms, parking,
  land_size_sqm, building_size_sqm, features, featured, published_at,
  images:property_images(url, alt, sort_order)
`;

function normalize(row: any) {
  const images = (row.images ?? [])
    .slice()
    .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((i: any) => ({ url: i.url, alt: i.alt ?? null }));
  return { ...row, images };
}

export const listFavouriteProperties = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: favs, error } = await context.supabase
      .from("favourites")
      .select("property_id, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    const ids = (favs ?? []).map((r: any) => r.property_id);
    if (!ids.length) return [];
    const { data: props, error: err2 } = await context.supabase
      .from("properties")
      .select(SELECT)
      .in("id", ids)
      .eq("is_published", true);
    if (err2) throw new Error(err2.message);
    const order = new Map(ids.map((id: string, i: number) => [id, i]));
    return (props ?? [])
      .map(normalize)
      .sort((a: any, b: any) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
  });

export const toggleFavourite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { propertyId: string }) => data)
  .handler(async ({ data, context }) => {
    const { data: existing } = await context.supabase
      .from("favourites")
      .select("property_id")
      .eq("user_id", context.userId)
      .eq("property_id", data.propertyId)
      .maybeSingle();
    if (existing) {
      const { error } = await context.supabase
        .from("favourites")
        .delete()
        .eq("user_id", context.userId)
        .eq("property_id", data.propertyId);
      if (error) throw new Error(error.message);
      return { saved: false as const };
    }
    const { error } = await context.supabase
      .from("favourites")
      .insert({ user_id: context.userId, property_id: data.propertyId });
    if (error) throw new Error(error.message);
    return { saved: true as const };
  });
