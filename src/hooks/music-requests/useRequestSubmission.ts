
import { MusicRequest } from "@/types/database.types";
import { toast } from "@/hooks/use-toast";

interface RequestSubmissionProps {
  setUserRequests: (requests: MusicRequest[]) => void;
  setShowNewRequestForm: (show: boolean) => void;
  setCurrentProgress: (progress: number) => void;
  formSubmissionInProgressRef: React.MutableRefObject<boolean>;
  fetchUserRequests: () => Promise<void>;
}

/**
 * Hook para gerenciar a submissão de pedidos
 */
export const useRequestSubmission = ({
  setUserRequests,
  setShowNewRequestForm,
  setCurrentProgress,
  formSubmissionInProgressRef,
  fetchUserRequests
}: RequestSubmissionProps) => {
  
  /**
   * Manipula a submissão de um novo pedido
   */
  const handleRequestSubmitted = (data: MusicRequest[]) => {
    console.log('[useMusicRequests] Pedido enviado, atualizando estado:', data);
    
    // CORREÇÃO CRÍTICA: Marcar que estamos em processo de submissão
    formSubmissionInProgressRef.current = true;
    
    // CORREÇÃO CRÍTICA: Ocultar o formulário imediatamente
    setShowNewRequestForm(false);
    
    // Verificar se temos dados válidos
    if (!Array.isArray(data) || data.length === 0) {
      console.error('[useMusicRequests] Dados recebidos inválidos:', data);
      return;
    }
    
    // CORREÇÃO CRÍTICA: Definir diretamente os pedidos do usuário com os novos dados
    // Ao invés de concatenar, substituir completamente para garantir consistência
    setUserRequests(data);
    
    // Atualizar o progresso
    setCurrentProgress(25);
    
    // CORREÇÃO CRÍTICA: Melhorar sequência de verificações para garantir a sincronização
    const scheduleVerifications = () => {
      // Forçar busca imediata
      fetchUserRequests();
      
      // Verificações adicionais com temporizadores mais curtos
      setTimeout(() => {
        console.log('[useMusicRequests] Verificação após 500ms');
        formSubmissionInProgressRef.current = false; // Liberar a flag
        fetchUserRequests();
      }, 500);
      
      setTimeout(() => {
        console.log('[useMusicRequests] Verificação após 1500ms');
        fetchUserRequests();
      }, 1500);
      
      setTimeout(() => {
        console.log('[useMusicRequests] Verificação final após 3000ms');
        fetchUserRequests();
      }, 3000);
    };
    
    // Iniciar sequência de verificações
    scheduleVerifications();
  };

  /**
   * Manipula o botão para criar um novo pedido
   */
  const handleCreateNewRequest = () => {
    formSubmissionInProgressRef.current = false;
    setShowNewRequestForm(true);
  };

  /**
   * Manipula o cancelamento do formulário de pedido
   */
  const handleCancelRequestForm = () => {
    setShowNewRequestForm(false);
    
    toast({
      title: "Pedido cancelado",
      description: "Você cancelou a criação do pedido de música.",
    });
  };

  return {
    handleRequestSubmitted,
    handleCreateNewRequest,
    handleCancelRequestForm
  };
};
