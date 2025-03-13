
import { MusicRequestFormValues } from "../formSchema";
import { UserProfile } from "@/types/database.types";
import { v4 as uuidv4 } from "uuid";

/**
 * Prepara os dados do pedido de música para o banco de dados
 */
export function prepareRequestData(
  values: MusicRequestFormValues, 
  userProfile: UserProfile, 
  coverUrl: string | null
) {
  // Identificação do usuário (com fallback para desenvolvimento)
  const userId = userProfile?.id || 'dev-user-id';
  console.log("[requestData] Preparando pedido para usuário:", userId);
  
  // Construir objeto completo do pedido com valores padrão explícitos
  return {
    user_id: userId,
    honoree_name: values.honoree_name,
    relationship_type: values.relationship_type,
    custom_relationship: values.relationship_type === 'other' ? values.custom_relationship : null,
    music_genre: values.music_genre,
    music_tone: values.music_tone,
    voice_type: values.voice_type,
    include_names: Boolean(values.include_names),
    names_to_include: values.include_names ? values.names_to_include : null,
    story: values.story,
    cover_image_url: coverUrl || null,
    status: 'pending',
    preview_url: null,
    full_song_url: null,
    payment_status: 'pending',
    music_focus: values.music_focus || null,
    happy_memory: values.happy_memory || null,
    sad_memory: values.sad_memory || null
  };
}
