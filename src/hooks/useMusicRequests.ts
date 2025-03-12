
import { useState, useEffect, useCallback } from "react";
import { MusicRequest, UserProfile } from "@/types/database.types";
import supabase from "@/lib/supabase";

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
        } else {
          setCurrentProgress(10);
          setShowNewRequestForm(true);
        }
      }
    } catch (error) {
      console.error('Error fetching music requests:', error);
      setCurrentProgress(10);
    } finally {
      setIsLoading(false);
    }
  }, [userProfile]);

  // Função para checar atualizações em tempo real
  const setupRealtimeSubscription = useCallback(() => {
    if (!userProfile?.id) return null;
    
    console.log('[useMusicRequests] Configurando assinatura em tempo real para:', userProfile.id);
    
    const channel = supabase
      .channel('music_requests_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'music_requests',
        filter: `user_id=eq.${userProfile.id}`
      }, (payload) => {
        console.log('[useMusicRequests] Mudança detectada:', payload);
        fetchUserRequests();
      })
      .subscribe();
    
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

  // Configurar assinatura em tempo real
  useEffect(() => {
    const channel = setupRealtimeSubscription();
    
    // Também vamos manter a verificação regular para garantir
    const intervalId = setInterval(fetchUserRequests, 10000);
    
    return () => {
      if (channel) {
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
