
-- Create storage bucket for music covers
INSERT INTO storage.buckets (id, name) 
VALUES ('music-covers', 'music-covers');

-- Create storage bucket for music files
INSERT INTO storage.buckets (id, name, file_size_limit) 
VALUES ('music-files', 'music-files', 15728640); -- 15MB limit

-- Set up public access policy for the music-covers bucket
CREATE POLICY "Public Access to Music Covers" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'music-covers');

-- Allow authenticated users to upload files to music-covers
CREATE POLICY "Authenticated users can upload music covers" ON storage.objects
  FOR INSERT TO public
  WITH CHECK (
    bucket_id = 'music-covers'
  );

-- Set up restricted access policy for music files (only authenticated users can access)
CREATE POLICY "Authenticated Access to Music Files" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'music-files');

-- Allow authenticated users to upload music files
CREATE POLICY "Authenticated users can upload music files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'music-files'
  );
