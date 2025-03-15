
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MusicRequest, UserProfile } from "@/types/database.types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CreditCard, Lock, Loader2, ShieldCheck, ArrowLeft, ShoppingCart } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validateMusicRequest } from "@/utils/validationUtils";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/product.types";
import { ProductCard } from "@/components/payment/ProductCard";

interface PagamentoProps {
  userProfile: UserProfile | null;
}

const Pagamento = ({ userProfile }: PagamentoProps) => {
  const { products, isLoading: isLoadingProducts, error: productsError } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [musicRequest, setMusicRequest] = useState<MusicRequest | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  
  const verifyUserAccess = async (requestId: string, userId?: string) => {
    if (!userId) return false;
    
    try {
      const { data, error } = await supabase
        .from('music_requests')
        .select('user_id')
        .eq('id', requestId)
        .single();
      
      if (error) {
        console.error("Erro ao verificar acesso:", error);
        return false;
      }
      
      return data.user_id === userId;
    } catch (error) {
      console.error("Erro ao verificar permissão:", error);
      return false;
    }
  };
  
  useEffect(() => {
    const loadMusicRequestData = async () => {
      setIsLoading(true);
      
      try {
        if (location.state?.musicRequest) {
          console.log("Dados da música recebidos do state:", location.state.musicRequest);
          
          if (userProfile?.id) {
            const hasAccess = await verifyUserAccess(
              location.state.musicRequest.id, 
              userProfile.id
            );
            
            if (!hasAccess) {
              console.error("Usuário não tem permissão para acessar este pedido");
              toast({
                title: "Acesso negado",
                description: "Você não tem permissão para acessar este pedido",
                variant: "destructive",
              });
              navigate("/dashboard");
              return;
            }
          }
          
          const validatedRequest = validateMusicRequest(location.state.musicRequest);
          setMusicRequest(validatedRequest);
        } 
        else {
          const savedRequest = localStorage.getItem("current_music_request");
          
          if (savedRequest) {
            const parsedRequest = JSON.parse(savedRequest);
            console.log("Dados da música recuperados do localStorage:", parsedRequest);
            
            if (userProfile?.id) {
              const hasAccess = await verifyUserAccess(parsedRequest.id, userProfile.id);
              
              if (!hasAccess) {
                console.error("Usuário não tem permissão para acessar este pedido");
                toast({
                  title: "Acesso negado",
                  description: "Você não tem permissão para acessar este pedido",
                  variant: "destructive",
                });
                navigate("/dashboard");
                return;
              }
            }
            
            const validatedRequest = validateMusicRequest(parsedRequest);
            setMusicRequest(validatedRequest);
          } else {
            if (userProfile?.id) {
              console.log("Buscando pedidos do usuário do banco de dados");
              const { data, error } = await supabase
                .from('music_requests')
                .select('*')
                .eq('user_id', userProfile.id)
                .order('created_at', { ascending: false })
                .limit(1);
                
              if (error) {
                console.error("Erro ao buscar pedido:", error);
                toast({
                  title: "Erro",
                  description: "Não foi possível carregar os detalhes da música",
                  variant: "destructive",
                });
              } else if (data && data.length > 0) {
                console.log("Pedido encontrado no banco:", data[0]);
                
                const validatedRequest = validateMusicRequest(data[0]);
                setMusicRequest(validatedRequest);
              } else {
                console.error("Nenhum pedido encontrado para este usuário");
                toast({
                  title: "Erro",
                  description: "Você não possui pedidos de música",
                  variant: "destructive",
                });
                navigate("/dashboard");
              }
            } else {
              console.error("Usuário não está logado e não há dados do pedido");
              toast({
                title: "Erro",
                description: "Não foi possível carregar os detalhes da música",
                variant: "destructive",
              });
              navigate("/dashboard");
            }
          }
        }
      } catch (error) {
        console.error("Erro ao processar dados do pedido:", error);
        toast({
          title: "Erro",
          description: "Houve um problema ao carregar os detalhes. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMusicRequestData();
  }, [location.state, navigate, userProfile]);

  useEffect(() => {
    // Seleciona automaticamente o primeiro produto quando a lista é carregada
    if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0]);
    }
  }, [products]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handlePayment = () => {
    if (!musicRequest) {
      toast({
        title: "Erro",
        description: "Dados da música não disponíveis",
        variant: "destructive",
      });
      return;
    }

    if (!selectedProduct) {
      toast({
        title: "Atenção",
        description: "Por favor, selecione um produto para continuar",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    const requestId = musicRequest.id;
    const userId = userProfile?.id || 'guest';
    
    const baseUrl = window.location.origin;
    const successUrl = `${baseUrl}/confirmacao?request_id=${requestId}&user_id=${userId}&status=success`;
    const failureUrl = `${baseUrl}/confirmacao?request_id=${requestId}&user_id=${userId}&status=failure`;
    
    console.log("URLs de retorno para configurar no Mercado Pago:");
    console.log("URL de sucesso:", successUrl);
    console.log("URL de falha:", failureUrl);
    
    toast({
      title: "Redirecionando para o pagamento",
      description: "Você será redirecionado para a página de pagamento em instantes...",
      duration: 3000,
    });
    
    // Abre o link de pagamento do produto selecionado
    window.open(selectedProduct.paymentLink, "_blank");
    
    setTimeout(() => {
      toast({
        title: "Pagamento iniciado!",
        description: "Acompanhe o processo no Mercado Pago. Após completar, você será redirecionado automaticamente.",
      });
      
      setIsProcessing(false);
      
      localStorage.setItem("payment_pending_request", JSON.stringify({
        requestId,
        userId,
        timestamp: new Date().toISOString()
      }));
      
      navigate("/processando-pagamento", { state: { musicRequest } });
    }, 2000);
  };

  const goBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <Header />
      
      <div className="animated-shapes opacity-20">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      <main className="py-16 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={goBack} 
            className="mb-8 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
          
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent animate-gradient-background">
            Escolha seu Plano
          </h1>
          
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto text-lg">
            Selecione o plano ideal para sua música personalizada e prepare-se para uma experiência musical única.
          </p>
          
          {isLoading || isLoadingProducts ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando opções de produtos...</p>
            </div>
          ) : productsError ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <p className="text-red-500 mb-4">{productsError}</p>
              <Button onClick={goBack} variant="outline">Voltar ao Dashboard</Button>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum produto disponível</h3>
              <p className="text-gray-500 mb-4">No momento não há produtos disponíveis para compra.</p>
              <Button onClick={goBack} variant="outline">Voltar ao Dashboard</Button>
            </div>
          ) : (
            <>
              <div className="grid gap-8 md:grid-cols-2 md:gap-10">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={handleProductSelect}
                    isSelected={selectedProduct?.id === product.id}
                  />
                ))}
              </div>
              
              <div className="mt-12 flex flex-col items-center">
                <Button 
                  onClick={handlePayment} 
                  disabled={isProcessing || !selectedProduct}
                  className="px-8 py-6 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/30"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-5 w-5" />
                      Prosseguir para o Pagamento
                    </>
                  )}
                </Button>
                
                <div className="flex items-center mt-6 text-sm text-gray-500">
                  <ShieldCheck className="h-4 w-4 mr-2 text-green-600" />
                  Pagamento seguro via Mercado Pago
                </div>
              </div>
              
              <div className="mt-12 bg-white rounded-2xl shadow-md p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-purple-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">Formas de Pagamento Aceitas</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Aceitamos PIX, cartões de crédito, débito e boleto bancário através do Mercado Pago.
                </p>
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pagamento;
