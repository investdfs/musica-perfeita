
import { MusicRequest } from "@/types/database.types";

/**
 * Funções utilitárias para validação de tipos enumerados
 * Centraliza a lógica de validação para garantir consistência em todo o aplicativo
 */

/**
 * Valida se o tipo de relacionamento está entre os valores permitidos
 */
export const validateRelationshipType = (value?: string | null): string => {
  if (!value) return 'other';
  
  const validTypes = [
    'esposa', 'noiva', 'namorada', 'amigo_especial', 'partner', 
    'friend', 'family', 'colleague', 'mentor', 'child', 
    'sibling', 'parent', 'other'
  ];
  
  return validTypes.includes(value) ? value : 'other';
};

/**
 * Valida se o gênero musical está entre os valores permitidos
 */
export const validateMusicGenre = (value?: string | null): string => {
  if (!value) return 'pop';
  
  const validGenres = [
    'romantic', 'mpb', 'classical', 'jazz', 'hiphop', 
    'rock', 'country', 'reggae', 'electronic', 'samba', 'folk', 'pop'
  ];
  
  return validGenres.includes(value) ? value : 'pop';
};

/**
 * Valida se o tom musical está entre os valores permitidos
 */
export const validateMusicTone = (value?: string | null): string | undefined => {
  if (!value) return undefined;
  
  const validTones = [
    'happy', 'romantic', 'nostalgic', 'fun', 'melancholic', 'energetic', 
    'peaceful', 'inspirational', 'dramatic', 'uplifting', 'reflective', 'mysterious'
  ];
  
  return validTones.includes(value) ? value : undefined;
};

/**
 * Valida se o tipo de voz está entre os valores permitidos
 */
export const validateVoiceType = (value?: string | null): string | undefined => {
  if (!value) return undefined;
  
  const validVoices = [
    'male', 'female', 'male_romantic', 'female_romantic', 
    'male_folk', 'female_folk', 'male_deep', 'female_powerful', 
    'male_soft', 'female_sweet', 'male_jazzy', 'female_jazzy', 
    'male_rock', 'female_rock', 'male_country', 'female_country'
  ];
  
  return validVoices.includes(value) ? value : undefined;
};

/**
 * Valida se o status do pedido está entre os valores permitidos
 */
export const validateStatus = (value?: string | null): string => {
  if (!value) return 'pending';
  
  const validStatuses = ['pending', 'in_production', 'completed'];
  
  return validStatuses.includes(value) ? value : 'pending';
};

/**
 * Valida se o status de pagamento está entre os valores permitidos
 */
export const validatePaymentStatus = (value?: string | null): string | null => {
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
