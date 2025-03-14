
import { MusicRequest } from "@/types/database.types";

/**
 * Funções utilitárias para validação de tipos enumerados
 * Centraliza a lógica de validação para garantir consistência em todo o aplicativo
 */

/**
 * Valida se o tipo de relacionamento está entre os valores permitidos
 */
export const validateRelationshipType = (value?: string | null): MusicRequest['relationship_type'] => {
  if (!value) return 'other';
  
  const validTypes = [
    'esposa', 'noiva', 'namorada', 'amigo_especial', 'partner', 
    'friend', 'family', 'colleague', 'mentor', 'child', 
    'sibling', 'parent', 'other'
  ] as const;
  
  return validTypes.includes(value as any) ? value as MusicRequest['relationship_type'] : 'other';
};

/**
 * Valida se o gênero musical está entre os valores permitidos
 */
export const validateMusicGenre = (value?: string | null): MusicRequest['music_genre'] => {
  if (!value) return 'pop';
  
  const validGenres = [
    'romantic', 'mpb', 'classical', 'jazz', 'hiphop', 
    'rock', 'country', 'reggae', 'electronic', 'samba', 'folk', 'pop'
  ] as const;
  
  return validGenres.includes(value as any) ? value as MusicRequest['music_genre'] : 'pop';
};

/**
 * Valida se o tom musical está entre os valores permitidos
 */
export const validateMusicTone = (value?: string | null): MusicRequest['music_tone'] | undefined => {
  if (!value) return undefined;
  
  const validTones = [
    'happy', 'romantic', 'nostalgic', 'fun', 'melancholic', 'energetic', 
    'peaceful', 'inspirational', 'dramatic', 'uplifting', 'reflective', 'mysterious'
  ] as const;
  
  return validTones.includes(value as any) ? value as MusicRequest['music_tone'] : undefined;
};

/**
 * Valida se o tipo de voz está entre os valores permitidos
 */
export const validateVoiceType = (value?: string | null): MusicRequest['voice_type'] | undefined => {
  if (!value) return undefined;
  
  const validVoices = [
    'male', 'female', 'male_romantic', 'female_romantic', 
    'male_folk', 'female_folk', 'male_deep', 'female_powerful', 
    'male_soft', 'female_sweet', 'male_jazzy', 'female_jazzy', 
    'male_rock', 'female_rock', 'male_country', 'female_country'
  ] as const;
  
  return validVoices.includes(value as any) ? value as MusicRequest['voice_type'] : undefined;
};

/**
 * Valida se o status do pedido está entre os valores permitidos
 */
export const validateStatus = (value?: string | null): MusicRequest['status'] => {
  if (!value) return 'pending';
  
  const validStatuses = ['pending', 'in_production', 'completed'] as const;
  
  return validStatuses.includes(value as any) ? value as MusicRequest['status'] : 'pending';
};

/**
 * Valida se o status de pagamento está entre os valores permitidos
 */
export const validatePaymentStatus = (value?: string | null): 'pending' | 'completed' | null => {
  if (!value) return null;
  
  return value === 'completed' ? 'completed' : 'pending';
};

/**
 * Valida todos os campos de um objeto MusicRequest para garantir que estão conforme 
 * os tipos esperados. Útil para validar dados vindos do banco de dados ou APIs externas.
 */
export const validateMusicRequest = (data: Record<string, any>): MusicRequest => {
  return {
    ...data,
    relationship_type: validateRelationshipType(data.relationship_type),
    music_genre: validateMusicGenre(data.music_genre),
    music_tone: validateMusicTone(data.music_tone),
    voice_type: validateVoiceType(data.voice_type),
    status: validateStatus(data.status),
    payment_status: validatePaymentStatus(data.payment_status)
  } as MusicRequest;
};
