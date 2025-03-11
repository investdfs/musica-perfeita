
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MusicRequest } from "@/types/database.types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Music, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Pagamento = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const musicRequest = location.state?.musicRequest as MusicRequest | undefined;

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulating payment process
    setTimeout(() => {
      // In a real application, this would redirect to a payment gateway
      toast({
        title: "Pagamento simulado com sucesso!",
        description: "Em um ambiente real, você seria redirecionado para o Mercado Pago.",
      });
      
      setIsProcessing(false);
      navigate("/confirmacao", { state: { musicRequest } });
    }, 2000);
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
                  <div className="flex items-center border-b pb-4">
                    <Music className="text-indigo-500 h-8 w-8 mr-4" />
                    <div>
                      <p className="font-medium">Música Personalizada</p>
                      <p className="text-gray-600">Para: {musicRequest.honoree_name}</p>
                    </div>
                  </div>
                  
                  <div className="text-sm">
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
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold mb-6">Método de Pagamento</h2>
              
              <div className="space-y-6">
                <div className="mb-6">
                  <img 
                    src="https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/chamada-pix-mercado-pago.jpg" 
                    alt="Mercado Pago - Pagamento via PIX" 
                    className="max-w-full h-auto mx-auto rounded-lg shadow-sm"
                    style={{ maxHeight: "180px" }}
                  />
                </div>
                
                <Button 
                  onClick={handlePayment} 
                  className="w-full bg-blue-500 hover:bg-blue-600 mb-6 h-14 text-lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processando..." : "Pagar com Mercado Pago"}
                </Button>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Ao finalizar o pagamento, você terá acesso imediato à versão completa.
                    </p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Você poderá baixar e compartilhar sua música após a confirmação do pagamento.
                    </p>
                  </div>
                  
                  <div className="flex items-start">
                    <ShieldCheck className="h-5 w-5 text-indigo-500 mr-3 mt-0.5" />
                    <p className="text-sm text-gray-600">
                      Pagamento 100% seguro. Se não gostar, devolvemos seu dinheiro.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pagamento;
