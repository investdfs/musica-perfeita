import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Pagamento = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

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
      navigate("/confirmacao");
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
          
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold mb-6">Sua música está quase pronta!</h2>
            
            <p className="mb-8 text-lg">
              Pague com segurança e receba sua música completa após a confirmação!
            </p>
            
            <div className="mb-8">
              <p className="text-2xl font-bold mb-2">R$ 79,90</p>
              <p className="text-sm text-gray-500">Pagamento único, sem assinaturas</p>
            </div>
            
            <Button 
              onClick={handlePayment} 
              className="w-full bg-blue-500 hover:bg-blue-600 mb-6"
              disabled={isProcessing}
            >
              {isProcessing ? "Processando..." : "Pagar com Mercado Pago"}
            </Button>
            
            <p className="text-sm text-gray-600">
              Sem custo antecipado. Pague só após aprovar!
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pagamento;
