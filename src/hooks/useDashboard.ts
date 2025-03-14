
import { useUserAuth } from "./useUserAuth";
import { useState, useEffect, useCallback } from "react";
import { MusicRequest } from "@/types/database.types";
import { useRequestStatus } from "./useRequestStatus";
import supabase from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export const useDashboard = () => {
  const { userProfile, handleUserLogout } = useUserAuth();
  const [userRequests, setUserRequests] = useState<MusicRequest[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    hasCompletedRequest,
    hasPreviewUrl,
    hasAnyRequest,
    hasPaidRequest
  } = useRequestStatus(userRequests);

  // Função para ordenar os pedidos conforme a prioridade especificada
  const sortRequests = (requests: MusicRequest[]): MusicRequest[] => {
    if (!requests || requests.length === 0) return [];
    
    return [...requests].sort((a, b) => {
      // Verificar data de criação para ordenar pedidos do mesmo tipo (mais recentes primeiro)
      const dateComparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      
      // Prioridade 1: Pedidos concluídos pendentes de pagamento
      if (a.status === 'completed' && a.payment_status === 'pending' && 
          b.status !== 'completed' || b.payment_status === 'completed') {
        return -1;
      }
      if (b.status === 'completed' && b.payment_status === 'pending' && 
          a.status !== 'completed' || a.payment_status === 'completed') {
        return 1;
      }
      
      // Prioridade 2: Pedidos não concluídos
      if (a.status !== 'completed' && b.status === 'completed' && b.payment_status === 'completed') {
        return -1;
      }
      if (b.status !== 'completed' && a.status === 'completed' && a.payment_status === 'completed') {
        return 1;
      }
      
      // Prioridade 3: Pedidos concluídos e pagos (por último)
      if (a.status === 'completed' && a.payment_status === 'completed' && 
          b.status === 'completed' && b.payment_status === 'completed') {
        return dateComparison;
      }
      
      // Se todos os critérios de prioridade forem iguais, ordenar por data
      return dateComparison;
    });
  };

  // Função para buscar os pedidos do usuário
  const fetchUserRequests = useCallback(async () => {
    if (!userProfile?.id) return;
    
    setIsLoading(true);
    
    try {
      console.log('[useDashboard] Buscando pedidos para usuário:', userProfile.id);
      
      const { data, error } = await supabase
        .from('music_requests')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      console.log('[useDashboard] Pedidos recebidos:', data);
      
      if (data) {
        // Aplicar a ordenação personalizada
        const sortedRequests = sortRequests(data);
        setUserRequests(sortedRequests);
        
        // Atualizar o progresso com base no pedido mais recente
        if (data.length > 0) {
          const latestRequest = sortedRequests[0];
          
          switch (latestRequest.status) {
            case 'pending':
              setCurrentProgress(25);
              break;
            case 'in_production':
              setCurrentProgress(50);
              break;
            case 'completed':
              setCurrentProgress(100);
              break;
            default:
              setCurrentProgress(0);
          }
          
          // Se o usuário tem pedidos, não mostrar o formulário por padrão
          setShowNewRequestForm(false);
        } else {
          // Se o usuário não tem pedidos, mostrar o formulário
          setShowNewRequestForm(true);
          setCurrentProgress(10);
        }
      }
    } catch (error) {
      console.error('[useDashboard] Erro ao buscar pedidos:', error);
      toast({
        title: "Erro ao carregar pedidos",
        description: "Não foi possível carregar seus pedidos. Tente novamente mais tarde.",
        variant: "destructive",
      });
      setCurrentProgress(10);
    } finally {
      setIsLoading(false);
    }
  }, [userProfile]);

  // Função para lidar com a submissão de um novo pedido
  const handleRequestSubmitted = useCallback((newRequests: MusicRequest[]) => {
    console.log('[useDashboard] Novo pedido recebido:', newRequests);
    
    if (Array.isArray(newRequests) && newRequests.length > 0) {
      // Atualizar a lista de pedidos com o novo pedido
      setUserRequests(prevRequests => {
        // Verificar se o pedido já existe na lista
        const newRequestIds = new Set(newRequests.map(r => r.id));
        const filteredPrevRequests = prevRequests.filter(r => !newRequestIds.has(r.id));
        
        // Combinar os novos pedidos com os existentes e reordenar
        return sortRequests([...newRequests, ...filteredPrevRequests]);
      });
      
      // Atualizar o progresso para 25% (pedido enviado)
      setCurrentProgress(25);
      
      // Fechar o formulário
      setShowNewRequestForm(false);
      
      // Buscar os pedidos atualizados após um breve atraso
      setTimeout(() => {
        fetchUserRequests();
      }, 1000);
    }
  }, [fetchUserRequests]);

  // Função para abrir o formulário de novo pedido
  const handleCreateNewRequest = useCallback(() => {
    setShowNewRequestForm(true);
  }, []);

  // Buscar os pedidos do usuário quando o componente for montado ou o usuário mudar
  useEffect(() => {
    if (userProfile?.id) {
      fetchUserRequests();
      
      // Configurar escuta em tempo real para atualizações
      const channel = supabase
        .channel(`user-requests-${userProfile.id}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'music_requests',
          filter: `user_id=eq.${userProfile.id}`
        }, (payload) => {
          console.log('[useDashboard] Alteração detectada:', payload);
          fetchUserRequests();
        })
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userProfile, fetchUserRequests]);

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
