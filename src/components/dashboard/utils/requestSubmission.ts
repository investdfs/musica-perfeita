
import { MusicRequestFormValues } from "../formSchema";
import { UserProfile } from "@/types/database.types";
import { uploadCoverImage } from "./imageUpload";
import { prepareRequestData } from "./requestData";
import { insertMusicRequest } from "./databaseOperations";
import { processError, EnhancedError } from "./errorHandling";

/**
 * Função principal para submeter pedido de música
 */
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
    
    // Verificação de conectividade antes de enviar
    if (!navigator.onLine) {
      throw Object.assign(new Error("Você está offline. Por favor, conecte-se à internet e tente novamente."), {
        type: "network"
      });
    }
    
    // Upload da imagem de capa
    const coverUrl = await uploadCoverImage(coverImage, userProfile.id);
    console.log("Upload da imagem concluído, URL:", coverUrl);
    
    // Preparar os dados do pedido
    console.log("Preparando dados do pedido");
    const newRequest = prepareRequestData(values, userProfile, coverUrl);
    
    // Inserir o pedido no banco de dados
    return await insertMusicRequest(newRequest);
    
  } catch (error) {
    console.error('Erro ao enviar pedido de música:', error);
    
    // Processar o erro e relançar com informações melhoradas
    const enhancedError = processError(error);
    
    // Relançar para ser tratado pelo componente
    throw enhancedError;
  }
}
