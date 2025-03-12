
import { useUserAuth } from "./useUserAuth";
import { useMusicRequests } from "./useMusicRequests";
import { useRequestStatus } from "./useRequestStatus";
import { useEffect } from "react";

export const useDashboard = () => {
  const { userProfile, handleUserLogout } = useUserAuth();
  
  const {
    userRequests,
    currentProgress,
    showNewRequestForm,
    isLoading,
    handleRequestSubmitted,
    handleCreateNewRequest,
    fetchUserRequests
  } = useMusicRequests(userProfile);
  
  const {
    hasCompletedRequest,
    hasPreviewUrl,
    hasAnyRequest,
    hasPaidRequest
  } = useRequestStatus(userRequests);

  // Atualizar os dados quando o dashboard é carregado e periodicamente
  useEffect(() => {
    // Buscar dados imediatamente
    fetchUserRequests();
    
    // Atualizar a cada 2 segundos para garantir sincronização
    const intervalId = setInterval(fetchUserRequests, 2000);
    
    return () => clearInterval(intervalId);
  }, [fetchUserRequests]);

  return {
    userProfile,
    userRequests,
    currentProgress,
    showNewRequestForm,
    isLoading,
    hasCompletedRequest,
    hasPreviewUrl,
    hasAnyRequest,
    hasPaidRequest,
    handleRequestSubmitted,
    handleCreateNewRequest,
    handleUserLogout
  };
};
