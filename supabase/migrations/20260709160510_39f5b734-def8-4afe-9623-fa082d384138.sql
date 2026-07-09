
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles viewable by authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Public read property images" ON storage.objects;
CREATE POLICY "Public read images of published properties"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'property-images'
  AND EXISTS (
    SELECT 1 FROM public.properties p
    WHERE p.owner_id::text = (storage.foldername(name))[1]
      AND p.is_published = true
  )
);
CREATE POLICY "Owners read own property images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'property-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
