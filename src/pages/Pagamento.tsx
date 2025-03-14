
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MusicRequest, UserProfile } from "@/types/database.types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ShieldCheck, RefreshCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";
import Loading from "@/components/Loading";

interface PagamentoProps {
  userProfile: UserProfile | null;
}

const Pagamento = ({ userProfile }: PagamentoProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [mercadoPagoLoaded, setMercadoPagoLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const mpContainerRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const musicRequest = location.state?.musicRequest as MusicRequest | undefined;

  // Função para atualizar o status do pagamento no banco de dados
  const updatePaymentStatus = async (requestId: string) => {
    try {
      console.log("Atualizando status de pagamento para:", requestId);
      const { error } = await supabase
        .from('music_requests')
        .update({ payment_status: 'completed' })
        .eq('id', requestId);

      if (error) {
        console.error("Erro ao atualizar status de pagamento:", error);
        throw new Error("Não foi possível atualizar o status de pagamento");
      }
      
      console.log("Status de pagamento atualizado com sucesso");
    } catch (err) {
      console.error("Erro ao processar atualização:", err);
      throw err;
    }
  };

  // Função simulada para processar o pagamento
  const processPayment = async (formData: any) => {
    // Simular um delay de processamento
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  };

  // Efeito para carregar o SDK do Mercado Pago
  useEffect(() => {
    if (!musicRequest) {
      console.error("Nenhum pedido de música encontrado no estado de navegação");
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes do pedido.",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }

    let scriptElement: HTMLScriptElement | null = null;
    
    const loadMercadoPago = () => {
      // Remover qualquer script anterior, se existir
      const existingScript = document.getElementById("mercadopago-script");
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      
      console.log("Carregando SDK do Mercado Pago...");
      scriptElement = document.createElement('script');
      scriptElement.id = "mercadopago-script";
      scriptElement.src = 'https://sdk.mercadopago.com/js/v2';
      scriptElement.async = true;
      scriptElement.onload = () => {
        console.log("SDK do Mercado Pago carregado com sucesso");
        setMercadoPagoLoaded(true);
        setIsLoading(false);
        setScriptError(false);
      };
      scriptElement.onerror = (e) => {
        console.error("Erro ao carregar SDK do Mercado Pago:", e);
        setIsLoading(false);
        setScriptError(true);
        setMercadoPagoLoaded(false);
      };
      document.body.appendChild(scriptElement);
    };

    loadMercadoPago();

    return () => {
      // Remover o script quando o componente for desmontado
      if (scriptElement && document.body.contains(scriptElement)) {
        document.body.removeChild(scriptElement);
      }
    };
  }, [navigate, musicRequest]);

  // Efeito para renderizar o formulário de pagamento após o SDK ser carregado
  useEffect(() => {
    if (!mercadoPagoLoaded || !musicRequest || !mpContainerRef.current) return;

    try {
      console.log("Inicializando formulário de pagamento do Mercado Pago...");
      const mpInstance = new window.MercadoPago('TEST-bf8cace7-cef5-4a9b-90b1-2d639ca50868', {
        locale: 'pt-BR',
      });

      const bricksBuilder = mpInstance.bricks();
      
      const renderPaymentBrick = async () => {
        try {
          // Limpar o container antes de renderizar
          if (mpContainerRef.current) {
            mpContainerRef.current.innerHTML = '';
          }
          
          await bricksBuilder.create("payment", "mercadopago-payment-container", {
            initialization: {
              amount: 79.90,
              payer: {
                email: userProfile?.email || "cliente@teste.com",
              },
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
                setIsLoading(false);
              },
              onSubmit: async (formData) => {
                // Esta função é chamada quando o usuário clica em "Pagar"
                console.log("Dados do formulário:", formData);
                setPaymentProcessing(true);

                try {
                  // Simulando processamento do pagamento
                  console.log("Processando pagamento...");
                  await processPayment(formData);

                  // Atualizar o status do pagamento no banco de dados
                  if (musicRequest?.id) {
                    console.log("Atualizando status de pagamento para o pedido:", musicRequest.id);
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
                  setPaymentProcessing(false);
                }
              },
              onError: (error) => {
                console.error("Erro no formulário:", error);
                toast({
                  title: "Erro no formulário",
                  description: "Ocorreu um erro ao carregar o formulário de pagamento. Tente novamente.",
                  variant: "destructive",
                });
                setScriptError(true);
                setIsLoading(false);
              },
            },
          });
        } catch (error) {
          console.error("Erro ao renderizar o brick de pagamento:", error);
          setScriptError(true);
          setIsLoading(false);
        }
      };

      renderPaymentBrick();
    } catch (error) {
      console.error("Erro ao inicializar o Mercado Pago:", error);
      setScriptError(true);
      setIsLoading(false);
    }
  }, [mercadoPagoLoaded, musicRequest, navigate, userProfile]);

  const handleRetry = () => {
    setIsLoading(true);
    setScriptError(false);
    setMercadoPagoLoaded(false);
    // Forçar recarregamento do SDK
    const script = document.getElementById("mercadopago-script");
    if (script) {
      document.body.removeChild(script);
    }
    window.location.reload();
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
                    <div className="flex justify-between py-2 border-t border-gray-100">
                      <span className="text-gray-600">Gênero</span>
                      <span>{musicRequest.music_genre}</span>
                    </div>
                    <div className="flex justify-between py-2 border-t border-gray-100">
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
              ) : scriptError ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <p className="text-red-500 text-center">
                    Não foi possível carregar o formulário de pagamento.
                  </p>
                  <Button 
                    onClick={handleRetry} 
                    className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    <span>Tentar novamente</span>
                  </Button>
                </div>
              ) : paymentProcessing ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600">Processando seu pagamento...</p>
                </div>
              ) : (
                <div 
                  id="mercadopago-payment-container" 
                  ref={mpContainerRef}
                  className="min-h-[300px]" 
                />
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
