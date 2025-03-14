
import { MusicRequest } from "@/types/database.types";

/**
 * Cria um hash dos dados para comparação
 */
export const hashData = (data: any): string => {
  try {
    return JSON.stringify(data);
  } catch (e) {
    return "";
  }
};

/**
 * Determina o progresso com base no status do pedido mais recente
 */
export const determineProgress = (request: MusicRequest | undefined): number => {
  if (!request) return 10;
  
  switch (request.status) {
    case 'pending':
      return 25;
    case 'in_production':
      return 50;
    case 'completed':
      return 100;
    default:
      return 10;
  }
};
