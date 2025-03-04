
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";
import { MusicRequestFormValues } from "./formSchema";
import { UserProfile } from "@/types/database.types";

export async function submitMusicRequest(
  values: MusicRequestFormValues, 
  userProfile: UserProfile, 
  coverImage: File | null
) {
  try {
    let coverUrl = null;
    
    if (coverImage) {
      const fileName = `covers/${userProfile.id}/${Date.now()}-${coverImage.name}`;
      const { data: imageData, error: imageError } = await supabase.storage
        .from('music-covers')
        .upload(fileName, coverImage);
        
      if (imageError) {
        throw imageError;
      }
      
      coverUrl = imageData?.path;
    }
    
    const newRequest = {
      user_id: userProfile.id,
      honoree_name: values.honoree_name,
      relationship_type: values.relationship_type,
      custom_relationship: values.relationship_type === 'other' ? values.custom_relationship : null,
      music_genre: values.music_genre,
      include_names: values.include_names,
      names_to_include: values.include_names ? values.names_to_include : null,
      story: values.story,
      cover_image_url: coverUrl,
      status: 'pending',
      preview_url: null,
      full_song_url: null,
      payment_status: 'pending'
    };
    
    const { data, error } = await supabase
      .from('music_requests')
      .insert([newRequest])
      .select();
      
    if (error) throw error;
    
    toast({
      title: "Pedido enviado com sucesso!",
      description: "Seu pedido foi recebido e está sendo analisado.",
    });
    
    return data || [];
    
  } catch (error) {
    console.error('Error submitting music request:', error);
    toast({
      title: "Erro ao enviar pedido",
      description: "Ocorreu um erro ao enviar seu pedido. Tente novamente.",
      variant: "destructive",
    });
    throw error;
  }
}
