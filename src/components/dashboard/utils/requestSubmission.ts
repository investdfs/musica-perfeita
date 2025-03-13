
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
    console.log("[submitMusicRequest] Iniciando processo de envio de pedido de música");
    console.log("[submitMusicRequest] Perfil do usuário:", userProfile);
    console.log("[submitMusicRequest] Valores do formulário:", values);
    
    // Validações iniciais
    if (!userProfile?.id) {
      throw new Error("Perfil de usuário inválido ou sessão expirada. Tente fazer login novamente.");
    }
    
    // Verificação de campos obrigatórios
    if (!values.honoree_name || !values.relationship_type || !values.music_genre || !values.story) {
      throw new Error("Todos os campos obrigatórios devem ser preenchidos.");
    }
    
    // Verificação de conectividade antes de enviar
    if (!navigator.onLine) {
      throw Object.assign(new Error("Você está offline. Por favor, conecte-se à internet e tente novamente."), {
        type: "network"
      });
    }
    
    // Upload da imagem de capa
    let coverUrl = null;
    try {
      if (coverImage) {
        console.log("[submitMusicRequest] Iniciando upload da imagem");
        coverUrl = await uploadCoverImage(coverImage, userProfile.id);
        console.log("[submitMusicRequest] Upload da imagem concluído, URL:", coverUrl);
      }
    } catch (uploadError) {
      console.error("[submitMusicRequest] Erro no upload da imagem:", uploadError);
      // Continuamos mesmo com erro no upload de imagem, mas registramos para depuração
    }
    
    // Preparar os dados do pedido
    console.log("[submitMusicRequest] Preparando dados do pedido");
    const newRequest = prepareRequestData(values, userProfile, coverUrl);
    console.log("[submitMusicRequest] Dados do pedido preparados:", newRequest);
    
    // Definir um timeout para a operação
    const dbPromise = insertMusicRequest(newRequest);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(Object.assign(new Error("A operação demorou muito para ser concluída. Tente novamente."), {
          type: "timeout"
        }));
      }, 30000); // 30 segundos de timeout
    });
    
    // Inserir o pedido no banco de dados com timeout
    console.log("[submitMusicRequest] Enviando pedido para o banco de dados");
    const result = await Promise.race([dbPromise, timeoutPromise]);
    
    console.log("[submitMusicRequest] Resultado da inserção do pedido:", result);
    
    // Garantir que o resultado é um array válido para facilitar o processamento no componente
    if (result && !Array.isArray(result)) {
      console.log("[submitMusicRequest] Convertendo resultado não-array para array");
      return [result];
    }
    
    return result;
    
  } catch (error) {
    console.error('[submitMusicRequest] Erro ao enviar pedido de música:', error);
    
    // Verificar se o erro é relacionado a validação de dados
    if (error instanceof Error && 
        (error.message.includes("obrigatórios") || 
         error.message.includes("inválido"))) {
      const enhancedError = Object.assign(new Error(error.message), {
        type: "validation"
      }) as EnhancedError;
      throw enhancedError;
    }
    
    // Processar o erro e relançar com informações melhoradas
    const enhancedError = processError(error);
    
    // Relançar para ser tratado pelo componente
    throw enhancedError;
  }
}
