
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hourglass } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const ProcessandoPagamento = () => {
  const [elapsedTime, setElapsedTime] = useState(50); // Fixar em 50% para mostrar que está em processamento
  const navigate = useNavigate();
  
  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 to-white">
      <Header />
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8 text-center">
          <div className="py-6">
            <div className="mx-auto mb-8 w-24 h-24 relative">
              <Hourglass className="w-24 h-24 text-indigo-500 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-semibold text-indigo-700">{elapsedTime}%</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Processando seu pagamento</h2>
            
            <div className="space-y-3 mb-6">
              <p className="text-gray-600">
                Seu pagamento está sendo processado pela nossa equipe financeira.
                Este é um procedimento normal e pode levar alguns instantes.
              </p>
              
              <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4 text-left">
                <h3 className="font-medium text-blue-800 mb-2">O que acontece agora?</h3>
                <ul className="text-blue-700 space-y-2 pl-5 list-disc">
                  <li>Estamos processando sua transação com segurança</li>
                  <li>Assim que aprovado, sua música entrará em produção</li>
                  <li>Nossa equipe criativa começará a trabalhar imediatamente</li>
                  <li>Você poderá acompanhar todo o progresso no seu dashboard</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-2 mt-8">
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-200 ease-in-out" 
                  style={{ width: `${elapsedTime}%` }}
                ></div>
              </div>
              <p className="text-gray-500 text-sm mb-6">Aguarde o processamento completo</p>
              
              <Button 
                variant="outline" 
                onClick={handleBackToDashboard}
                className="mx-auto mt-6"
              >
                Voltar para o Dashboard
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProcessandoPagamento;
