
import { toast } from "@/hooks/use-toast";

// Interface para erros customizados
export interface EnhancedError extends Error {
  type?: string;
  code?: string;
}

/**
 * Processa erros e retorna mensagens formatadas baseadas no tipo de erro
 */
export function processError(error: unknown): EnhancedError {
  console.error('Erro processado:', error);
  
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
    } else if (err.message.includes("permission") || err.message.includes("policy")) {
      errorMessage = "Problema de permissão. Por favor, faça login novamente e tente enviar seu pedido.";
      errorType = "permission";
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
  
  return enhancedError;
}

/**
 * Exibe um toast de erro com a mensagem apropriada
 */
export function showErrorToast(error: EnhancedError): void {
  toast({
    title: "Erro ao enviar pedido",
    description: error.message,
    variant: "destructive",
  });
}
