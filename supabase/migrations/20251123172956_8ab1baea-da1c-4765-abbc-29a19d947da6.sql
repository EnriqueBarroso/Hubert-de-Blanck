-- Create storage buckets for theater images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('play-images', 'play-images', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ('actor-images', 'actor-images', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);

-- Storage policies for play images
CREATE POLICY "Anyone can view play images"
ON storage.objects FOR SELECT
USING (bucket_id = 'play-images');

CREATE POLICY "Admins can upload play images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'play-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update play images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'play-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete play images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'play-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Storage policies for actor images
CREATE POLICY "Anyone can view actor images"
ON storage.objects FOR SELECT
USING (bucket_id = 'actor-images');

CREATE POLICY "Admins can upload actor images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'actor-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update actor images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'actor-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete actor images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'actor-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);