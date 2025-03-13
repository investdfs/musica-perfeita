
import { MusicRequest } from "@/types/database.types";

export const useRequestStatus = (userRequests: MusicRequest[]) => {
  // Verificar se temos qualquer pedido
  const hasAnyRequest = userRequests.length > 0;
  
  // Verificar se o pedido mais recente está completo
  const hasCompletedRequest = hasAnyRequest && userRequests[0].status === 'completed';
  
  // Verificar se o pedido mais recente tem uma URL de prévia
  const hasPreviewUrl = hasAnyRequest && !!userRequests[0].preview_url;
  
  // Verificar se o pedido mais recente foi pago
  const hasPaidRequest = hasAnyRequest && userRequests[0].payment_status === 'completed';

  // Verificações adicionais para garantir consistência
  if (hasCompletedRequest && !hasPreviewUrl) {
    console.warn('Inconsistência detectada: Pedido marcado como concluído, mas sem URL de prévia');
  }

  return {
    hasCompletedRequest,
    hasPreviewUrl,
    hasAnyRequest,
    hasPaidRequest
  };
};
