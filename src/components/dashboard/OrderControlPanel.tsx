
import { Button } from "@/components/ui/button";
import { MusicRequest } from "@/types/database.types";
import { PlusCircleIcon, MusicIcon, Loader2 } from "lucide-react";
import NextStepIndicator from "./NextStepIndicator";
import OrderCard from "./OrderCard";

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
  if (isLoading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8 border border-blue-100 flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mr-3" />
        <span className="text-lg font-medium text-gray-700">Carregando seus pedidos...</span>
      </div>
    );
  }

  const hasSubmittedForm = userRequests.length > 0;
  const currentRequest = userRequests.length > 0 ? userRequests[0] : null;

  if (userRequests.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8 border border-blue-100">
        <NextStepIndicator currentRequest={null} hasSubmittedForm={false} />
        
        <div className="text-center mb-6">
          <MusicIcon className="h-12 w-12 text-purple-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Nenhum pedido encontrado</h2>
          <p className="text-gray-600 mb-6">
            Você ainda não criou nenhuma música personalizada. Clique no botão abaixo para começar!
          </p>
          <Button 
            onClick={onCreateNewRequest}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg shadow-md transition-all"
          >
            <PlusCircleIcon className="mr-2 h-5 w-5" />
            Criar nova música
          </Button>
        </div>
      </div>
    );
  }

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
