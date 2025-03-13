
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
  const forceUpdateRef = useRef(0);

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
        
        // CORREÇÃO CRÍTICA: Garantir que os dados sejam processados corretamente
        if (Array.isArray(data) && data.length > 0) {
          // Verificar se o formulário deveria estar oculto ou não
          console.log('[useMusicRequests] Pedidos encontrados, ocultando formulário');
          setShowNewRequestForm(false);
          formSubmissionInProgressRef.current = false;
          
          setUserRequests(data);
          
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
        } else {
          // Se não houver pedidos, mostrar o formulário
          console.log('[useMusicRequests] Nenhum pedido encontrado, mostrando formulário');
          if (!formSubmissionInProgressRef.current) {
            setShowNewRequestForm(true);
          }
          setCurrentProgress(10);
          setUserRequests([]);
        }
        
        // Atualizar o hash para comparação futura
        lastDataHashRef.current = hashData(data);
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
    
    // CORREÇÃO CRÍTICA: Marcar que estamos em processo de submissão
    formSubmissionInProgressRef.current = true;
    
    // CORREÇÃO CRÍTICA: Ocultar o formulário imediatamente
    setShowNewRequestForm(false);
    
    // Verificar se temos dados válidos
    if (!Array.isArray(data) || data.length === 0) {
      console.error('[useMusicRequests] Dados recebidos inválidos:', data);
      return;
    }
    
    // Atualizar a lista de pedidos
    setUserRequests(prevRequests => {
      // Verificar se o pedido já existe para evitar duplicação
      const newRequestId = data[0]?.id;
      const isDuplicate = prevRequests.some(r => r.id === newRequestId);
      
      if (isDuplicate) {
        console.log('[useMusicRequests] Pedido duplicado, ignorando:', newRequestId);
        return prevRequests;
      }
      
      const updatedRequests = [...data, ...prevRequests];
      console.log('[useMusicRequests] Lista de pedidos atualizada:', updatedRequests);
      return updatedRequests;
    });
    
    setCurrentProgress(25);
    
    // Forçar uma nova busca após um breve intervalo
    setTimeout(() => {
      console.log('[useMusicRequests] Forçando nova busca para garantir sincronização');
      forceUpdateRef.current++;
      fetchUserRequests();
    }, 1000);
    
    // Segunda verificação depois de mais tempo para garantir dados consistentes
    setTimeout(() => {
      console.log('[useMusicRequests] Segunda verificação de consistência');
      fetchUserRequests();
    }, 3000);
  };

  const handleCreateNewRequest = () => {
    formSubmissionInProgressRef.current = false;
    setShowNewRequestForm(true);
  };

  // Efeito para buscar pedidos toda vez que o userProfile mudar ou forceUpdate for incrementado
  useEffect(() => {
    if (!userProfile?.id) return;
    
    console.log('[useMusicRequests] Configurando canal em tempo real para atualizações de pedidos');
    
    const channel = supabase
      .channel(`user-requests-updates-${userProfile.id}-${Date.now()}`)
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
    
    // Configurar intervalos de polling como fallback
    const intervalId = setInterval(() => {
      console.log('[useMusicRequests] Executando polling periódico');
      fetchUserRequests();
    }, 30000); // A cada 30 segundos
    
    return () => {
      console.log('[useMusicRequests] Limpando assinaturas e intervalos');
      supabase.removeChannel(channel);
      clearInterval(intervalId);
    };
  }, [userProfile, fetchUserRequests, forceUpdateRef.current]);

  // Efeito inicial para definir o estado do formulário
  useEffect(() => {
    if (!userProfile?.id) return;
    
    const checkInitialState = async () => {
      try {
        const { data, error } = await supabase
          .from('music_requests')
          .select('*')
          .eq('user_id', userProfile.id)
          .limit(1);
          
        if (error) throw error;
        
        // Se já existe algum pedido, não mostrar o formulário
        if (data && data.length > 0) {
          console.log('[useMusicRequests] Pedido existente encontrado na inicialização, ocultando formulário');
          setShowNewRequestForm(false);
        } else {
          console.log('[useMusicRequests] Nenhum pedido encontrado na inicialização, mostrando formulário');
          setShowNewRequestForm(true);
        }
      } catch (error) {
        console.error('[useMusicRequests] Erro ao verificar pedidos iniciais:', error);
        setShowNewRequestForm(true);
      }
    };
    
    checkInitialState();
  }, [userProfile]);

  // CORREÇÃO CRÍTICA: Verificação periódica do estado do formulário vs. pedidos
  useEffect(() => {
    const checkConsistency = () => {
      // Se tivermos pedidos mas o formulário estiver visível, ocultar o formulário
      if (userRequests.length > 0 && showNewRequestForm) {
        console.log('[useMusicRequests] Inconsistência detectada! Pedidos existem mas formulário está visível');
        setShowNewRequestForm(false);
      }
      
      // Se não tivermos pedidos, não estivermos em processo de submissão e o formulário estiver oculto, mostrar o formulário
      if (userRequests.length === 0 && !formSubmissionInProgressRef.current && !showNewRequestForm) {
        console.log('[useMusicRequests] Inconsistência detectada! Sem pedidos, sem submissão em progresso, mas formulário está oculto');
        setShowNewRequestForm(true);
      }
    };
    
    // Verificar consistência agora
    checkConsistency();
    
    // E configurar uma verificação periódica
    const consistencyInterval = setInterval(checkConsistency, 5000);
    
    return () => {
      clearInterval(consistencyInterval);
    };
  }, [userRequests, showNewRequestForm]);

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
