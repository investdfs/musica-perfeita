
import { useCallback } from "react";
import supabase from "@/lib/supabase";
import { MusicRequest, UserProfile } from "@/types/database.types";
import { toast } from "@/hooks/use-toast";
import { hashData, determineProgress } from "./utils";

interface FetchRequestsProps {
  userProfile: UserProfile | null;
  setUserRequests: (requests: MusicRequest[]) => void;
  setCurrentProgress: (progress: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  setShowNewRequestForm: (show: boolean) => void;
  isFirstLoadRef: React.MutableRefObject<boolean>;
  isFetchingRef: React.MutableRefObject<boolean>;
  lastDataHashRef: React.MutableRefObject<string>;
  formSubmissionInProgressRef: React.MutableRefObject<boolean>;
  initialStateCheckedRef: React.MutableRefObject<boolean>;
}

/**
 * Hook para gerenciar a busca de pedidos de música
 */
export const useFetchRequests = ({
  userProfile,
  setUserRequests,
  setCurrentProgress,
  setIsLoading,
  setShowNewRequestForm,
  isFirstLoadRef,
  isFetchingRef,
  lastDataHashRef,
  formSubmissionInProgressRef,
  initialStateCheckedRef
}: FetchRequestsProps) => {
  
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
            
            // Definir progresso baseado no status
            setCurrentProgress(determineProgress(latestRequest));
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
  }, [userProfile, setUserRequests, setCurrentProgress, setIsLoading, setShowNewRequestForm]);

  /**
   * Verificação inicial para definir corretamente o estado do formulário
   */
  const checkInitialState = async () => {
    if (!userProfile?.id) return;
    
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
        setCurrentProgress(determineProgress(latestRequest));
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

  return {
    fetchUserRequests,
    checkInitialState
  };
};
