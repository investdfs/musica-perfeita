
import { useState, useEffect, useCallback } from "react";
import { MusicRequest, UserProfile } from "@/types/database.types";
import supabase from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export const useMusicRequests = (userProfile: UserProfile | null) => {
  const [userRequests, setUserRequests] = useState<MusicRequest[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);

  const fetchUserRequests = useCallback(async () => {
    try {
      if (!userProfile?.id) return;
      
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('music_requests')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        console.log('[useMusicRequests] Dados atualizados:', data);
        setUserRequests(data);
        
        if (data.length > 0) {
          const latestRequest = data[0];
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
          
          // Se houver um pedido e não houver prévia, mostrar o formulário
          if (!latestRequest.preview_url && !latestRequest.full_song_url) {
            setShowNewRequestForm(false);
          } else {
            setShowNewRequestForm(false);
          }
        } else {
          setCurrentProgress(10);
          setShowNewRequestForm(true);
        }
      }
    } catch (error) {
      console.error('Error fetching music requests:', error);
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

  // Função para configurar assinatura em tempo real de forma mais robusta
  const setupRealtimeSubscription = useCallback(() => {
    if (!userProfile?.id) return null;
    
    console.log('[useMusicRequests] Configurando assinatura em tempo real para:', userProfile.id);
    
    // Usando o novo formato de canal do Supabase
    const channel = supabase
      .channel(`music_requests_${userProfile.id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'music_requests',
        filter: `user_id=eq.${userProfile.id}`
      }, (payload) => {
        console.log('[useMusicRequests] Mudança em tempo real detectada:', payload);
        
        // Atualizar os dados imediatamente após uma mudança
        fetchUserRequests();
      })
      .subscribe((status) => {
        console.log(`[useMusicRequests] Status da assinatura: ${status}`);
        if (status !== 'SUBSCRIBED') {
          console.warn('[useMusicRequests] Falha na assinatura em tempo real. Voltando para polling.');
        }
      });
    
    return channel;
  }, [userProfile, fetchUserRequests]);

  const handleRequestSubmitted = (data: MusicRequest[]) => {
    setUserRequests([...data, ...userRequests]);
    setCurrentProgress(25);
    setShowNewRequestForm(false);
  };

  const handleCreateNewRequest = () => {
    setShowNewRequestForm(true);
  };

  // Buscar dados iniciais quando o componente for montado
  useEffect(() => {
    if (userProfile) {
      fetchUserRequests();
    }
  }, [userProfile, fetchUserRequests]);

  // Configurar assinatura em tempo real e polling de backup
  useEffect(() => {
    const channel = setupRealtimeSubscription();
    
    // Também vamos manter a verificação regular para garantir a sincronização
    // Reduzindo para 3 segundos para uma experiência mais responsiva
    const intervalId = setInterval(fetchUserRequests, 3000);
    
    return () => {
      if (channel) {
        console.log('[useMusicRequests] Removendo canal de tempo real');
        supabase.removeChannel(channel);
      }
      clearInterval(intervalId);
    };
  }, [userProfile, fetchUserRequests, setupRealtimeSubscription]);

  return {
    userRequests,
    currentProgress,
    showNewRequestForm,
    isLoading,
    handleRequestSubmitted,
    handleCreateNewRequest,
    fetchUserRequests
  };
};
