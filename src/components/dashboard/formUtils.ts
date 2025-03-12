
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";
import { MusicRequestFormValues } from "./formSchema";
import { UserProfile } from "@/types/database.types";
import { v4 as uuidv4 } from "uuid";

// Interface para erros customizados
interface EnhancedError extends Error {
  type?: string;
  code?: string;
}

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
    
    if (!userProfile?.id) {
      throw new Error("Perfil de usuário inválido. Tente fazer login novamente.");
    }
    
    // Tratamento para modo de desenvolvimento
    const userId = userProfile.id === 'dev-user-id' ? uuidv4() : userProfile.id;
    console.log("Usando ID de usuário:", userId);
    
    let coverUrl = null;
    
    // Verificação de conectividade antes de enviar
    if (!navigator.onLine) {
      throw Object.assign(new Error("Você está offline. Por favor, conecte-se à internet e tente novamente."), {
        type: "network"
      });
    }
    
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
        } else if (imageData) {
          coverUrl = imageData.path;
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
      payment_status: 'pending',
      music_focus: values.music_focus || null,
      happy_memory: values.happy_memory || null,
      sad_memory: values.sad_memory || null
    };
    
    console.log("Enviando pedido para o banco de dados:", newRequest);
    
    // Usando AbortController para implementar um timeout na requisição
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // Aumentando para 45 segundos
    
    try {
      // Tentar várias vezes com backoff exponencial
      const maxRetries = 3;
      let retryCount = 0;
      let lastError = null;
      
      while (retryCount < maxRetries) {
        try {
          const { data, error } = await supabase
            .from('music_requests')
            .insert([newRequest])
            .select();
          
          if (error) {
            throw error;
          }
          
          clearTimeout(timeoutId);
          console.log("Pedido enviado com sucesso:", data);
          return data || [];
        } catch (err) {
          lastError = err;
          retryCount++;
          console.log(`Tentativa ${retryCount} falhou. Tentando novamente em ${retryCount * 2}s...`);
          
          if (retryCount < maxRetries) {
            // Esperar antes de tentar novamente (backoff exponencial)
            await new Promise(resolve => setTimeout(resolve, retryCount * 2000));
          }
        }
      }
      
      // Se chegou aqui, todas as tentativas falharam
      clearTimeout(timeoutId);
      throw lastError;
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        throw Object.assign(new Error("A conexão com o servidor demorou muito. Tente novamente."), {
          type: "timeout"
        });
      }
      
      // Verificar se é um erro de conexão
      if (fetchError.message?.includes('fetch') || !navigator.onLine) {
        throw Object.assign(new Error("Problema de conexão detectado. Verifique sua internet e tente novamente."), {
          type: "network"
        });
      }
      
      throw fetchError;
    }
    
  } catch (error) {
    console.error('Erro ao enviar pedido de música:', error);
    
    // Convertemos o erro para o tipo EnhancedError
    const err = error as EnhancedError;
    
    // Melhoria no tratamento e detalhamento de erros
    let errorMessage = "Ocorreu um erro ao enviar seu pedido.";
    let errorType = "unknown";
    
    if (err.message) {
      console.log("Mensagem de erro:", err.message);
      
      if (err.message.includes("network") || 
          err.message.includes("Failed to fetch") || 
          err.message.includes("NetworkError") || 
          err.message.includes("offline") ||
          err.message.includes("connection") ||
          !navigator.onLine) {
        errorMessage = "Problema de conexão detectado. Verifique sua internet e tente novamente.";
        errorType = "network";
      } else if (err.message.includes("timeout") || err.message.includes("expirou")) {
        errorMessage = "A conexão com o servidor demorou muito. Tente novamente.";
        errorType = "timeout";
      } else if (err.code) {
        errorMessage += ` (Código: ${err.code})`;
        errorType = err.code;
      }
    }
    
    console.error("Erro detalhado:", {
      message: err.message,
      code: err.code,
      stack: err.stack,
      type: errorType
    });
    
    // Incluir o tipo de erro no objeto de erro para tratamento específico na interface
    const enhancedError = new Error(errorMessage) as EnhancedError;
    enhancedError.type = errorType;
    
    // Relançar para ser tratado pelo componente
    throw enhancedError;
  }
}
