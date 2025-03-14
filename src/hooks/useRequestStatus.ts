
import { MusicRequest } from "@/types/database.types";

export const useRequestStatus = (userRequests: MusicRequest[]) => {
  // Verificar se temos qualquer pedido
  const hasAnyRequest = Array.isArray(userRequests) && userRequests.length > 0;
  
  // Obter o pedido mais recente (o primeiro da lista ordenada)
  const latestRequest = hasAnyRequest ? userRequests[0] : null;
  
  // Verificar se o pedido mais recente está completo
  const hasCompletedRequest = hasAnyRequest && latestRequest?.status === 'completed';
  
  // Verificar se o pedido mais recente tem uma URL de prévia
  const hasPreviewUrl = hasAnyRequest && Boolean(latestRequest?.preview_url);
  
  // Verificar se o pedido mais recente foi pago
  const hasPaidRequest = hasAnyRequest && 
                        latestRequest?.status === 'completed' && 
                        latestRequest?.payment_status === 'completed';

  // Verificações adicionais para garantir consistência
  if (hasCompletedRequest && !hasPreviewUrl) {
    console.warn('Inconsistência detectada: Pedido marcado como concluído, mas sem URL de prévia');
  }

  return {
    hasCompletedRequest,
    hasPreviewUrl,
    hasAnyRequest,
    hasPaidRequest,
    latestRequest
  };
};
