
-- Helper: updated_at trigger function (idempotent)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- =========================================================
-- AGENCIES
-- =========================================================
CREATE TABLE public.agencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  logo_url text,
  website text,
  phone text,
  email text,
  description text,
  address_line text,
  suburb text,
  state public.au_state,
  postcode text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
GRANT SELECT ON public.agencies TO anon, authenticated;
GRANT ALL ON public.agencies TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.agencies TO authenticated;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Agencies are viewable by everyone" ON public.agencies FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Admins manage agencies" ON public.agencies FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_agencies_updated BEFORE UPDATE ON public.agencies FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_agencies_state ON public.agencies(state);

-- =========================================================
-- AGENTS
-- =========================================================
CREATE TABLE public.agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  agency_id uuid REFERENCES public.agencies(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  slug text UNIQUE,
  title text,
  bio text,
  license_number text,
  phone text,
  email text,
  avatar_url text,
  years_experience int,
  specialties text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
GRANT SELECT ON public.agents TO anon, authenticated;
GRANT ALL ON public.agents TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.agents TO authenticated;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Agents are viewable by everyone" ON public.agents FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Agent owns own record" ON public.agents FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage agents" ON public.agents FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_agents_updated BEFORE UPDATE ON public.agents FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_agents_agency ON public.agents(agency_id);

-- =========================================================
-- DEVELOPERS
-- =========================================================
CREATE TABLE public.developers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  logo_url text,
  website text,
  phone text,
  email text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
GRANT SELECT ON public.developers TO anon, authenticated;
GRANT ALL ON public.developers TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.developers TO authenticated;
ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Developers viewable by everyone" ON public.developers FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Developer owns own record" ON public.developers FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage developers" ON public.developers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_developers_updated BEFORE UPDATE ON public.developers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- DEVELOPER PROJECTS
-- =========================================================
CREATE TABLE public.developer_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id uuid NOT NULL REFERENCES public.developers(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  hero_image_url text,
  suburb text,
  state public.au_state,
  status text NOT NULL DEFAULT 'planning',
  price_from_cents bigint,
  completion_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
GRANT SELECT ON public.developer_projects TO anon, authenticated;
GRANT ALL ON public.developer_projects TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.developer_projects TO authenticated;
ALTER TABLE public.developer_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Projects viewable by everyone" ON public.developer_projects FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Developer manages own projects" ON public.developer_projects FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.developers d WHERE d.id = developer_id AND d.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.developers d WHERE d.id = developer_id AND d.user_id = auth.uid()));
CREATE POLICY "Admins manage projects" ON public.developer_projects FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON public.developer_projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_projects_developer ON public.developer_projects(developer_id);

-- =========================================================
-- PROPERTY FEATURES catalog + join
-- =========================================================
CREATE TABLE public.property_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  icon text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.property_features TO anon, authenticated;
GRANT ALL ON public.property_features TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.property_features TO authenticated;
ALTER TABLE public.property_features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Features viewable by everyone" ON public.property_features FOR SELECT USING (true);
CREATE POLICY "Admins manage features" ON public.property_features FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.property_feature_map (
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  feature_id uuid NOT NULL REFERENCES public.property_features(id) ON DELETE CASCADE,
  PRIMARY KEY (property_id, feature_id)
);
GRANT SELECT ON public.property_feature_map TO anon, authenticated;
GRANT ALL ON public.property_feature_map TO service_role;
GRANT INSERT, DELETE ON public.property_feature_map TO authenticated;
ALTER TABLE public.property_feature_map ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Feature map viewable by everyone" ON public.property_feature_map FOR SELECT USING (true);
CREATE POLICY "Owner manages feature map" ON public.property_feature_map FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.owner_id = auth.uid()));

