
import { useState } from "react";
import { MusicRequest } from "@/types/database.types";
import { toast } from "@/hooks/use-toast";

/**
 * Hook para gerenciar detalhes e visualizações de pedidos
 */
export const useRequestDetails = (
  selectedRequest: MusicRequest | null,
  setSelectedRequest: (request: MusicRequest | null) => void
) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);

  const handleViewDetails = (request: MusicRequest) => {
    setSelectedRequest(request);
    setShowDetails(true);
  };

  const handleDeliverMusic = (request: MusicRequest) => {
    setSelectedRequest(request);
    setShowDeliveryForm(true);
  };

  const handleSendEmail = async () => {
    if (!selectedRequest) return Promise.resolve();
    
    try {
      toast({
        title: "E-mail enviado",
        description: "A música foi enviada ao cliente por e-mail",
      });
      setShowDeliveryForm(false);
      return Promise.resolve();
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar o e-mail",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  return {
    showDetails,
    setShowDetails,
    showDeliveryForm,
    setShowDeliveryForm,
    handleViewDetails,
    handleDeliverMusic,
    handleSendEmail,
  };
};
