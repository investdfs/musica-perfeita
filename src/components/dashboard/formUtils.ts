
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
    // Log the process steps to help with debugging
    console.log("Starting music request submission process");
    console.log("User profile:", userProfile);
    console.log("Form values:", values);
    
    let coverUrl = null;
    
    if (coverImage) {
      console.log("Uploading cover image");
      try {
        const fileName = `covers/${userProfile.id}/${Date.now()}-${coverImage.name}`;
        const { data: imageData, error: imageError } = await supabase.storage
          .from('music-covers')
          .upload(fileName, coverImage);
          
        if (imageError) {
          console.error("Error uploading image:", imageError);
          throw imageError;
        }
        
        coverUrl = imageData?.path;
        console.log("Cover image uploaded successfully:", coverUrl);
      } catch (imageUploadError) {
        console.error("Image upload failed:", imageUploadError);
        // Continue with request even if image upload fails
        toast({
          title: "Alerta",
          description: "Não foi possível fazer upload da imagem, mas seu pedido será enviado mesmo assim.",
          variant: "warning",
        });
      }
    }
    
    console.log("Preparing request data");
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
    
    console.log("Submitting request to database:", newRequest);
    const { data, error } = await supabase
      .from('music_requests')
      .insert([newRequest])
      .select();
      
    if (error) {
      console.error("Database error during insertion:", error);
      throw error;
    }
    
    console.log("Request submitted successfully:", data);
    toast({
      title: "Pedido enviado com sucesso!",
      description: "Seu pedido foi recebido e está sendo analisado.",
    });
    
    return data || [];
    
  } catch (error) {
    console.error('Error submitting music request:', error);
    // More detailed error reporting
    let errorMessage = "Ocorreu um erro ao enviar seu pedido. Tente novamente.";
    
    if (error.message) {
      errorMessage += ` Erro: ${error.message}`;
    }
    
    if (error.code) {
      console.error(`Error code: ${error.code}`);
    }
    
    toast({
      title: "Erro ao enviar pedido",
      description: errorMessage,
      variant: "destructive",
    });
    
    // Rethrow to be handled by the component
    throw error;
  }
}
