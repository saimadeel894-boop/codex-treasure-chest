import { supabase } from "@/integrations/supabase/client";
import { mapProperty, type PropertyRow } from "./property-service";
import type { Property } from "@/data/marketplace";

export type Agency = {
  id: string;
  slug: string;
  name: string;
  initials: string;
  suburb: string;
  state: string;
  phone: string | null;
  email: string | null;
  description: string | null;
  heroImage: string;
};

export type Agent = {
  id: string;
  slug: string;
  name: string;
  title: string | null;
  bio: string | null;
  phone: string | null;
  email: string | null;
  image: string;
  yearsExperience: number | null;
  specialties: string[];
  agencyId: string | null;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  image: string;
  category: string;
  publishedAt: string | null;
  readTime: string;
};

const FALLBACK_AGENT = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80";
const FALLBACK_AGENCY = "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1800&q=80";
const FALLBACK_BLOG = "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1200&q=80";

function initials(name: string) {
  return name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function mapAgency(row: any): Agency {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    initials: initials(row.name),
    suburb: row.suburb ?? "",
    state: row.state ?? "",
    phone: row.phone,
    email: row.email,
    description: row.description,
    heroImage: row.logo_url || FALLBACK_AGENCY,
  };
}

function mapAgent(row: any): Agent {
  return {
    id: row.id,
    slug: row.slug,
    name: row.full_name,
    title: row.title,
    bio: row.bio,
    phone: row.phone,
    email: row.email,
    image: row.avatar_url || FALLBACK_AGENT,
    yearsExperience: row.years_experience,
    specialties: row.specialties ?? [],
    agencyId: row.agency_id,
  };
}

function mapBlog(row: any): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    image: row.cover_image_url || FALLBACK_BLOG,
    category: row.blog_categories?.name ?? "Insights",
    publishedAt: row.published_at,
    readTime: row.read_time_minutes ? `${row.read_time_minutes} min read` : "5 min read",
  };
}

export async function fetchAgencies(): Promise<Agency[]> {
  const { data, error } = await supabase.from("agencies").select("*").is("deleted_at", null).order("name");
  if (error) throw error;
  return (data ?? []).map(mapAgency);
}

export async function fetchAgencyBySlug(slug: string): Promise<Agency | null> {
  const { data, error } = await supabase.from("agencies").select("*").eq("slug", slug).is("deleted_at", null).maybeSingle();
  if (error) throw error;
  return data ? mapAgency(data) : null;
}

export async function fetchAgentsForAgency(agencyId: string): Promise<Agent[]> {
  const { data, error } = await supabase.from("agents").select("*").eq("agency_id", agencyId).is("deleted_at", null).order("full_name");
  if (error) throw error;
  return (data ?? []).map(mapAgent);
}

export async function fetchAgentBySlug(slug: string): Promise<Agent | null> {
  const { data, error } = await supabase.from("agents").select("*").eq("slug", slug).is("deleted_at", null).maybeSingle();
  if (error) throw error;
  return data ? mapAgent(data) : null;
}

export async function fetchAgencyById(id: string): Promise<Agency | null> {
  const { data, error } = await supabase.from("agencies").select("*").eq("id", id).is("deleted_at", null).maybeSingle();
  if (error) throw error;
  return data ? mapAgency(data) : null;
}

const PROP_SELECT = `
  id, title, description, listing_type, property_type, price_cents, rent_period,
  address_line, suburb, state, postcode, bedrooms, bathrooms, parking,
  land_size_sqm, building_size_sqm, features, is_published, featured,
  published_at, owner_id, agent_id, agency_id,
  property_images ( url, sort_order )
`;

export async function fetchPropertiesByAgent(agentId: string): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select(PROP_SELECT)
    .eq("agent_id", agentId)
    .eq("is_published", true)
    .is("deleted_at", null);
  if (error) throw error;
  return (data as PropertyRow[]).map(mapProperty);
}

export async function fetchPropertiesByAgency(agencyId: string): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select(PROP_SELECT)
    .eq("agency_id", agencyId)
    .eq("is_published", true)
    .is("deleted_at", null);
  if (error) throw error;
  return (data as PropertyRow[]).map(mapProperty);
}

export async function fetchBlogs(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blogs")
    .select("*, blog_categories ( name, slug )")
    .eq("is_published", true)
    .is("deleted_at", null)
    .order("published_at", { ascending: false, nullsFirst: false });
  if (error) throw error;
  return (data ?? []).map(mapBlog);
}

export async function fetchBlogBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blogs")
    .select("*, blog_categories ( name, slug )")
    .eq("slug", slug)
    .eq("is_published", true)
    .is("deleted_at", null)
    .maybeSingle();
  if (error) throw error;
  return data ? mapBlog(data) : null;
}
