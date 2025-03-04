
-- Enable RLS on tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_requests ENABLE ROW LEVEL SECURITY;

-- Users can read and update only their own profiles
CREATE POLICY "Users can CRUD their own profiles" ON public.user_profiles
  FOR ALL TO public
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Everyone can create user profiles (for registration)
CREATE POLICY "Everyone can create a user profile" ON public.user_profiles
  FOR INSERT TO public
  WITH CHECK (true);

-- Users can read and update only their own music requests
CREATE POLICY "Users can read their own music requests" ON public.music_requests
  FOR SELECT TO public
  USING (user_id = auth.uid());

-- Users can insert their own music requests
CREATE POLICY "Users can create their own music requests" ON public.music_requests
  FOR INSERT TO public
  WITH CHECK (user_id = auth.uid());

-- Users can update their own music requests
CREATE POLICY "Users can update their own music requests" ON public.music_requests
  FOR UPDATE TO public
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Define service role policies for admin access (to be used by admin panel)
CREATE POLICY "Service role can do all operations" ON public.user_profiles
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do all operations" ON public.music_requests
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);
