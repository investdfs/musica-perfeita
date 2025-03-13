
import { useUserAuth } from "./useUserAuth";
import { useMusicRequests } from "./useMusicRequests";
import { useRequestStatus } from "./useRequestStatus";
import { useEffect, useCallback, useRef } from "react";
import supabase from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { MusicRequest } from "@/types/database.types";

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

  // Referências para controle de renderização e atualizações
  const realtimeChannelRef = useRef<any>(null);
  const lastFetchTimeRef = useRef(0);
  const MIN_FETCH_INTERVAL = 3000; // 3 segundos entre fetchs para evitar piscar

  // Verificação periódica de conexão
  useEffect(() => {
    if (!userProfile?.id) return;
    
    // Verificação de dados da sessão a cada minuto
    const checkIntervalId = setInterval(() => {
      const user = localStorage.getItem("musicaperfeita_user");
      if (!user) {
        console.log('[useDashboard] Sessão expirada, redirecionando para login');
        handleUserLogout();
        toast({
          title: "Sessão expirada",
          description: "Sua sessão expirou. Por favor, faça login novamente.",
        });
        clearInterval(checkIntervalId);
      }
    }, 60000);
    
    return () => {
      clearInterval(checkIntervalId);
    };
  }, [userProfile, handleUserLogout]);

  // Função personalizada para lidar com a submissão do pedido
  const handleRequestSubmittedWithFeedback = (data: MusicRequest[]) => {
    console.log('[useDashboard] Pedido submetido, dados:', data);
    
    if (!Array.isArray(data) || data.length === 0) {
      console.error('[useDashboard] Dados de pedido inválidos:', data);
      return;
    }
    
    // Garantir que o formulário fique oculto antes de processar os novos dados
    handleRequestSubmitted(data);
    
    // Forçar uma nova busca de dados para sincronizar o estado
    setTimeout(() => {
      console.log('[useDashboard] Atualizando dados após submissão');
      fetchUserRequests();
    }, 1000);
  };

  // Função para configurar escuta em tempo real
  const setupRealtimeListener = useCallback(() => {
    if (!userProfile?.id) return () => {};
    
    // Evitar múltiplas inscrições
    if (realtimeChannelRef.current) {
      supabase.removeChannel(realtimeChannelRef.current);
    }
    
    console.log('[useDashboard] Configurando escuta em tempo real para o usuário:', userProfile.id);
    
    // Inscrever-se em mudanças na tabela music_requests filtradas pelo user_id
    const channel = supabase
      .channel(`user-requests-${userProfile.id}-${Date.now()}`)
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

  // Atualizar os dados quando o dashboard é carregado
  useEffect(() => {
    // Buscar dados imediatamente na primeira carga
    const now = Date.now();
    fetchUserRequests();
    lastFetchTimeRef.current = now;
    
    // Configurar escuta em tempo real
    const cleanupRealtimeListener = setupRealtimeListener();
    
    // Polling a cada 5 segundos como fallback para escuta em tempo real
    const pollingIntervalId = setInterval(() => {
      const currentTime = Date.now();
      if (currentTime - lastFetchTimeRef.current > MIN_FETCH_INTERVAL) {
        console.log('[useDashboard] Atualizando dados via polling');
        fetchUserRequests();
        lastFetchTimeRef.current = currentTime;
      }
    }, 5000);
    
    return () => {
      clearInterval(pollingIntervalId);
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
    handleRequestSubmitted: handleRequestSubmittedWithFeedback,
    handleCreateNewRequest,
    handleUserLogout
  };
};
