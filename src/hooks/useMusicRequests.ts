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
  
  const initialStateCheckedRef = useRef(false);

  const hashData = (data: any) => {
    try {
      return JSON.stringify(data);
    } catch (e) {
      return "";
    }
  };

  const fetchUserRequests = useCallback(async () => {
    if (isFetchingRef.current) {
      console.log('[useMusicRequests] Já existe um fetch em andamento, ignorando...');
      return;
    }

    try {
      if (!userProfile?.id) {
        console.log('[useMusicRequests] Sem ID de usuário, ignorando fetch');
        return;
      }
      
      isFetchingRef.current = true;
      
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
        console.log('[useMusicRequests] Dados recebidos:', data.length, data);
        
        if (Array.isArray(data)) {
          setUserRequests(data);
          
          if (data.length > 0) {
            formSubmissionInProgressRef.current = false;
            
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
            setCurrentProgress(10);
          }
          
          initialStateCheckedRef.current = true;
          
          lastDataHashRef.current = hashData(data);
        }
      }
    } catch (error) {
      console.error('[useMusicRequests] Erro ao buscar pedidos de música:', error);
      
      if (isFirstLoadRef.current) {
        toast({
          title: "Erro ao carregar pedidos",
          description: "Não foi possível carregar seus pedidos. Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
      
      setCurrentProgress(10);
    } finally {
      isFirstLoadRef.current = false;
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [userProfile]);

  const handleRequestSubmitted = (data: MusicRequest[]) => {
    console.log('[useMusicRequests] Pedido enviado, atualizando estado:', data);
    
    formSubmissionInProgressRef.current = true;
    
    setShowNewRequestForm(false);
    
    if (!Array.isArray(data) || data.length === 0) {
      console.error('[useMusicRequests] Dados recebidos inválidos:', data);
      return;
    }
    
    setUserRequests(data);
    
    setCurrentProgress(25);
    
    const scheduleVerifications = () => {
      fetchUserRequests();
      
      setTimeout(() => {
        console.log('[useMusicRequests] Verificação após 500ms');
        formSubmissionInProgressRef.current = false;
        fetchUserRequests();
      }, 500);
      
      setTimeout(() => {
        console.log('[useMusicRequests] Verificação após 1500ms');
        fetchUserRequests();
      }, 1500);
      
      setTimeout(() => {
        console.log('[useMusicRequests] Verificação final após 3000ms');
        fetchUserRequests();
      }, 3000);
    };
    
    scheduleVerifications();
    
    forceUpdateRef.current++;
  };

  const handleCreateNewRequest = () => {
    formSubmissionInProgressRef.current = false;
    setShowNewRequestForm(true);
  };

  useEffect(() => {
    if (!userProfile?.id) return;
    
    const checkInitialState = async () => {
      try {
        setIsLoading(true);
        console.log('[useMusicRequests] Verificando estado inicial para o usuário:', userProfile.id);
        
        const { data, error } = await supabase
          .from('music_requests')
          .select('*')
          .eq('user_id', userProfile.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        console.log('[useMusicRequests] Verificação inicial de pedidos:', data);
        
        if (data && data.length > 0) {
          setShowNewRequestForm(false);
          setUserRequests(data);
          
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
          setShowNewRequestForm(true);
          setUserRequests([]);
          setCurrentProgress(10);
        }
        
        initialStateCheckedRef.current = true;
      } catch (error) {
        console.error('[useMusicRequests] Erro ao verificar pedidos iniciais:', error);
        setShowNewRequestForm(true);
        setUserRequests([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkInitialState();
  }, [userProfile]);

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
    
    setTimeout(() => {
      fetchUserRequests();
    }, 100);
    
    const intervalId = setInterval(() => {
      console.log('[useMusicRequests] Executando polling periódico');
      fetchUserRequests();
    }, 5000);
    
    return () => {
      console.log('[useMusicRequests] Limpando assinaturas e intervalos');
      supabase.removeChannel(channel);
      clearInterval(intervalId);
    };
  }, [userProfile, fetchUserRequests, forceUpdateRef.current]);

  useEffect(() => {
    if (!initialStateCheckedRef.current) return;
    
    const checkConsistency = () => {
      if (userRequests.length > 0 && showNewRequestForm && !formSubmissionInProgressRef.current) {
        console.log('[useMusicRequests] INCONSISTÊNCIA DETECTADA: Temos pedidos mas o formulário está visível');
        setShowNewRequestForm(false);
      }
      
      if (formSubmissionInProgressRef.current && showNewRequestForm) {
        console.log('[useMusicRequests] INCONSISTÊNCIA DETECTADA: Em submissão mas o formulário está visível');
        setShowNewRequestForm(false);
      }
    };
    
    checkConsistency();
    
    const consistencyInterval = setInterval(checkConsistency, 2000);
    
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
