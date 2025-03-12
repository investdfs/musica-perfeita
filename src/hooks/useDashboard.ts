
import { useUserAuth } from "./useUserAuth";
import { useMusicRequests } from "./useMusicRequests";
import { useRequestStatus } from "./useRequestStatus";
import { useEffect, useCallback, useRef } from "react";
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

  // Referência para rastrear se já configuramos o listener
  const realtimeChannelRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const lastFetchTimeRef = useRef(0);
  const MIN_FETCH_INTERVAL = 5000; // 5 segundos entre fetchs para evitar piscar

  // Função para configurar escuta em tempo real
  const setupRealtimeListener = useCallback(() => {
    if (!userProfile?.id) return () => {};
    
    // Evitar múltiplas inscrições
    if (realtimeChannelRef.current) {
      return () => {};
    }
    
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
        
        // Verificar se passou tempo mínimo desde o último fetch
        const now = Date.now();
        if (now - lastFetchTimeRef.current > MIN_FETCH_INTERVAL) {
          fetchUserRequests();
          lastFetchTimeRef.current = now;
        } else {
          console.log('[useDashboard] Ignorando fetch frequente demais');
        }
      })
      .subscribe((status) => {
        console.log(`[useDashboard] Status da inscrição em tempo real: ${status}`);
      });
    
    realtimeChannelRef.current = channel;
    
    return () => {
      console.log('[useDashboard] Removendo canal de tempo real');
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
        realtimeChannelRef.current = null;
      }
    };
  }, [userProfile, fetchUserRequests]);

  // Atualizar os dados quando o dashboard é carregado e periodicamente
  useEffect(() => {
    // Buscar dados imediatamente na primeira carga
    const now = Date.now();
    fetchUserRequests();
    lastFetchTimeRef.current = now;
    
    // Configurar escuta em tempo real
    const cleanupRealtimeListener = setupRealtimeListener();
    
    // Polling com intervalo maior (10 segundos) para reduzir "flickering"
    pollingIntervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      if (currentTime - lastFetchTimeRef.current > MIN_FETCH_INTERVAL) {
        console.log('[useDashboard] Atualizando dados via polling');
        fetchUserRequests();
        lastFetchTimeRef.current = currentTime;
      }
    }, 10000); // 10 segundos
    
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
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
