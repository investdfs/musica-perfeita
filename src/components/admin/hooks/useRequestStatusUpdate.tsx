
import { MusicRequest } from "@/types/database.types";
import supabase from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

/**
 * Hook para gerenciar atualizações de status dos pedidos
 */
export const useRequestStatusUpdate = (
  requests: MusicRequest[],
  setRequests: (requests: MusicRequest[]) => void
) => {
  const handleUpdateStatus = async (
    requestId: string, 
    status?: MusicRequest['status'], 
    paymentStatus?: MusicRequest['payment_status']
  ) => {
    try {
      const updates: Partial<MusicRequest> = {};
      
      if (status) updates.status = status;
      if (paymentStatus) updates.payment_status = paymentStatus;
      
      console.log(`[Admin] Atualizando pedido ${requestId} com:`, updates);
      
      const { error } = await supabase
        .from('music_requests')
        .update(updates)
        .eq('id', requestId);
        
      if (error) {
        console.error('[Admin] Erro ao atualizar no Supabase:', error);
        throw new Error(`Erro ao atualizar o status: ${error.message}`);
      }
      
      console.log('[Admin] Atualização no Supabase bem-sucedida');
      
      const updatedRequests = requests.map(req => 
        req.id === requestId 
          ? { ...req, ...updates } as MusicRequest
          : req
      );
      
      setRequests(updatedRequests);
      
      const requestAfterUpdate = updatedRequests.find(req => req.id === requestId);
      console.log(`[Admin] Pedido após atualização:`, requestAfterUpdate);
      
      toast({
        title: "Status atualizado",
        description: "O status do pedido foi atualizado com sucesso",
      });
    } catch (error: any) {
      console.error('[Admin] Erro ao atualizar status:', error);
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Não foi possível atualizar o status",
        variant: "destructive",
      });
    }
  };

  return {
    handleUpdateStatus
  };
};
