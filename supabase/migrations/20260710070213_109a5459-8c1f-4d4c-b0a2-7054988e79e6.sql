
DROP POLICY IF EXISTS "Anyone can create inquiry" ON public.property_inquiries;
CREATE POLICY "Anyone can create inquiry" ON public.property_inquiries FOR INSERT
  WITH CHECK (
    length(coalesce(message,'')) BETWEEN 1 AND 5000
    AND length(coalesce(name,'')) BETWEEN 1 AND 200
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.is_published = true AND p.deleted_at IS NULL)
  );
