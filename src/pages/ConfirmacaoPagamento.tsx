
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Music, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";
import { MusicRequest, UserProfile } from "@/types/database.types";
import { useUserAuth } from "@/hooks/useUserAuth";

const ConfirmacaoPagamento = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { userProfile } = useUserAuth();
  const [requests, setRequests] = useState<MusicRequest[]>([]);

  useEffect(() => {
    if (!userProfile?.id) return;
    
    const processPayment = async () => {
      try {
        console.log("[ConfirmacaoPagamento] Iniciando processamento de pagamento para usuário:", userProfile.id);
        
        // Buscar todos os pedidos do usuário com status completed mas não pagos
        const { data: userRequests, error } = await supabase
          .from('music_requests')
          .select('*')
          .eq('user_id', userProfile.id)
          .eq('status', 'completed')
          .eq('payment_status', 'pending');
        
        if (error) {
          console.error("[ConfirmacaoPagamento] Erro ao buscar pedidos:", error);
          throw new Error("Não foi possível verificar seus pedidos");
        }
        
        if (!userRequests || userRequests.length === 0) {
          console.log("[ConfirmacaoPagamento] Nenhum pedido pendente encontrado para o usuário");
          throw new Error("Nenhum pedido pendente de pagamento encontrado");
        }
        
        console.log("[ConfirmacaoPagamento] Pedidos encontrados:", userRequests.length);
        setRequests(userRequests);
        
        // Atualizar o status de pagamento para completed para todos os pedidos pendentes
        const { error: updateError } = await supabase
          .from('music_requests')
          .update({ payment_status: 'completed' })
          .eq('user_id', userProfile.id)
          .eq('status', 'completed')
          .eq('payment_status', 'pending');
        
        if (updateError) {
          console.error("[ConfirmacaoPagamento] Erro ao atualizar status de pagamento:", updateError);
          throw new Error("Não foi possível atualizar o status do pagamento");
        }
        
        console.log("[ConfirmacaoPagamento] Status de pagamento atualizado com sucesso");
        setIsSuccess(true);
        
        toast({
          title: "Pagamento confirmado!",
          description: "Seu acesso à música completa foi liberado com sucesso.",
          variant: "default", // Alterado de "success" para "default"
        });
      } catch (error: any) {
        console.error("[ConfirmacaoPagamento] Erro no processamento:", error);
        
        toast({
          title: "Erro no processamento",
          description: error.message || "Ocorreu um erro ao processar o pagamento",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };
    
    processPayment();
  }, [userProfile]);
  
  const handleGoToMusic = () => {
    if (requests.length === 1) {
      // Se houver apenas uma música, navegar diretamente para o player
      navigate("/music-player-full", { 
        state: { 
          musicUrl: requests[0].full_song_url,
          downloadUrl: requests[0].full_song_url,
          requestId: requests[0].id
        } 
      });
    } else if (requests.length > 1) {
      // Se houver múltiplas músicas, navegar para a página que mostrará o seletor
      navigate("/music-player-full");
    } else {
      // Caso não tenha encontrado nenhum pedido (improvável chegar aqui)
      navigate("/dashboard");
    }
  };
  
  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 to-white">
      <Header />
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-xl max-w-xl w-full p-8 text-center">
          {isProcessing ? (
            <div className="py-6">
              <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Processando pagamento...</h2>
              <p className="text-gray-600">Por favor, aguarde enquanto confirmamos seu pagamento.</p>
            </div>
          ) : isSuccess ? (
            <div className="py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Pagamento confirmado!</h2>
              <p className="text-gray-600 mb-8">
                Obrigado pela sua compra! Seu pagamento foi confirmado e você já tem acesso completo à sua música personalizada.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={handleGoToMusic}
                  className="bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-700 hover:to-violet-600"
                >
                  <Music className="h-5 w-5 mr-2" />
                  Ouvir minha música
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleGoToDashboard}
                >
                  Ir para o Dashboard
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Não foi possível confirmar o pagamento</h2>
              <p className="text-gray-600 mb-8">
                Ocorreu um erro ao processar seu pagamento. Por favor, entre em contato com nosso suporte.
              </p>
              <Button 
                variant="outline" 
                onClick={handleGoToDashboard}
              >
                Voltar para o Dashboard
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ConfirmacaoPagamento;
