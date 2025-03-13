
import { toast } from "@/hooks/use-toast";

// Interface para erros customizados
export interface EnhancedError extends Error {
  type?: string;
  code?: string;
  details?: string;
  handled?: boolean;
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
  let errorDetails = "";
  
  if (err.message) {
    console.log("Mensagem de erro:", err.message);
    
    // Detectar tipo de erro com base na mensagem e propriedades
    if (err.type === "network" || 
        err.message.includes("network") || 
        err.message.includes("Failed to fetch") || 
        err.message.includes("NetworkError") || 
        err.message.includes("offline") ||
        err.message.includes("connection") ||
        !navigator.onLine) {
      errorMessage = "Problema de conexão detectado. Verifique sua internet e tente novamente.";
      errorType = "network";
      errorDetails = "Verifique sua conexão com a internet ou tente usar uma rede diferente.";
    } else if (err.type === "timeout" || 
               err.message.includes("timeout") || 
               err.message.includes("expirou") ||
               err.message.includes("demorou")) {
      errorMessage = "A conexão com o servidor demorou muito. Tente novamente.";
      errorType = "timeout";
      errorDetails = "O servidor pode estar sobrecarregado ou sua conexão pode estar instável.";
    } else if (err.type === "validation" ||
               err.message.includes("obrigatórios") ||
               err.message.includes("inválido")) {
      errorMessage = err.message;
      errorType = "validation";
      errorDetails = "Verifique todos os campos do formulário e tente novamente.";
    } else if (err.message.includes("permission") || 
               err.message.includes("policy") ||
               err.message.includes("unauthorized") ||
               err.message.includes("Unauthorized") ||
               err.message.includes("401")) {
      errorMessage = "Problema de permissão. Por favor, faça login novamente e tente enviar seu pedido.";
      errorType = "permission";
      errorDetails = "Sua sessão pode ter expirado. Faça logout e login novamente.";
    } else if (err.code) {
      if (err.code.includes("23505")) {
        errorMessage = "Você já enviou um pedido similar. Verifique seus pedidos existentes.";
        errorType = "duplicate";
      } else {
        errorMessage += ` (Código: ${err.code})`;
        errorType = err.code;
      }
    }
  }
  
  console.error("Erro detalhado:", {
    message: err.message,
    code: err.code,
    type: errorType,
    details: errorDetails,
    stack: err.stack
  });
  
  // Incluir o tipo de erro no objeto de erro para tratamento específico na interface
  const enhancedError = new Error(errorMessage) as EnhancedError;
  enhancedError.type = errorType;
  enhancedError.details = errorDetails;
  enhancedError.code = err.code;
  
  return enhancedError;
}

/**
 * Exibe um toast de erro com a mensagem apropriada
 */
export function showErrorToast(error: EnhancedError): void {
  let variant: "default" | "destructive" = "destructive";
  
  // Para erros de validação, podemos usar um estilo menos agressivo
  if (error.type === "validation") {
    variant = "default";
  }
  
  toast({
    title: getErrorTitle(error),
    description: error.message + (error.details ? `\n${error.details}` : ""),
    variant: variant,
  });
}

/**
 * Retorna um título apropriado baseado no tipo de erro
 */
function getErrorTitle(error: EnhancedError): string {
  switch (error.type) {
    case "network":
      return "Problema de conexão";
    case "timeout":
      return "Tempo limite excedido";
    case "permission":
      return "Acesso negado";
    case "validation":
      return "Dados inválidos";
    case "duplicate":
      return "Pedido duplicado";
    default:
      return "Erro ao enviar pedido";
  }
}
