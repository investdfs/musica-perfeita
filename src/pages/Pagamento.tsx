
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MusicRequest, UserProfile } from "@/types/database.types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";

interface PagamentoProps {
  userProfile: UserProfile | null;
}

const Pagamento = ({ userProfile }: PagamentoProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [mercadoPagoLoaded, setMercadoPagoLoaded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const musicRequest = location.state?.musicRequest as MusicRequest | undefined;

  useEffect(() => {
    // Carregar o SDK do Mercado Pago
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.onload = () => {
      setMercadoPagoLoaded(true);
      setIsLoading(false);
    };
    document.body.appendChild(script);

    return () => {
      // Remover o script quando o componente for desmontado
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!mercadoPagoLoaded || !musicRequest) return;

    try {
      // Inicializar o Mercado Pago com a Public Key de testes
      const mp = new window.MercadoPago('TEST-bf8cace7-cef5-4a9b-90b1-2d639ca50868', {
        locale: 'pt-BR',
      });

      // Renderizar o formulário de pagamento
      const bricksBuilder = mp.bricks();
      const renderPaymentBrick = async () => {
        try {
          await bricksBuilder.create("payment", "mercadopago-payment-container", {
            initialization: {
              amount: 79.90,
              preferenceId: '',
            },
            customization: {
              visual: {
                hideFormTitle: true,
                hidePaymentButton: false,
              },
              paymentMethods: {
                maxInstallments: 6,
              },
            },
            callbacks: {
              onReady: () => {
                console.log("Formulário de pagamento pronto");
              },
              onSubmit: async (formData) => {
                // Esta função é chamada quando o usuário clica em "Pagar"
                console.log("Dados do formulário:", formData);
                setIsLoading(true);

                try {
                  // Simulando processamento do pagamento
                  await processPayment(formData);

                  // Atualizar o status do pagamento no banco de dados
                  if (musicRequest?.id) {
                    await updatePaymentStatus(musicRequest.id);
                  }

                  toast({
                    title: "Pagamento aprovado!",
                    description: "Seu pagamento foi processado com sucesso.",
                  });

                  // Redirecionar para a página de confirmação
                  navigate("/dashboard", { state: { paymentSuccess: true } });
                } catch (error) {
                  console.error("Erro ao processar pagamento:", error);
                  toast({
                    title: "Erro no pagamento",
                    description: "Ocorreu um erro ao processar seu pagamento. Tente novamente.",
                    variant: "destructive",
                  });
                  setIsLoading(false);
                }
              },
              onError: (error) => {
                console.error("Erro no formulário:", error);
                toast({
                  title: "Erro no formulário",
                  description: "Ocorreu um erro ao carregar o formulário de pagamento. Tente novamente.",
                  variant: "destructive",
                });
                setIsLoading(false);
              },
            },
          });
        } catch (error) {
          console.error("Erro ao renderizar o brick de pagamento:", error);
        }
      };

      renderPaymentBrick();
    } catch (error) {
      console.error("Erro ao inicializar o Mercado Pago:", error);
      setIsLoading(false);
    }
  }, [mercadoPagoLoaded, musicRequest, navigate]);

  // Função simulada para processar o pagamento
  const processPayment = async (formData: any) => {
    // Simular um delay de processamento
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  };

  // Função para atualizar o status do pagamento no banco de dados
  const updatePaymentStatus = async (requestId: string) => {
    const { error } = await supabase
      .from('music_requests')
      .update({ payment_status: 'completed' })
      .eq('id', requestId);

    if (error) {
      console.error("Erro ao atualizar status de pagamento:", error);
      throw new Error("Não foi possível atualizar o status de pagamento");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Header />
      <main className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 bg-gradient-to-r from-yellow-400 via-pink-500 to-green-400 bg-clip-text text-transparent">
            Finalize o Pagamento para sua Música!
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold mb-6">Resumo do Pedido</h2>
              
              {musicRequest ? (
                <div className="space-y-4 mb-6">
                  <div className="text-sm">
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Música para</span>
                      <span className="font-medium">{musicRequest.honoree_name}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Gênero</span>
                      <span>{musicRequest.music_genre}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Status</span>
                      <span className={musicRequest.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}>
                        {musicRequest.status === 'completed' ? 'Concluída' : 'Em produção'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 mb-6">Detalhes da música não disponíveis.</p>
              )}
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-xl font-bold mb-2">
                  <span>Total</span>
                  <span>R$ 79,90</span>
                </div>
                <p className="text-sm text-gray-500">Pagamento único, sem assinaturas</p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-start">
                  <ShieldCheck className="h-5 w-5 text-indigo-500 mr-3 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    Pagamento 100% seguro. Se não gostar, devolvemos seu dinheiro.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold mb-6">Formulário de Pagamento</h2>
              
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600">Carregando formulário de pagamento...</p>
                </div>
              ) : (
                <>
                  <div id="mercadopago-payment-container" className="mb-6"></div>
                  
                  {!mercadoPagoLoaded && (
                    <Button 
                      onClick={() => window.location.reload()} 
                      className="w-full bg-gray-500 hover:bg-gray-600 mb-6 h-12 text-base"
                    >
                      Recarregar Página
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Adicionar a definição do Mercado Pago ao window
declare global {
  interface Window {
    MercadoPago: any;
  }
}

export default Pagamento;
