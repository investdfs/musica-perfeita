
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
  const lastDataHashRef = useRef("");
  const formSubmissionInProgressRef = useRef(false);

  // Função utilitária para criar hash dos dados para comparação
  const hashData = (data: any) => {
    try {
      return JSON.stringify(data);
    } catch (e) {
      return "";
    }
  };

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
        
        // Verificar se os dados são realmente diferentes usando hash
        const newDataHash = hashData(data);
        
        if (newDataHash !== lastDataHashRef.current) {
          console.log('[useMusicRequests] Dados diferentes detectados, atualizando estado');
          lastDataHashRef.current = newDataHash;
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
            
            // Se houver um pedido, não mostrar o formulário
            if (data.length > 0) {
              console.log('[useMusicRequests] Pedidos encontrados, ocultando formulário');
              setShowNewRequestForm(false);
            } else {
              console.log('[useMusicRequests] Nenhum pedido encontrado, mostrando formulário');
              setShowNewRequestForm(true);
            }
          } else {
            setCurrentProgress(10);
            // Apenas mostrar o formulário se não estiver em processo de submissão
            if (!formSubmissionInProgressRef.current) {
              setShowNewRequestForm(true);
            }
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
  }, [userProfile]);

  const handleRequestSubmitted = (data: MusicRequest[]) => {
    console.log('[useMusicRequests] Pedido enviado, atualizando estado:', data);
    
    // Marcar que estamos em processo de submissão para evitar que o formulário reapareça
    formSubmissionInProgressRef.current = true;
    
    // Verificar se temos dados válidos
    if (!Array.isArray(data) || data.length === 0) {
      console.error('[useMusicRequests] Dados recebidos inválidos:', data);
      return;
    }
    
    // Verificar duplicações
    const newRequestId = data[0]?.id;
    const isDuplicate = userRequests.some(r => r.id === newRequestId);
    
    if (isDuplicate) {
      console.log('[useMusicRequests] Pedido duplicado, ignorando:', newRequestId);
      return;
    }
    
    // Atualizar a lista de pedidos e garantir que o formulário fique oculto
    setUserRequests(prevRequests => [...data, ...prevRequests]);
    setCurrentProgress(25);
    setShowNewRequestForm(false);
    
    // Atualizar o hash para evitar problemas com atualizações duplicadas
    lastDataHashRef.current = hashData([...data, ...userRequests]);
  };

  const handleCreateNewRequest = () => {
    formSubmissionInProgressRef.current = false;
    setShowNewRequestForm(true);
  };

  // Configurar canal em tempo real para atualizações de pedidos
  useEffect(() => {
    if (!userProfile?.id) return;
    
    console.log('[useMusicRequests] Configurando canal em tempo real para atualizações de pedidos');
    
    const channel = supabase
      .channel(`user-requests-updates-${userProfile.id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'music_requests',
        filter: `user_id=eq.${userProfile.id}`
      }, payload => {
        console.log('[useMusicRequests] Atualização recebida via real-time:', payload);
        fetchUserRequests();
      })
      .subscribe((status) => {
        console.log(`[useMusicRequests] Status do canal: ${status}`);
      });
    
    // Fazer fetch inicial
    fetchUserRequests();
    
    // Configurar intervalos menos frequentes de polling como fallback
    const intervalId = setInterval(() => {
      console.log('[useMusicRequests] Executando polling periódico');
      fetchUserRequests();
    }, 30000); // A cada 30 segundos
    
    return () => {
      console.log('[useMusicRequests] Limpando assinaturas e intervalos');
      supabase.removeChannel(channel);
      clearInterval(intervalId);
    };
  }, [userProfile, fetchUserRequests]);

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
