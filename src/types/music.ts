
export interface Music {
  id: string;
  title: string;
  artist: string;
  duration: number; // em segundos
  coverUrl: string;
  audioUrl: string;
  genre?: string;
  plays: number;
  created_at?: string;
}
