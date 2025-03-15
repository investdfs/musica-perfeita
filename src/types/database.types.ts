
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
  relationship_type: string; // Modificado de tipo union para string para compatibilidade
  custom_relationship: string | null;
  music_genre: string; // Modificado de tipo union para string para compatibilidade
  music_tone?: string;
  voice_type?: string;
  include_names: boolean;
  names_to_include: string | null;
  story: string;
  status: 'pending' | 'in_production' | 'completed';
  preview_url: string | null;
  full_song_url: string | null;
  payment_status: 'pending' | 'completed' | null;
  cover_image_url?: string | null;
  soundcloud_id?: string | null;
  music_focus?: string | null;
  happy_memory?: string | null;
  sad_memory?: string | null;
  technical_details?: string | null;
  has_technical_details?: boolean;
  order_number?: string | null;
};
