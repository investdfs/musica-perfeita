
-- Temporary public access until authentication is implemented
CREATE POLICY "Temporary public access to profiles" ON public.user_profiles
  FOR ALL TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Temporary public access to music requests" ON public.music_requests
  FOR ALL TO public
  USING (true)
  WITH CHECK (true);
