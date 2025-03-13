
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
  // Estado para controlar a exibição do spinner de carregamento para evitar flash constante
  const [showLoading, setShowLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // CORREÇÃO CRÍTICA: Adicionar estado de visibilidade
  
  // CORREÇÃO CRÍTICA: Verificar se temos pedidos sempre que userRequests mudar
  useEffect(() => {
    console.log('[OrderControlPanel] Pedidos atualizados:', userRequests.length);
    
    // CORREÇÃO CRÍTICA: Se não há pedidos, ocultar o painel
    if (userRequests.length === 0) {
      console.log('[OrderControlPanel] Sem pedidos, ocultando painel');
      setIsVisible(false);
    } else {
      console.log('[OrderControlPanel] Pedidos encontrados, mostrando painel');
      setIsVisible(true);
    }
  }, [userRequests]);
  
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

  // Adicionar log para acompanhar a renderização
  useEffect(() => {
    console.log('[OrderControlPanel] Estado atualizado:', { 
      isLoading, 
      showLoading, 
      userRequestsCount: userRequests.length,
      isVisible 
    });
  }, [userRequests, isLoading, showLoading, isVisible]);

  // CORREÇÃO CRÍTICA: Se o painel não deve ser visível, não renderizar nada
  if (!isVisible) {
    console.log('[OrderControlPanel] Painel de controle oculto');
    return null;
  }

  // Mostrar spinner de carregamento
  if (showLoading && mounted) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8 border border-blue-100 flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mr-3" />
        <span className="text-lg font-medium text-gray-700">Carregando seus pedidos...</span>
      </div>
    );
  }

  // CORREÇÃO CRÍTICA: Se não há pedidos, não renderizar o painel (dupla verificação)
  if (userRequests.length === 0) {
    console.log('[OrderControlPanel] Sem pedidos, não renderizando');
    return null;
  }

  const hasSubmittedForm = userRequests.length > 0;
  const currentRequest = userRequests.length > 0 ? userRequests[0] : null;

  // CORREÇÃO CRÍTICA: Renderizar o painel de pedidos
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

      <div className="space-y-2">
        {userRequests.map((request) => (
          <OrderCard key={request.id} request={request} />
        ))}
      </div>
    </div>
  );
};

export default OrderControlPanel;
