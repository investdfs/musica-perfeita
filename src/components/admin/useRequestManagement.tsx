
import { useState } from "react";
import { MusicRequest } from "@/types/database.types";
import { 
  useRequestDetails,
  useRequestStatusUpdate,
  useMusicFileHandling,
  useMusicLinkHandling
} from "./hooks";

/**
 * Hook principal para gerenciamento de pedidos de música
 * Organizado para usar hooks especializados para cada funcionalidade
 */
export const useRequestManagement = (
  requests: MusicRequest[],
  setRequests: (requests: MusicRequest[]) => void
) => {
  const [selectedRequest, setSelectedRequest] = useState<MusicRequest | null>(null);

  // Hook para gerenciar detalhes e visualização dos pedidos
  const {
    showDetails,
    setShowDetails,
    showDeliveryForm,
    setShowDeliveryForm,
    handleViewDetails,
    handleDeliverMusic,
    handleSendEmail
  } = useRequestDetails(selectedRequest, setSelectedRequest);

  // Hook para gerenciar atualizações de status
  const {
    handleUpdateStatus
  } = useRequestStatusUpdate(requests, setRequests);

  // Hook para gerenciar arquivos de música
  const {
    audioFile,
    setAudioFile,
    isUploading,
    handleFileUpload,
    handleDownloadFile
  } = useMusicFileHandling(requests, setRequests, selectedRequest, setSelectedRequest);

  // Hook para gerenciar links de música
  const {
    handleSaveSoundCloudId,
    handleSaveMusicLink
  } = useMusicLinkHandling(requests, setRequests, setShowDetails);

  return {
    // Estado
    selectedRequest,
    setSelectedRequest,
    showDetails,
    setShowDetails,
    audioFile,
    setAudioFile,
    isUploading,
    showDeliveryForm,
    setShowDeliveryForm,
    
    // Ações
    handleViewDetails,
    handleDeliverMusic,
    handleSaveSoundCloudId,
    handleSendEmail,
    handleFileUpload,
    handleUpdateStatus,
    handleDownloadFile,
    handleSaveMusicLink
  };
};
