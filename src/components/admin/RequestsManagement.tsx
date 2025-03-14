
import { useState, useEffect, useRef } from "react";
import { MusicRequest, UserProfile } from "@/types/database.types";
import RequestDetails from "./RequestDetails";
import DeliveryForm from "./DeliveryForm";
import { useRequestManagement } from "./useRequestManagement";
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";
import RequestsList from "./requests/RequestsList";
import TechnicalDetailsDialog from "./requests/TechnicalDetailsDialog";

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
    setSelectedRequest,
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

  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const realtimeChannelRef = useRef<any>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [localRequests, setLocalRequests] = useState<MusicRequest[]>([]);
  const lastFetchTimeRef = useRef(Date.now());
  const MIN_FETCH_INTERVAL = 2000; // Minimiza múltiplas chamadas em sequência

  const forceRefresh = () => {
    console.log('[RequestsManagement] Forçando atualização dos dados');
    setFetchTrigger(prev => prev + 1);
  };

  useEffect(() => {
    console.log('[RequestsManagement] Requests atualizados:', requests.length);
    setLocalRequests(requests);
  }, [requests]);

  useEffect(() => {
    console.log('[RequestsManagement] Configurando escuta em tempo real para requisições de música');
    
    const fetchAllRequests = async () => {
      try {
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
          setRequests(data as MusicRequest[]);
          setLocalRequests(data as MusicRequest[]);
        } else {
          console.log('[RequestsManagement] Nenhum pedido encontrado');
        }
      } catch (err) {
        console.error('[RequestsManagement] Erro ao buscar pedidos:', err);
      }
    };
    
    fetchAllRequests();
    
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
        fetchAllRequests();
      })
      .subscribe((status) => {
        console.log(`[RequestsManagement] Status da inscrição em tempo real: ${status}`);
      });
    
    realtimeChannelRef.current = channel;
    
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

  useEffect(() => {
    const consistencyCheckInterval = setInterval(() => {
      console.log('[RequestsManagement] Verificação periódica de consistência');
      forceRefresh();
    }, 30000);
    
    return () => {
      clearInterval(consistencyCheckInterval);
    };
  }, []);

  const getUserName = (userId: string): string => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : userId;
  };

  const updateStatusWithNotification = (requestId: string, status?: MusicRequest['status'], paymentStatus?: MusicRequest['payment_status']) => {
    handleUpdateStatus(requestId, status, paymentStatus);
    
    toast({
      title: "Status atualizado",
      description: status 
        ? `Status do pedido alterado para: ${status}` 
        : `Status do pagamento alterado para: ${paymentStatus}`,
    });
    
    console.log(`[RequestsManagement] Status atualizado para pedido ${requestId}: status=${status}, pagamento=${paymentStatus}`);
    
    setTimeout(() => {
      forceRefresh();
    }, 1000);
  };

  const handleEditTechnicalDetails = (request: MusicRequest) => {
    setSelectedRequest(request);
    setShowTechnicalDetails(true);
  };

  const handleSaveTechnicalDetails = async (requestId: string, details: string) => {
    try {
      console.log('[RequestsManagement] Salvando detalhes técnicos para o pedido:', requestId);
      
      const { error } = await supabase
        .from('music_requests')
        .update({ technical_details: details })
        .eq('id', requestId);
      
      if (error) throw error;
      
      // Atualizar a lista local
      const updatedRequests = requests.map(req => 
        req.id === requestId 
          ? { ...req, technical_details: details } 
          : req
      );
      
      setRequests(updatedRequests as MusicRequest[]);
      setLocalRequests(updatedRequests as MusicRequest[]);
      
      // Se o pedido atualmente selecionado for o que foi atualizado, atualizar também
      if (selectedRequest && selectedRequest.id === requestId) {
        setSelectedRequest({ ...selectedRequest, technical_details: details });
      }
    } catch (error) {
      console.error('[RequestsManagement] Erro ao salvar detalhes técnicos:', error);
      throw error;
    }
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
        onEditTechnicalDetails={handleEditTechnicalDetails}
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

      <TechnicalDetailsDialog
        isOpen={showTechnicalDetails}
        onClose={() => setShowTechnicalDetails(false)}
        request={selectedRequest}
        onSave={handleSaveTechnicalDetails}
      />
    </>
  );
};

export default RequestsManagement;
