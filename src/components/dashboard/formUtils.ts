
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
    // Log do processo para ajudar na depuração
    console.log("Iniciando processo de envio de pedido de música");
    console.log("Perfil do usuário:", userProfile);
    console.log("Valores do formulário:", values);
    
    // Tratamento para modo de desenvolvimento
    const userId = userProfile.id === 'dev-user-id' ? uuidv4() : userProfile.id;
    console.log("Usando ID de usuário:", userId);
    
    let coverUrl = null;
    
    // Bloco de upload de imagem com tratamento de erro adequado
    if (coverImage) {
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
        } else {
          coverUrl = imageData?.path;
          console.log("Upload da imagem bem-sucedido:", coverUrl);
        }
      } catch (imageUploadError) {
        console.error("Falha no upload da imagem:", imageUploadError);
        // Não interromper o fluxo principal
        toast({
          title: "Alerta",
          description: "Não foi possível fazer upload da imagem, mas seu pedido será enviado mesmo assim.",
          variant: "destructive",
        });
      }
    }
    
    console.log("Preparando dados do pedido");
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
    
    console.log("Enviando pedido para o banco de dados:", newRequest);
    
    // Verificação de conectividade antes de enviar
    if (!navigator.onLine) {
      throw new Error("Você está offline. Por favor, conecte-se à internet e tente novamente.");
    }
    
    // Tentativa de inserção com tempo limite
    const insertPromise = supabase
      .from('music_requests')
      .insert([newRequest])
      .select();
      
    // Adicionando timeout para evitar espera indefinida
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("O tempo de conexão expirou. Tente novamente.")), 30000);
    });
    
    const { data, error } = await Promise.race([insertPromise, timeoutPromise])
      .then(result => result as Awaited<ReturnType<typeof insertPromise>>);
      
    if (error) {
      console.error("Erro no banco de dados durante a inserção:", error);
      throw new Error(`Erro ao salvar no banco de dados: ${error.message}`);
    }
    
    console.log("Pedido enviado com sucesso:", data);
    return data || [];
    
  } catch (error) {
    console.error('Erro ao enviar pedido de música:', error);
    
    // Melhoria no tratamento e detalhamento de erros
    let errorMessage = "Ocorreu um erro ao enviar seu pedido.";
    let errorType = "unknown";
    
    if (error.message) {
      console.log("Mensagem de erro:", error.message);
      
      if (error.message.includes("network") || 
          error.message.includes("Failed to fetch") || 
          error.message.includes("NetworkError") || 
          error.message.includes("offline") ||
          error.message.includes("connection") ||
          !navigator.onLine) {
        errorMessage = "Problema de conexão detectado. Verifique sua internet e tente novamente.";
        errorType = "network";
      } else if (error.message.includes("timeout") || error.message.includes("expirou")) {
        errorMessage = "A conexão com o servidor demorou muito. Tente novamente.";
        errorType = "timeout";
      } else if (error.code) {
        errorMessage += ` (Código: ${error.code})`;
        errorType = error.code;
      }
    }
    
    console.error("Erro detalhado:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
      type: errorType
    });
    
    // Incluir o tipo de erro no objeto de erro para tratamento específico na interface
    const enhancedError = new Error(errorMessage);
    enhancedError.type = errorType;
    
    // Relançar para ser tratado pelo componente
    throw enhancedError;
  }
}
