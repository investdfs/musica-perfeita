
-- Create user_profiles table
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  whatsapp TEXT NOT NULL,
  password TEXT NOT NULL
);

-- Create music_requests table
CREATE TABLE public.music_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id),
  honoree_name TEXT NOT NULL,
  relationship_type TEXT NOT NULL CHECK (
    relationship_type IN (
      'esposa', 'noiva', 'namorada', 'amigo_especial', 'partner', 
      'friend', 'family', 'colleague', 'mentor', 'child', 
      'sibling', 'parent', 'other'
    )
  ),
  custom_relationship TEXT,
  music_genre TEXT NOT NULL CHECK (
    music_genre IN (
      'romantic', 'mpb', 'classical', 'jazz', 'hiphop', 
      'rock', 'country', 'reggae', 'electronic', 'samba', 
      'folk', 'pop'
    )
  ),
  include_names BOOLEAN NOT NULL DEFAULT false,
  names_to_include TEXT,
  story TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'in_production', 'completed')
  ),
  preview_url TEXT,
  full_song_url TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (
    payment_status IN ('pending', 'completed')
  ),
  cover_image_url TEXT
);

-- Create an index for faster lookups by user_id
CREATE INDEX idx_music_requests_user_id ON public.music_requests(user_id);
