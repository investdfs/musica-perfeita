
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { MusicRequest, UserProfile } from "@/types/database.types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ArrowRight, Music, Download, Home } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ConfirmacaoProps {
  userProfile: UserProfile | null;
}

const Confirmacao = ({ userProfile }: ConfirmacaoProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [musicRequest, setMusicRequest] = useState<MusicRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failure' | 'pending'>('pending');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Verificar se temos parâmetros de URL de retorno do Mercado Pago
        const requestId = searchParams.get('request_id');
        const status = searchParams.get('status');
        
        // Se temos informações de retorno do pagamento, processar
        if (requestId && status) {
          console.log(`Retorno do Mercado Pago: request_id=${requestId}, status=${status}`);
          
          // Definir status com base no parâmetro da URL
          setPaymentStatus(status === 'success' ? 'success' : 'failure');
          
          // Buscar dados do pedido no banco
          const { data, error } = await supabase
            .from('music_requests')
            .select('*')
            .eq('id', requestId)
            .single();
            
          if (error) {
            console.error("Erro ao buscar pedido:", error);
            toast({
              title: "Erro",
              description: "Não foi possível carregar os detalhes do pedido",
              variant: "destructive",
            });
          } else if (data) {
            // Converter os dados para o tipo MusicRequest, garantindo tipo correto para relationship_type
            const typedRequest = {
              ...data,
              relationship_type: data.relationship_type as MusicRequest['relationship_type']
            };
            setMusicRequest(typedRequest);
            
            // Se o pagamento foi bem-sucedido, atualizar o status no banco
            if (status === 'success') {
              const { error: updateError } = await supabase
                .from('music_requests')
                .update({ payment_status: 'completed' })
                .eq('id', requestId);
                
              if (updateError) {
                console.error("Erro ao atualizar status de pagamento:", updateError);
              } else {
                console.log("Status de pagamento atualizado com sucesso");
                // Atualizar localmente o objeto musicRequest
                if (typedRequest) {
                  setMusicRequest({
                    ...typedRequest,
                    payment_status: 'completed'
                  });
                }
              }
            }
          }
        } 
        // Caso contrário, verificar dados do estado da navegação
        else if (location.state?.musicRequest) {
          console.log("Usando dados do state da navegação:", location.state.musicRequest);
          setMusicRequest(location.state.musicRequest);
          
          // Verificar se temos dados de pagamento pendente no localStorage
          const pendingPayment = localStorage.getItem("payment_pending_request");
          if (pendingPayment) {
            // Assumimos que o usuário está voltando após iniciar o pagamento
            console.log("Dados de pagamento pendente encontrados:", pendingPayment);
            setPaymentStatus('pending');
          }
        } 
        // Último recurso: buscar o último pedido do usuário
        else if (userProfile?.id) {
          console.log("Buscando último pedido do usuário");
          const { data, error } = await supabase
            .from('music_requests')
            .select('*')
            .eq('user_id', userProfile.id)
            .order('created_at', { ascending: false })
            .limit(1);
            
          if (error) {
            console.error("Erro ao buscar pedido:", error);
          } else if (data && data.length > 0) {
            console.log("Pedido encontrado:", data[0]);
            // Converter os dados para o tipo MusicRequest
            const typedRequest = {
              ...data[0],
              relationship_type: data[0].relationship_type as MusicRequest['relationship_type']
            };
            setMusicRequest(typedRequest);
            
            // Definir status com base no status de pagamento do pedido
            if (data[0].payment_status === 'completed') {
              setPaymentStatus('success');
            } else {
              setPaymentStatus('pending');
            }
          }
        }
      } catch (error) {
        console.error("Erro ao processar confirmação:", error);
        toast({
          title: "Erro",
          description: "Houve um problema ao processar a confirmação",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchParams, location.state, userProfile]);

  const renderStatusMessage = () => {
    switch (paymentStatus) {
      case 'success':
        return (
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Pagamento Confirmado!</h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Seu pagamento foi processado com sucesso. Agora você tem acesso à versão completa da sua música personalizada.
            </p>
          </div>
        );
      case 'failure':
        return (
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Pagamento Não Concluído</h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Parece que houve um problema com o seu pagamento. Você pode tentar novamente ou entrar em contato com nosso suporte.
            </p>
          </div>
        );
      case 'pending':
      default:
        return (
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Music className="h-12 w-12 text-yellow-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Processando Pagamento</h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Estamos aguardando a confirmação do seu pagamento. Assim que for aprovado, você terá acesso à versão completa da sua música.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Header />
      
      {/* Formas decorativas no fundo */}
      <div className="animated-shapes opacity-50">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      <main className="py-16 px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="animate-spin w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-6"></div>
              <p className="text-gray-600 text-lg">Carregando informações...</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              {renderStatusMessage()}
              
              <div className="border-t border-gray-100 pt-8 mt-8">
                <h3 className="text-xl font-semibold mb-6 text-center text-gray-800">Próximos Passos</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {paymentStatus === 'success' ? (
                    <>
                      <Button 
                        onClick={() => navigate('/music-player-full', { state: { musicRequest } })}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Music className="h-5 w-5" />
                        Ouvir Música Completa
                      </Button>
                      
                      {musicRequest?.full_song_url && (
                        <Button 
                          className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                          onClick={() => window.open(musicRequest.full_song_url, '_blank')}
                        >
                          <Download className="h-5 w-5" />
                          Baixar Música
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <Button 
                        onClick={() => navigate('/pagamento', { state: { musicRequest } })}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <ArrowRight className="h-5 w-5" />
                        Tentar Pagamento Novamente
                      </Button>
                      
                      <Button 
                        onClick={() => navigate('/music-player', { state: { musicRequest } })}
                        className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                        variant="outline"
                      >
                        <Music className="h-5 w-5" />
                        Ouvir Prévia Novamente
                      </Button>
                    </>
                  )}
                </div>
                
                <div className="mt-8 text-center">
                  <Button 
                    onClick={() => navigate('/dashboard')}
                    variant="ghost" 
                    className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 flex items-center gap-2 mx-auto"
                  >
                    <Home className="h-4 w-4" />
                    Voltar ao Dashboard
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Confirmacao;
