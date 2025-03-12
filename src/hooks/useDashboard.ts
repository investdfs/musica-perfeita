
import { useUserAuth } from "./useUserAuth";
import { useMusicRequests } from "./useMusicRequests";
import { useRequestStatus } from "./useRequestStatus";
import { useEffect, useCallback } from "react";
import supabase from "@/lib/supabase";

export const useDashboard = () => {
  const { userProfile, handleUserLogout } = useUserAuth();
  
  const {
    userRequests,
    currentProgress,
    showNewRequestForm,
    isLoading,
    handleRequestSubmitted,
    handleCreateNewRequest,
    fetchUserRequests,
    setUserRequests
  } = useMusicRequests(userProfile);
  
  const {
    hasCompletedRequest,
    hasPreviewUrl,
    hasAnyRequest,
    hasPaidRequest
  } = useRequestStatus(userRequests);

  // Função para configurar escuta em tempo real
  const setupRealtimeListener = useCallback(() => {
    if (!userProfile?.id) return () => {};
    
    console.log('[useDashboard] Configurando escuta em tempo real para o usuário:', userProfile.id);
    
    // Inscrever-se em mudanças na tabela music_requests filtradas pelo user_id
    const channel = supabase
      .channel(`user-requests-${userProfile.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'music_requests',
        filter: `user_id=eq.${userProfile.id}`
      }, (payload) => {
        console.log('[useDashboard] Mudança detectada via tempo real:', payload);
        
        // Forçar uma atualização imediata quando ocorrer qualquer mudança
        fetchUserRequests();
      })
      .subscribe((status) => {
        console.log(`[useDashboard] Status da inscrição em tempo real: ${status}`);
      });
    
    return () => {
      console.log('[useDashboard] Removendo canal de tempo real');
      supabase.removeChannel(channel);
    };
  }, [userProfile, fetchUserRequests]);

  // Atualizar os dados quando o dashboard é carregado e periodicamente
  useEffect(() => {
    // Buscar dados imediatamente
    fetchUserRequests();
    
    // Configurar escuta em tempo real
    const cleanupRealtimeListener = setupRealtimeListener();
    
    // Também manter polling para garantir que os dados estejam sempre atualizados
    // Usando um intervalo mais curto (1 segundo) para garantir atualizações rápidas
    const intervalId = setInterval(() => {
      console.log('[useDashboard] Atualizando dados via polling');
      fetchUserRequests();
    }, 1000);
    
    return () => {
      clearInterval(intervalId);
      cleanupRealtimeListener();
    };
  }, [fetchUserRequests, setupRealtimeListener]);

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
