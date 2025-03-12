
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
      
      console.log('[useMusicRequests] Buscando pedidos para o usuário:', userProfile.id);
      
      const { data, error } = await supabase
        .from('music_requests')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('[useMusicRequests] Erro ao buscar pedidos:', error);
        throw error;
      }
      
      if (data) {
        console.log('[useMusicRequests] Dados atualizados:', data);
        
        // Verificar se os dados são realmente diferentes antes de atualizar o estado
        const currentDataJson = JSON.stringify(userRequests);
        const newDataJson = JSON.stringify(data);
        
        if (currentDataJson !== newDataJson) {
          console.log('[useMusicRequests] Atualizando estado com novos dados');
          setUserRequests(data);
          
          if (data.length > 0) {
            const latestRequest = data[0];
            console.log('[useMusicRequests] Pedido mais recente:', latestRequest);
            
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
            
            // Se houver um pedido e não houver prévia, não mostrar o formulário
            if (!latestRequest.preview_url && !latestRequest.full_song_url) {
              setShowNewRequestForm(false);
            } else {
              setShowNewRequestForm(false);
            }
          } else {
            setCurrentProgress(10);
            setShowNewRequestForm(true);
          }
        } else {
          console.log('[useMusicRequests] Os dados são iguais, não é necessário atualizar o estado');
        }
      }
    } catch (error) {
      console.error('[useMusicRequests] Erro ao buscar pedidos de música:', error);
      toast({
        title: "Erro ao carregar pedidos",
        description: "Não foi possível carregar seus pedidos. Tente novamente mais tarde.",
        variant: "destructive",
      });
      setCurrentProgress(10);
    } finally {
      setIsLoading(false);
    }
  }, [userProfile, userRequests]);

  const handleRequestSubmitted = (data: MusicRequest[]) => {
    console.log('[useMusicRequests] Pedido enviado, atualizando estado:', data);
    setUserRequests([...data, ...userRequests]);
    setCurrentProgress(25);
    setShowNewRequestForm(false);
  };

  const handleCreateNewRequest = () => {
    setShowNewRequestForm(true);
  };

  return {
    userRequests,
    currentProgress,
    showNewRequestForm,
    isLoading,
    handleRequestSubmitted,
    handleCreateNewRequest,
    fetchUserRequests,
    setUserRequests
  };
};
