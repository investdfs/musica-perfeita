
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MusicRequest } from "@/types/database.types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  MusicIcon, 
  PlusCircleIcon, 
  Clock, 
  CheckCircle2, 
  CircleDollarSign, 
  Loader2 
} from "lucide-react";

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
  const [loadingRequestId, setLoadingRequestId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Aguardando produção";
      case "in_production":
        return "Em produção";
      case "completed":
        return "Concluído";
      default:
        return "Status desconhecido";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "in_production":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPaymentStatusIcon = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "pending":
        return <CircleDollarSign className="h-5 w-5 text-yellow-500" />;
      case "processing":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <CircleDollarSign className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPaymentStatusLabel = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "pending":
        return "Aguardando pagamento";
      case "processing":
        return "Processando pagamento";
      case "completed":
        return "Pagamento concluído";
      default:
        return "Status de pagamento desconhecido";
    }
  };

  const handleRequestItemClick = (requestId: string) => {
    setLoadingRequestId(requestId);
    // Simula um tempo de carregamento para melhorar a experiência do usuário
    setTimeout(() => {
      setLoadingRequestId(null);
      // Implementar navegação para detalhes do pedido quando disponível
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8 border border-blue-100 flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mr-3" />
        <span className="text-lg font-medium text-gray-700">Carregando seus pedidos...</span>
      </div>
    );
  }

  if (userRequests.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8 border border-blue-100">
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Seus pedidos</h2>
        <Button 
          onClick={onCreateNewRequest}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg shadow-sm transition-all flex items-center"
        >
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          Nova música
        </Button>
      </div>

      <div className="space-y-4">
        {userRequests.map((request) => (
          <div 
            key={request.id} 
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer bg-white"
            onClick={() => handleRequestItemClick(request.id)}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <div className="mb-2 sm:mb-0">
                <p className="font-semibold text-gray-800">
                  Para: {request.honoree_name}
                </p>
                <p className="text-sm text-gray-500">
                  Criado em: {formatDate(request.created_at)}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {loadingRequestId === request.id ? (
                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                  ) : (
                    getStatusIcon(request.status)
                  )}
                  <span className="ml-1 text-sm">
                    {getStatusLabel(request.status)}
                  </span>
                </div>
                <div className="flex items-center">
                  {getPaymentStatusIcon(request.payment_status)}
                  <span className="ml-1 text-sm">
                    {getPaymentStatusLabel(request.payment_status)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-2">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Gênero:</span> {request.music_genre}
              </p>
              <p className="text-sm text-gray-700 line-clamp-1">
                <span className="font-medium">História:</span> {request.story.substring(0, 100)}
                {request.story.length > 100 ? "..." : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderControlPanel;
