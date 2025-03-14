
import { useEffect } from "react";
import { UserProfile } from "@/types/database.types";
import { useRequestsState } from "./music-requests/useRequestsState";
import { useFetchRequests } from "./music-requests/useFetchRequests";
import { useRequestSubmission } from "./music-requests/useRequestSubmission";
import { useStateConsistency } from "./music-requests/useStateConsistency";
import { useRealtimeSubscription } from "./music-requests/useRealtimeSubscription";

/**
 * Hook principal para gerenciar pedidos de música
 */
export const useMusicRequests = (userProfile: UserProfile | null) => {
  // Gerenciamento de estado
  const {
    userRequests,
    setUserRequests,
    currentProgress,
    setCurrentProgress,
    isLoading,
    setIsLoading,
    showNewRequestForm,
    setShowNewRequestForm,
    isFirstLoadRef,
    isFetchingRef,
    lastDataHashRef,
    formSubmissionInProgressRef,
    forceUpdateRef,
    initialStateCheckedRef,
    forceUpdate
  } = useRequestsState(userProfile);

  // Gerenciamento de fetching
  const { fetchUserRequests, checkInitialState } = useFetchRequests({
    userProfile,
    setUserRequests,
    setCurrentProgress,
    setIsLoading,
    setShowNewRequestForm,
    isFirstLoadRef,
    isFetchingRef,
    lastDataHashRef,
    formSubmissionInProgressRef,
    initialStateCheckedRef
  });

  // Gerenciamento de submissão
  const { 
    handleRequestSubmitted, 
    handleCreateNewRequest, 
    handleCancelRequestForm 
  } = useRequestSubmission({
    setUserRequests,
    setShowNewRequestForm,
    setCurrentProgress,
    formSubmissionInProgressRef,
    fetchUserRequests
  });

  // Verificação de consistência de estado
  useStateConsistency({
    userRequests,
    showNewRequestForm,
    formSubmissionInProgressRef,
    initialStateCheckedRef,
    setShowNewRequestForm
  });

  // Gerenciamento de assinaturas em tempo real
  useRealtimeSubscription({
    userProfile,
    fetchUserRequests,
    forceUpdateRef
  });

  // Verificação inicial explícita para definir corretamente o estado do formulário
  useEffect(() => {
    if (!userProfile?.id) return;
    checkInitialState();
  }, [userProfile]);

  return {
    userRequests,
    currentProgress,
    showNewRequestForm,
    isLoading,
    handleRequestSubmitted,
    handleCreateNewRequest,
    handleCancelRequestForm,
    fetchUserRequests,
    setUserRequests,
    setShowNewRequestForm
  };
};
