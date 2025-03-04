
-- Create storage bucket for music covers
INSERT INTO storage.buckets (id, name) 
VALUES ('music-covers', 'music-covers');

-- Set up public access policy for the music-covers bucket
CREATE POLICY "Public Access to Music Covers" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'music-covers');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload music covers" ON storage.objects
  FOR INSERT TO public
  WITH CHECK (
    bucket_id = 'music-covers'
  );