-- =========================================================
-- Extend properties: agent/agency link, soft-delete
-- =========================================================
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS agent_id uuid REFERENCES public.agents(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS agency_id uuid REFERENCES public.agencies(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
CREATE INDEX IF NOT EXISTS idx_properties_state ON public.properties(state);
CREATE INDEX IF NOT EXISTS idx_properties_suburb ON public.properties(suburb);
CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_listing ON public.properties(listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties(price_cents);
CREATE INDEX IF NOT EXISTS idx_properties_owner ON public.properties(owner_id);

-- =========================================================
-- PROPERTY INQUIRIES
-- =========================================================
CREATE TABLE public.property_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  from_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.property_inquiries TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.property_inquiries TO authenticated;
GRANT INSERT ON public.property_inquiries TO anon;
ALTER TABLE public.property_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create inquiry" ON public.property_inquiries FOR INSERT
  WITH CHECK (true);
CREATE POLICY "Sender sees own inquiries" ON public.property_inquiries FOR SELECT TO authenticated
  USING (auth.uid() = from_user_id);
CREATE POLICY "Property owner sees inquiries" ON public.property_inquiries FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.owner_id = auth.uid()));
CREATE POLICY "Property owner updates inquiries" ON public.property_inquiries FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.owner_id = auth.uid()));
CREATE POLICY "Admins manage inquiries" ON public.property_inquiries FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_inquiries_updated BEFORE UPDATE ON public.property_inquiries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_inquiries_property ON public.property_inquiries(property_id);
CREATE INDEX idx_inquiries_from ON public.property_inquiries(from_user_id);

-- =========================================================
-- SAVED PROPERTIES view (alias to favourites)
-- =========================================================
CREATE OR REPLACE VIEW public.saved_properties
WITH (security_invoker=on) AS
SELECT user_id, property_id, created_at FROM public.favourites;
GRANT SELECT ON public.saved_properties TO authenticated;

-- =========================================================
-- NOTIFICATIONS
-- =========================================================
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  link text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User sees own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "User updates own notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "User deletes own notifications" ON public.notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, read);

-- =========================================================
-- SUBSCRIPTIONS
-- =========================================================
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'free',
  status text NOT NULL DEFAULT 'active',
  current_period_end timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User sees own subscription" ON public.subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins manage subscriptions" ON public.subscriptions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_subs_updated BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- SETTINGS
-- =========================================================
CREATE TABLE public.settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.settings TO anon, authenticated;
GRANT ALL ON public.settings TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.settings TO authenticated;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings viewable by everyone" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- BLOG CATEGORIES + BLOGS
-- =========================================================
CREATE TABLE public.blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_categories TO anon, authenticated;
GRANT ALL ON public.blog_categories TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.blog_categories TO authenticated;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories viewable by everyone" ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.blog_categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL,
  cover_image_url text,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  category_id uuid REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  read_time_minutes int,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
GRANT SELECT ON public.blogs TO anon, authenticated;
GRANT ALL ON public.blogs TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.blogs TO authenticated;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published blogs viewable by everyone" ON public.blogs FOR SELECT
  USING (is_published = true AND deleted_at IS NULL);
CREATE POLICY "Author sees own blogs" ON public.blogs FOR SELECT TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "Author manages own blogs" ON public.blogs FOR ALL TO authenticated
  USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Admins manage blogs" ON public.blogs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_blogs_updated BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_blogs_published ON public.blogs(is_published, published_at DESC);
CREATE INDEX idx_blogs_category ON public.blogs(category_id);

-- =========================================================
-- Seed a few base rows
-- =========================================================
INSERT INTO public.blog_categories (name, slug) VALUES
  ('Market Insights','market-insights'),
  ('Buyer Guides','buyer-guides'),
  ('Seller Tips','seller-tips'),
  ('Investment','investment')
ON CONFLICT DO NOTHING;

INSERT INTO public.property_features (name, slug, icon) VALUES
  ('Air Conditioning','air-conditioning','snowflake'),
  ('Pool','pool','waves'),
  ('Garage','garage','car'),
  ('Balcony','balcony','building'),
  ('Garden','garden','trees'),
  ('Security System','security-system','shield'),
  ('Gym','gym','dumbbell'),
  ('Fireplace','fireplace','flame')
ON CONFLICT DO NOTHING;

INSERT INTO public.settings (key, value) VALUES
  ('site', '{"name":"Nestoria Australia","tagline":"Discover premium properties across Australia"}'::jsonb)
ON CONFLICT DO NOTHING;
