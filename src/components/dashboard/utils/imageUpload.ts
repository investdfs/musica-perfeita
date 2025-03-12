
import supabase from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

/**
 * Realiza upload de imagem para o Supabase Storage
 */
export async function uploadCoverImage(
  coverImage: File | null, 
  userId: string
): Promise<string | null> {
  if (!coverImage) return null;
  
  console.log("Fazendo upload da imagem de capa", coverImage);
  
  try {
    const fileName = `covers/${userId}/${Date.now()}-${coverImage.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    console.log("Nome do arquivo para upload:", fileName);
    
    const { data: imageData, error: imageError } = await supabase.storage
      .from('music-covers')
      .upload(fileName, coverImage, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (imageError) {
      console.error("Erro ao fazer upload da imagem:", imageError);
      // Não interromper o envio por causa de falha no upload da imagem
      toast({
        title: "Alerta",
        description: "Não foi possível fazer upload da imagem, mas seu pedido será enviado mesmo assim.",
        variant: "destructive",
      });
      return null;
    } else if (imageData) {
      return imageData.path;
    }
    
    return null;
  } catch (imageUploadError) {
    console.error("Falha no upload da imagem:", imageUploadError);
    // Não interromper o fluxo principal
    toast({
      title: "Alerta",
      description: "Não foi possível fazer upload da imagem, mas seu pedido será enviado mesmo assim.",
      variant: "destructive",
    });
    return null;
  }
}
