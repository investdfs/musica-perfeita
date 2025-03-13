
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MusicRequest } from "@/types/database.types";
import { ChevronDown, ChevronUp, Clock, Play, Music, CheckCircle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface OrderCardProps {
  request: MusicRequest;
}

const OrderCard = ({ request }: OrderCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const getStatusBadge = () => {
    switch (request.status) {
      case 'pending':
        return (
          <div className="flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </div>
        );
      case 'in_production':
        return (
          <div className="flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
            <svg className="animate-spin w-3 h-3 mr-1" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Em Produção
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
            <CheckCircle className="w-3 h-3 mr-1" />
            Concluído
          </div>
        );
      default:
        return null;
    }
  };

  const getPaymentBadge = () => {
    switch (request.payment_status) {
      case 'pending':
        return (
          <div className="flex items-center px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
            <DollarSign className="w-3 h-3 mr-1" />
            Não Pago
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
            <CheckCircle className="w-3 h-3 mr-1" />
            Pago
          </div>
        );
      default:
        return null;
    }
  };

  const showPreviewButton = request.status === 'completed' && request.preview_url;

  return (
    <Card className="border-blue-100 hover:shadow-md transition-all duration-200 overflow-hidden mb-3">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <h3 className="font-medium text-gray-900 truncate">
                Para: {request.honoree_name}
              </h3>
              <p className="text-sm text-gray-500">
                Criado em: {formatDate(request.created_at)}
              </p>
            </div>
            
            <div className="flex gap-2">
              {getStatusBadge()}
              {getPaymentBadge()}
            </div>
          </div>
          
          {showPreviewButton && (
            <div className="mt-3 flex justify-center">
              <Button 
                onClick={() => navigate("/music-player", { state: { musicRequest: request } })}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <Play className="mr-2 h-4 w-4" />
                Ouvir Prévia
              </Button>
            </div>
          )}
          
          <button 
            onClick={() => setExpanded(!expanded)}
            className="mt-3 w-full flex items-center justify-center text-gray-500 hover:text-gray-700 text-sm"
          >
            {expanded ? (
              <>Mostrar menos <ChevronUp className="h-4 w-4 ml-1" /></>
            ) : (
              <>Ver detalhes <ChevronDown className="h-4 w-4 ml-1" /></>
            )}
          </button>
        </div>
        
        {expanded && (
          <div className="px-4 pb-4 pt-1 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
              <div>
                <p className="font-medium text-gray-700">Relacionamento</p>
                <p className="text-gray-600">{request.relationship_type}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Gênero</p>
                <p className="text-gray-600">{request.music_genre}</p>
              </div>
              {request.music_tone && (
                <div>
                  <p className="font-medium text-gray-700">Tom</p>
                  <p className="text-gray-600">{request.music_tone}</p>
                </div>
              )}
              {request.voice_type && (
                <div>
                  <p className="font-medium text-gray-700">Voz</p>
                  <p className="text-gray-600">{request.voice_type.replace('_', ' ')}</p>
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">História</p>
              <p className="text-gray-600 text-sm line-clamp-3">{request.story}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderCard;
