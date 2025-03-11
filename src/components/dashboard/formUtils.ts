
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";
import { MusicRequestFormValues } from "./formSchema";
import { UserProfile } from "@/types/database.types";
import { v4 as uuidv4 } from "uuid";

export async function submitMusicRequest(
  values: MusicRequestFormValues, 
  userProfile: UserProfile, 
  coverImage: File | null
) {
  try {
    // Log the process steps to help with debugging
    console.log("Starting music request submission process");
    console.log("User profile:", userProfile);
    console.log("Form values:", values);
    
    // Handle dev-user-id format for development mode
    const userId = userProfile.id === 'dev-user-id' ? uuidv4() : userProfile.id;
    console.log("Using user ID:", userId);
    
    let coverUrl = null;
    
    if (coverImage) {
      console.log("Uploading cover image", coverImage);
      try {
        const fileName = `covers/${userId}/${Date.now()}-${coverImage.name}`;
        const { data: imageData, error: imageError } = await supabase.storage
          .from('music-covers')
          .upload(fileName, coverImage);
          
        if (imageError) {
          console.error("Error uploading image:", imageError);
          toast({
            title: "Alerta",
            description: "Não foi possível fazer upload da imagem, mas seu pedido será enviado mesmo assim.",
            variant: "destructive",
          });
        } else {
          coverUrl = imageData?.path;
          console.log("Cover image uploaded successfully:", coverUrl);
        }
      } catch (imageUploadError) {
        console.error("Image upload failed:", imageUploadError);
        // Continue with request even if image upload fails
        toast({
          title: "Alerta",
          description: "Não foi possível fazer upload da imagem, mas seu pedido será enviado mesmo assim.",
          variant: "destructive",
        });
      }
    }
    
    console.log("Preparing request data");
    const newRequest = {
      user_id: userId,
      honoree_name: values.honoree_name,
      relationship_type: values.relationship_type,
      custom_relationship: values.relationship_type === 'other' ? values.custom_relationship : null,
      music_genre: values.music_genre,
      music_tone: values.music_tone,
      voice_type: values.voice_type,
      include_names: values.include_names,
      names_to_include: values.include_names ? values.names_to_include : null,
      story: values.story,
      cover_image_url: coverUrl,
      status: 'pending',
      preview_url: null,
      full_song_url: null,
      payment_status: 'pending'
    };
    
    console.log("Submitting request to database:", newRequest);
    const { data, error } = await supabase
      .from('music_requests')
      .insert([newRequest])
      .select();
      
    if (error) {
      console.error("Database error during insertion:", error);
      throw new Error(`Erro ao salvar no banco de dados: ${error.message}`);
    }
    
    console.log("Request submitted successfully:", data);
    return data || [];
    
  } catch (error) {
    console.error('Error submitting music request:', error);
    
    // Melhoria no tratamento e detalhamento de erros
    let errorMessage = "Ocorreu um erro ao enviar seu pedido.";
    
    if (error.message?.includes("network") || error.message?.includes("Failed to fetch")) {
      errorMessage = "Problema de conexão detectado. Verifique sua internet e tente novamente.";
    } else if (error.code) {
      errorMessage += ` (Código: ${error.code})`;
    }
    
    console.error("Erro detalhado:", {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Rethrow to be handled by the component
    throw error;
  }
}
