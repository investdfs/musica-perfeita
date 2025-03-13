
import { Button } from "@/components/ui/button";
import { MusicRequest } from "@/types/database.types";
import { PlusCircleIcon, MusicIcon, Loader2 } from "lucide-react";
import NextStepIndicator from "./NextStepIndicator";
import OrderCard from "./OrderCard";
import { useEffect, useState } from "react";

interface OrderControlPanelProps {
  userRequests: MusicRequest[];
  onCreateNewRequest: () => void;
  isLoading?: boolean;
}

const OrderControlPanel = ({ 
  userRequests, 
  onCreateNewRequest, 
  isLoading = false 
}: OrderControlPanelProps) => {
  const [showLoading, setShowLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Usar um delay para mostrar o spinner apenas se o carregamento demorar mais de 800ms
  useEffect(() => {
    setMounted(true);
    let timer: ReturnType<typeof setTimeout>;
    
    if (isLoading) {
      timer = setTimeout(() => {
        setShowLoading(true);
      }, 800);
    } else {
      setShowLoading(false);
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [isLoading]);

  // Evitar renderização do carregamento no primeiro mount para prevenir piscar
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
  }, []);

  // Mostrar spinner de carregamento
  if (showLoading && mounted) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8 border border-blue-100 flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mr-3" />
        <span className="text-lg font-medium text-gray-700">Carregando seus pedidos...</span>
      </div>
    );
  }

  // Determinar se temos um pedido atual para exibir
  const hasSubmittedForm = userRequests.length > 0;
  const currentRequest = userRequests.length > 0 ? userRequests[0] : null;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8 border border-blue-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Seus pedidos</h2>
        <Button 
          onClick={onCreateNewRequest}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg shadow-sm transition-all flex items-center"
        >
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Nova música
        </Button>
      </div>

      <NextStepIndicator currentRequest={currentRequest} hasSubmittedForm={hasSubmittedForm} />

      {/* Lista de pedidos - mostrar apenas se houver pedidos */}
      {userRequests.length > 0 ? (
        <div className="space-y-2">
          {userRequests.map((request) => (
            <OrderCard key={request.id} request={request} />
          ))}
        </div>
      ) : (
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <MusicIcon className="mx-auto h-10 w-10 text-gray-400 mb-2" />
          <p className="text-gray-600">Você ainda não tem pedidos de música.</p>
          <p className="text-gray-500 text-sm mt-1">Clique no botão "Nova música" para criar seu primeiro pedido.</p>
        </div>
      )}
    </div>
  );
};

export default OrderControlPanel;
