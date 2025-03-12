
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

  const realtimeChannelRef = useRef(null);

  // Configurar escuta em tempo real para quaisquer mudanças na tabela music_requests
  useEffect(() => {
    console.log('[Admin] Configurando escuta em tempo real para requisições de música');
    
    const channel = supabase
      .channel('admin-music-requests')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'music_requests'
      }, (payload) => {
        console.log('[Admin] Mudança detectada via tempo real:', payload);
        // Quando detectar mudanças, atualizar imediatamente a lista
        // A atualização será tratada pelo componente pai
      })
      .subscribe((status) => {
        console.log(`[Admin] Status da inscrição em tempo real: ${status}`);
      });
    
    realtimeChannelRef.current = channel;
    
    return () => {
      console.log('[Admin] Removendo canal de tempo real admin');
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
        realtimeChannelRef.current = null;
      }
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
    console.log(`[Admin] Status atualizado para pedido ${requestId}: status=${status}, pagamento=${paymentStatus}`);
  };

  return (
    <>
      <RequestsList
        requests={requests}
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
