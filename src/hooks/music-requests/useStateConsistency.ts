
import { useEffect } from "react";
import { MusicRequest } from "@/types/database.types";

interface StateConsistencyProps {
  userRequests: MusicRequest[];
  showNewRequestForm: boolean;
  formSubmissionInProgressRef: React.MutableRefObject<boolean>;
  initialStateCheckedRef: React.MutableRefObject<boolean>;
  setShowNewRequestForm: (show: boolean) => void;
}

/**
 * Hook para verificar e manter a consistência do estado
 */
export const useStateConsistency = ({
  userRequests,
  showNewRequestForm,
  formSubmissionInProgressRef,
  initialStateCheckedRef,
  setShowNewRequestForm
}: StateConsistencyProps) => {
  
  /**
   * Verifica se o estado atual é consistente
   */
  const checkConsistency = () => {
    // Se temos pedidos mas o formulário está visível, isso é inconsistente
    if (userRequests.length > 0 && showNewRequestForm && !formSubmissionInProgressRef.current) {
      console.log('[useMusicRequests] INCONSISTÊNCIA DETECTADA: Temos pedidos mas o formulário está visível');
      setShowNewRequestForm(false);
    }
    
    // Se não temos pedidos, não estamos em submissão, e o formulário está oculto, isso também é inconsistente
    if (userRequests.length === 0 && !formSubmissionInProgressRef.current && !showNewRequestForm) {
      console.log('[useMusicRequests] INCONSISTÊNCIA DETECTADA: Sem pedidos, sem submissão em andamento, mas o formulário está oculto');
      setShowNewRequestForm(true);
    }
    
    // Se estamos em submissão, o formulário deve estar oculto
    if (formSubmissionInProgressRef.current && showNewRequestForm) {
      console.log('[useMusicRequests] INCONSISTÊNCIA DETECTADA: Em submissão mas o formulário está visível');
      setShowNewRequestForm(false);
    }
  };

  useEffect(() => {
    if (!initialStateCheckedRef.current) return;
    
    // Verificar imediatamente
    checkConsistency();
    
    // E configurar verificação periódica
    const consistencyInterval = setInterval(checkConsistency, 2000);
    
    return () => {
      clearInterval(consistencyInterval);
    };
  }, [userRequests, showNewRequestForm]);
};
