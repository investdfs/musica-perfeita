
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MusicRequest, UserProfile } from "@/types/database.types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Music, ShieldCheck, CreditCard, Clock, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PagamentoProps {
  userProfile: UserProfile | null;
}

const Pagamento = ({ userProfile }: PagamentoProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const musicRequest = location.state?.musicRequest as MusicRequest | undefined;

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Abre o link do Mercado Pago em nova janela
    window.open("https://mpago.la/2WyrDAe", "_blank");
    
    // Simulating payment process
    setTimeout(() => {
      toast({
        title: "Pagamento iniciado!",
        description: "Acompanhe o processo no Mercado Pago.",
      });
      
      setIsProcessing(false);
      navigate("/confirmacao", { state: { musicRequest } });
    }, 2000);
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent animate-gradient-background">
            Música Perfeita Aguarda Você!
          </h1>
          
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto text-lg">
            Estamos a apenas um passo de criar sua música personalizada. 
            Complete o pagamento para desbloquear sua experiência musical única.
          </p>
          
          <div className="grid md:grid-cols-2 gap-10">
            {/* Cartão de resumo do pedido */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Music className="h-6 w-6 mr-3" />
                  Resumo da Sua Música
                </h2>
              </div>
              
              <div className="p-8">
                {musicRequest ? (
                  <div className="space-y-6">
                    <div className="flex items-center pb-4 border-b border-gray-100">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                        <Music className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-xl text-gray-800">Música Personalizada</h3>
                        <p className="text-purple-600">Para: {musicRequest.honoree_name}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500 font-medium">Gênero Musical</span>
                        <span className="font-medium text-indigo-600">{musicRequest.music_genre}</span>
                      </div>
                      
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500 font-medium">Status</span>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          Aguardando Pagamento
                        </span>
                      </div>
                      
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500 font-medium">Data da Solicitação</span>
                        <span className="font-medium">{new Date(musicRequest.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 bg-indigo-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
                        <p className="text-sm text-gray-700">
                          Ao concluir o pagamento, sua música completa será liberada para você imediatamente!
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Music className="h-8 w-8 text-red-500" />
                    </div>
                    <p className="text-gray-500 mb-4">Detalhes da música não disponíveis.</p>
                    <Button 
                      onClick={() => navigate('/dashboard')} 
                      variant="outline"
                      className="mx-auto"
                    >
                      Voltar ao Dashboard
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Cartão de pagamento */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <CreditCard className="h-6 w-6 mr-3" />
                  Finalizar Pagamento
                </h2>
              </div>
              
              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Valor</h3>
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <span className="text-gray-700 font-medium">Total a pagar</span>
                    <span className="text-2xl font-bold text-purple-700">R$ 79,90</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 text-right">Pagamento único, sem assinaturas</p>
                </div>
                
                <div className="space-y-6">
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 mb-8">
                    <img 
                      src="https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/chamada-pix-mercado-pago.jpg" 
                      alt="Mercado Pago - Pagamento via PIX" 
                      className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-300"
                      style={{ maxHeight: "180px" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-end">
                      <p className="text-white p-3 font-medium text-sm">Pague via PIX ou cartão de crédito</p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handlePayment} 
                    className="w-full h-14 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 group"
                    disabled={isProcessing}
                  >
                    <Lock className="mr-2 h-5 w-5 text-indigo-200 group-hover:animate-pulse" />
                    {isProcessing ? "Processando..." : "Pagar com Mercado Pago"}
                  </Button>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex items-start">
                      <div className="bg-green-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-600">
                        Acesso instantâneo à sua música personalizada após confirmação do pagamento.
                      </p>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-green-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-600">
                        Download em alta qualidade para ouvir quando e onde quiser.
                      </p>
                    </div>
                    
                    <div className="flex items-start">
                      <ShieldCheck className="h-5 w-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600">
                        Transação 100% segura. Satisfação garantida ou seu dinheiro de volta.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Seção de depoimentos/benefícios */}
          <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
            <h3 className="text-xl font-bold text-center mb-8 text-gray-800">Por que escolher a Música Perfeita?</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 hover:bg-purple-50 rounded-xl transition-colors duration-300">
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="h-6 w-6 text-indigo-600" />
                </div>
                <h4 className="font-medium mb-2 text-gray-800">Qualidade Profissional</h4>
                <p className="text-sm text-gray-600">Músicas compostas e produzidas por artistas experientes com estúdio profissional.</p>
              </div>
              
              <div className="text-center p-4 hover:bg-purple-50 rounded-xl transition-colors duration-300">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-medium mb-2 text-gray-800">Entrega Rápida</h4>
                <p className="text-sm text-gray-600">Sua música estará pronta e disponível para download imediatamente após o pagamento.</p>
              </div>
              
              <div className="text-center p-4 hover:bg-purple-50 rounded-xl transition-colors duration-300">
                <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="h-6 w-6 text-pink-600" />
                </div>
                <h4 className="font-medium mb-2 text-gray-800">Garantia de Satisfação</h4>
                <p className="text-sm text-gray-600">Se não ficar satisfeito, devolvemos seu dinheiro sem questionamentos.</p>
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
