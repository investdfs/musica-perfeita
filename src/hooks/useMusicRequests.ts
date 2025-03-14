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
  
  // CORREÇÃO CRÍTICA: Adicionar flag para controlar inicialização
  const initialStateCheckedRef = useRef(false);

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
      if (!userProfile?.id) {
        console.log('[useMusicRequests] Sem ID de usuário, ignorando fetch');
        return;
      }
      
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
        console.log('[useMusicRequests] Dados recebidos:', data.length, data);
        
        // CORREÇÃO CRÍTICA: Garantir que os dados sejam processados corretamente
        if (Array.isArray(data)) {
          // CORREÇÃO CRÍTICA: Verificar se o formulário deveria estar oculto ou não
          if (data.length > 0) {
            console.log('[useMusicRequests] Pedidos encontrados, ocultando formulário:', data.length);
            // CORREÇÃO CRÍTICA: Ocultar formulário se há pedidos (sem depender de flags adicionais)
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
            if (!formSubmissionInProgressRef.current && initialStateCheckedRef.current) {
              setShowNewRequestForm(true);
            }
            setCurrentProgress(10);
            setUserRequests([]);
          }
          
          // CORREÇÃO CRÍTICA: Indicar que o estado inicial foi verificado
          initialStateCheckedRef.current = true;
          
          // Atualizar o hash para comparação futura
          lastDataHashRef.current = hashData(data);
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
    
    // CORREÇÃO CRÍTICA: Marcar que estamos em processo de submissão
    formSubmissionInProgressRef.current = true;
    
    // CORREÇÃO CRÍTICA: Ocultar o formulário imediatamente
    setShowNewRequestForm(false);
    
    // Verificar se temos dados válidos
    if (!Array.isArray(data) || data.length === 0) {
      console.error('[useMusicRequests] Dados recebidos inválidos:', data);
      return;
    }
    
    // CORREÇÃO CRÍTICA: Definir diretamente os pedidos do usuário com os novos dados
    // Ao invés de concatenar, substituir completamente para garantir consistência
    setUserRequests(data);
    
    // Atualizar o progresso
    setCurrentProgress(25);
    
    // CORREÇÃO CRÍTICA: Melhorar sequência de verificações para garantir a sincronização
    const scheduleVerifications = () => {
      // Forçar busca imediata
      fetchUserRequests();
      
      // Verificações adicionais com temporizadores mais curtos
      setTimeout(() => {
        console.log('[useMusicRequests] Verificação após 500ms');
        formSubmissionInProgressRef.current = false; // Liberar a flag
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
    
    // Iniciar sequência de verificações
    scheduleVerifications();
    
    // Incrementar contador para forçar atualizações
    forceUpdateRef.current++;
  };

  const handleCreateNewRequest = () => {
    formSubmissionInProgressRef.current = false;
    setShowNewRequestForm(true);
  };

  // CORREÇÃO CRÍTICA: Verificação inicial explícita para definir corretamente o estado do formulário
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
        
        // CORREÇÃO CRÍTICA: Definir explicitamente se deve mostrar o formulário ou não
        if (data && data.length > 0) {
          // Já existe pedido, ocultar formulário
          console.log('[useMusicRequests] Pedido existente encontrado na inicialização, ocultando formulário');
          setShowNewRequestForm(false);
          setUserRequests(data);
          
          // Atualizar o progresso com base no status do pedido mais recente
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
          // Não existe pedido, mostrar formulário
          console.log('[useMusicRequests] Nenhum pedido encontrado na inicialização, mostrando formulário');
          setShowNewRequestForm(true);
          setUserRequests([]);
          setCurrentProgress(10);
        }
        
        // Marcar que o estado inicial foi verificado
        initialStateCheckedRef.current = true;
      } catch (error) {
        console.error('[useMusicRequests] Erro ao verificar pedidos iniciais:', error);
        setShowNewRequestForm(true);
        setUserRequests([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Chamar a verificação inicial
    checkInitialState();
  }, [userProfile]);

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
    
    // Fazer fetch inicial após pequeno delay para garantir que tudo foi montado
    setTimeout(() => {
      fetchUserRequests();
    }, 100);
    
    // Configurar intervalos de polling como fallback
    const intervalId = setInterval(() => {
      console.log('[useMusicRequests] Executando polling periódico');
      fetchUserRequests();
    }, 5000); // A cada 5 segundos
    
    return () => {
      console.log('[useMusicRequests] Limpando assinaturas e intervalos');
      supabase.removeChannel(channel);
      clearInterval(intervalId);
    };
  }, [userProfile, fetchUserRequests, forceUpdateRef.current]);

  // CORREÇÃO CRÍTICA: Verificação periódica do estado de consistência entre formulário e pedidos
  useEffect(() => {
    if (!initialStateCheckedRef.current) return;
    
    const checkConsistency = () => {
      // Se temos pedidos mas o formulário está visível, isso é inconsistente
      if (userRequests.length > 0 && showNewRequestForm && !formSubmissionInProgressRef.current) {
        console.log('[useMusicRequests] INCONSISTÊNCIA DETECTADA: Temos pedidos mas o formulário está visível');
        setShowNewRequestForm(false);
      }
      
      // Se não temos pedidos, não estamos em submissão, e o formulário está oculto, isso também é inconsistente
      if (userRequests.length === 0 && !formSubmissionInProgressRef.current && !showNewRequestForm) {
        console.log('[useMusicRequests] INCONSISTÊNCIA DETECTADA: Sem pedidos, sem submissão em andamento, mas o formulário está oculto');
        setShowNewRequestForm(true);
      }
      
      // Se estamos em submissão, o formulário deve estar oculto
      if (formSubmissionInProgressRef.current && showNewRequestForm) {
        console.log('[useMusicRequests] INCONSISTÊNCIA DETECTADA: Em submissão mas o formulário está visível');
        setShowNewRequestForm(false);
      }
    };
    
    // Verificar imediatamente
    checkConsistency();
    
    // E configurar verificação periódica
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
    setUserRequests,
    setShowNewRequestForm
  };
};
