
import { useState, useRef } from "react";
import { MusicRequest, UserProfile } from "@/types/database.types";

/**
 * Hook para gerenciar o estado interno dos pedidos de música
 */
export const useRequestsState = (userProfile: UserProfile | null) => {
  // Estado principal
  const [userRequests, setUserRequests] = useState<MusicRequest[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  
  // Referências para controle de estado interno
  const isFirstLoadRef = useRef(true);
  const isFetchingRef = useRef(false);
  const lastDataHashRef = useRef("");
  const formSubmissionInProgressRef = useRef(false);
  const forceUpdateRef = useRef(0);
  const initialStateCheckedRef = useRef(false);
  
  return {
    // Estados
    userRequests,
    setUserRequests,
    currentProgress,
    setCurrentProgress,
    isLoading,
    setIsLoading,
    showNewRequestForm,
    setShowNewRequestForm,
    
    // Refs
    isFirstLoadRef,
    isFetchingRef,
    lastDataHashRef,
    formSubmissionInProgressRef,
    forceUpdateRef,
    initialStateCheckedRef,
    
    // Utilitário para forçar atualização
    forceUpdate: () => forceUpdateRef.current++
  };
};
