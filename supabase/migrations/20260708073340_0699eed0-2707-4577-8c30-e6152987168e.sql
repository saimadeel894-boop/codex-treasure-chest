
-- 1. Roles infrastructure
CREATE TYPE public.app_role AS ENUM ('buyer', 'seller', 'agent', 'developer', 'admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT, INSERT, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users add own non-admin roles" ON public.user_roles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id AND role <> 'admin');
CREATE POLICY "Users remove own non-admin roles" ON public.user_roles FOR DELETE
  TO authenticated USING (auth.uid() = user_id AND role <> 'admin');
CREATE POLICY "Admins manage all roles" ON public.user_roles FOR ALL
  TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Extend signup trigger to grant buyer role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'buyer')
    ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

-- Backfill: grant buyer role to existing users
INSERT INTO public.user_roles (user_id, role)
  SELECT id, 'buyer'::public.app_role FROM auth.users
  ON CONFLICT DO NOTHING;

-- 2. Add owner_id to properties
ALTER TABLE public.properties ADD COLUMN owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX properties_owner_id_idx ON public.properties(owner_id);

-- 3. Property write policies (owners + admins)
GRANT INSERT, UPDATE, DELETE ON public.properties TO authenticated;

CREATE POLICY "Owners read own properties" ON public.properties FOR SELECT
  TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Admins read all properties" ON public.properties FOR SELECT
  TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Sellers create own properties" ON public.properties FOR INSERT
  TO authenticated WITH CHECK (
    auth.uid() = owner_id AND (
      public.has_role(auth.uid(), 'seller') OR
      public.has_role(auth.uid(), 'agent') OR
      public.has_role(auth.uid(), 'developer') OR
      public.has_role(auth.uid(), 'admin')
    )
  );
CREATE POLICY "Owners update own properties" ON public.properties FOR UPDATE
  TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Admins update all properties" ON public.properties FOR UPDATE
  TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners delete own properties" ON public.properties FOR DELETE
  TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Admins delete all properties" ON public.properties FOR DELETE
  TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 4. Property images write policies
GRANT INSERT, UPDATE, DELETE ON public.property_images TO authenticated;

CREATE POLICY "Owners read own property images" ON public.property_images FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM public.properties p WHERE p.id = property_images.property_id AND p.owner_id = auth.uid()
  ));
CREATE POLICY "Owners insert own property images" ON public.property_images FOR INSERT
  TO authenticated WITH CHECK (EXISTS (
    SELECT 1 FROM public.properties p WHERE p.id = property_images.property_id AND p.owner_id = auth.uid()
  ));
CREATE POLICY "Owners update own property images" ON public.property_images FOR UPDATE
  TO authenticated USING (EXISTS (
    SELECT 1 FROM public.properties p WHERE p.id = property_images.property_id AND p.owner_id = auth.uid()
  ));
CREATE POLICY "Owners delete own property images" ON public.property_images FOR DELETE
  TO authenticated USING (EXISTS (
    SELECT 1 FROM public.properties p WHERE p.id = property_images.property_id AND p.owner_id = auth.uid()
  ));

-- 5. Updated_at trigger for properties
CREATE OR REPLACE FUNCTION public.tg_touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.published_at = COALESCE(NEW.published_at, now()); RETURN NEW; END;
$$;

-- 6. Storage RLS policies for property-images bucket (bucket created via tool separately)
CREATE POLICY "Public read property images" ON storage.objects FOR SELECT
  TO public USING (bucket_id = 'property-images');
CREATE POLICY "Users upload to own folder" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (
    bucket_id = 'property-images' AND (storage.foldername(name))[1] = auth.uid()::text
  );
CREATE POLICY "Users update own folder" ON storage.objects FOR UPDATE
  TO authenticated USING (
    bucket_id = 'property-images' AND (storage.foldername(name))[1] = auth.uid()::text
  );
CREATE POLICY "Users delete own folder" ON storage.objects FOR DELETE
  TO authenticated USING (
    bucket_id = 'property-images' AND (storage.foldername(name))[1] = auth.uid()::text
  );
