
import { useState, useEffect, useRef } from "react";
import { MusicRequest, UserProfile } from "@/types/database.types";
import RequestsList from "./RequestsList";
import RequestDetails from "./RequestDetails";
import DeliveryForm from "./DeliveryForm";
import { useRequestManagement } from "./useRequestManagement";
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";

interface RequestsManagementProps {
  requests: MusicRequest[];
  users: UserProfile[];
  setRequests: (requests: MusicRequest[]) => void;
  isLoading: boolean;
  getUserEmail: (userId: string) => string | undefined;
}

const RequestsManagement = ({ 
  requests, 
  users, 
  setRequests, 
  isLoading,
  getUserEmail
}: RequestsManagementProps) => {
  const {
    selectedRequest,
    showDetails,
    setShowDetails,
    audioFile,
    setAudioFile,
    isUploading,
    showDeliveryForm,
    setShowDeliveryForm,
    handleViewDetails,
    handleDeliverMusic,
    handleSaveSoundCloudId,
    handleSendEmail,
    handleFileUpload,
    handleUpdateStatus,
    handleDownloadFile,
    handleSaveMusicLink
  } = useRequestManagement(requests, setRequests);

  const realtimeChannelRef = useRef<any>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [localRequests, setLocalRequests] = useState<MusicRequest[]>([]);
  const lastFetchTimeRef = useRef(Date.now());
  const MIN_FETCH_INTERVAL = 2000; // Minimiza múltiplas chamadas em sequência

  // Função para forçar atualização dos dados
  const forceRefresh = () => {
    console.log('[RequestsManagement] Forçando atualização dos dados');
    setFetchTrigger(prev => prev + 1);
  };

  // Efeito para monitorar mudanças nas props de requests
  useEffect(() => {
    console.log('[RequestsManagement] Requests atualizados:', requests.length);
    setLocalRequests(requests);
  }, [requests]);

  // CORREÇÃO CRÍTICA: Configurar escuta em tempo real para quaisquer mudanças na tabela music_requests
  useEffect(() => {
    console.log('[RequestsManagement] Configurando escuta em tempo real para requisições de música');
    
    // Forçar busca inicial para garantir que todos os pedidos sejam carregados
    const fetchAllRequests = async () => {
      try {
        // Verificar intervalo mínimo entre fetchs
        const now = Date.now();
        if (now - lastFetchTimeRef.current < MIN_FETCH_INTERVAL) {
          console.log('[RequestsManagement] Ignorando fetch frequente demais');
          return;
        }
        
        lastFetchTimeRef.current = now;
        console.log('[RequestsManagement] Buscando todos os pedidos...');
        
        const { data, error } = await supabase
          .from('music_requests')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('[RequestsManagement] Erro ao buscar pedidos:', error);
          return;
        }
        
        if (data && data.length > 0) {
          console.log('[RequestsManagement] Pedidos encontrados:', data.length);
          setRequests(data);
          setLocalRequests(data);
        } else {
          console.log('[RequestsManagement] Nenhum pedido encontrado');
        }
      } catch (err) {
        console.error('[RequestsManagement] Erro ao buscar pedidos:', err);
      }
    };
    
    fetchAllRequests();
    
    // CORREÇÃO CRÍTICA: Usar um canal dedicado para o admin com um timestamp para evitar colisões
    const channelName = `admin-music-requests-${Date.now()}`;
    console.log(`[RequestsManagement] Criando canal em tempo real: ${channelName}`);
    
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'music_requests'
      }, (payload) => {
        console.log('[RequestsManagement] Mudança detectada via tempo real:', payload);
        // Quando detectar mudanças, atualizar imediatamente a lista
        fetchAllRequests();
      })
      .subscribe((status) => {
        console.log(`[RequestsManagement] Status da inscrição em tempo real: ${status}`);
      });
    
    realtimeChannelRef.current = channel;
    
    // Configurar polling de backup a cada 10 segundos
    const pollingInterval = setInterval(() => {
      console.log('[RequestsManagement] Executando polling de verificação');
      fetchAllRequests();
    }, 10000);
    
    return () => {
      console.log('[RequestsManagement] Removendo canal de tempo real admin');
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
        realtimeChannelRef.current = null;
      }
      clearInterval(pollingInterval);
    };
  }, [setRequests, fetchTrigger]);

  // Intervalo de verificação para garantir que dados estejam atualizados
  useEffect(() => {
    const consistencyCheckInterval = setInterval(() => {
      console.log('[RequestsManagement] Verificação periódica de consistência');
      forceRefresh();
    }, 30000); // Verificar a cada 30 segundos
    
    return () => {
      clearInterval(consistencyCheckInterval);
    };
  }, []);

  const getUserName = (userId: string): string => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : userId;
  };

  // Função para atualizar o status e enviar uma mensagem ao usuário
  const updateStatusWithNotification = (requestId: string, status?: MusicRequest['status'], paymentStatus?: MusicRequest['payment_status']) => {
    // Chama a função original de atualização
    handleUpdateStatus(requestId, status, paymentStatus);
    
    // Mostra uma notificação para o usuário
    toast({
      title: "Status atualizado",
      description: status 
        ? `Status do pedido alterado para: ${status}` 
        : `Status do pagamento alterado para: ${paymentStatus}`,
    });
    
    // Registra no console para debugging
    console.log(`[RequestsManagement] Status atualizado para pedido ${requestId}: status=${status}, pagamento=${paymentStatus}`);
    
    // Força atualização após breve atraso
    setTimeout(() => {
      forceRefresh();
    }, 1000);
  };

  return (
    <>
      <RequestsList
        requests={localRequests.length > 0 ? localRequests : requests}
        isLoading={isLoading}
        getUserName={getUserName}
        onViewDetails={handleViewDetails}
        onUpdateStatus={updateStatusWithNotification}
        onFileUpload={handleFileUpload}
        onDeliverMusic={handleDeliverMusic}
        onDownloadFile={handleDownloadFile}
        isUploading={isUploading}
        selectedRequestId={selectedRequest?.id || null}
        onSaveMusicLink={handleSaveMusicLink}
      />

      <RequestDetails 
        showDetails={showDetails} 
        setShowDetails={setShowDetails} 
        selectedRequest={selectedRequest} 
        handleSaveSoundCloudId={handleSaveSoundCloudId} 
        isUploading={isUploading} 
      />

      <DeliveryForm 
        showDeliveryForm={showDeliveryForm}
        setShowDeliveryForm={setShowDeliveryForm}
        selectedRequest={selectedRequest}
        handleSendEmail={handleSendEmail}
        getUserName={getUserName}
        getUserEmail={getUserEmail}
      />
    </>
  );
};

export default RequestsManagement;
