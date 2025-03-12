
import { useState, useEffect, useCallback, useRef } from "react";
import { MusicRequest, UserProfile } from "@/types/database.types";
import supabase from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export const useMusicRequests = (userProfile: UserProfile | null) => {
  const [userRequests, setUserRequests] = useState<MusicRequest[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const isFirstLoadRef = useRef(true);
  const isFetchingRef = useRef(false);

  const fetchUserRequests = useCallback(async () => {
    // Evitar fetchs concorrentes
    if (isFetchingRef.current) {
      console.log('[useMusicRequests] Já existe um fetch em andamento, ignorando...');
      return;
    }

    try {
      if (!userProfile?.id) return;
      
      isFetchingRef.current = true;
      
      // Na primeira carga, mostrar loading
      if (isFirstLoadRef.current) {
        setIsLoading(true);
      }
      
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
        console.log('[useMusicRequests] Dados recebidos:', data);
        
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
      
      // Só mostrar erro de toast na primeira carga ou em erros persistentes
      if (isFirstLoadRef.current) {
        toast({
          title: "Erro ao carregar pedidos",
          description: "Não foi possível carregar seus pedidos. Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
      
      setCurrentProgress(10);
    } finally {
      // Atualizar referência de primeira carga
      isFirstLoadRef.current = false;
      setIsLoading(false);
      isFetchingRef.current = false;
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
