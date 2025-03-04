
export type UserProfile = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  whatsapp: string;
};

export type MusicRequest = {
  id: string;
  created_at: string;
  user_id: string;
  honoree_name: string;
  relationship_type: 'partner' | 'friend' | 'family' | 'colleague' | 'mentor' | 'child' | 'sibling' | 'parent' | 'other';
  music_genre: 'romantic' | 'mpb' | 'classical' | 'jazz' | 'hiphop' | 'rock' | 'country' | 'reggae' | 'electronic' | 'samba' | 'folk' | 'pop';
  include_names: boolean;
  names_to_include: string | null;
  story: string;
  status: 'pending' | 'in_production' | 'completed';
  preview_url: string | null;
  full_song_url: string | null;
  payment_status: 'pending' | 'completed' | null;
};
