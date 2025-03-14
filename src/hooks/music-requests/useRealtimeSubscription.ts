
import { useEffect } from "react";
import supabase from "@/lib/supabase";
import { UserProfile } from "@/types/database.types";

interface RealtimeSubscriptionProps {
  userProfile: UserProfile | null;
  fetchUserRequests: () => Promise<void>;
  forceUpdateRef: React.MutableRefObject<number>;
}

/**
 * Hook para gerenciar assinaturas em tempo real dos pedidos de música
 */
export const useRealtimeSubscription = ({
  userProfile,
  fetchUserRequests,
  forceUpdateRef
}: RealtimeSubscriptionProps) => {
  
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
};
