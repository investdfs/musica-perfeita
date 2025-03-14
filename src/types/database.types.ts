
export type UserProfile = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  whatsapp: string;
  password: string;
  is_admin?: boolean;
  is_main_admin?: boolean;
};

export type MusicRequest = {
  id: string;
  created_at: string;
  user_id: string;
  honoree_name: string;
  relationship_type: 'esposa' | 'noiva' | 'namorada' | 'amigo_especial' | 'partner' | 'friend' | 'family' | 'colleague' | 'mentor' | 'child' | 'sibling' | 'parent' | 'other';
  custom_relationship: string | null;
  music_genre: 'romantic' | 'mpb' | 'classical' | 'jazz' | 'hiphop' | 'rock' | 'country' | 'reggae' | 'electronic' | 'samba' | 'folk' | 'pop';
  music_tone?: 'happy' | 'romantic' | 'nostalgic' | 'fun' | 'melancholic' | 'energetic' | 'peaceful' | 'inspirational' | 'dramatic' | 'uplifting' | 'reflective' | 'mysterious';
  voice_type?: 'male' | 'female' | 'male_romantic' | 'female_romantic' | 'male_folk' | 'female_folk' | 'male_deep' | 'female_powerful' | 'male_soft' | 'female_sweet' | 'male_jazzy' | 'female_jazzy' | 'male_rock' | 'female_rock' | 'male_country' | 'female_country';
  include_names: boolean;
  names_to_include: string | null;
  story: string;
  status: 'pending' | 'in_production' | 'completed';
  preview_url: string | null;
  full_song_url: string | null;
  payment_status: 'pending' | 'completed' | null;
  cover_image_url?: string | null;
  soundcloud_id?: string | null; // Mantemos para compatibilidade com dados existentes
  music_focus?: string | null;
  happy_memory?: string | null;
  sad_memory?: string | null;
  technical_details?: string | null; // Novo campo para detalhes técnicos da música
};
