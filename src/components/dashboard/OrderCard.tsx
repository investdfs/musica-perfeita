
import { MusicRequest } from "@/types/database.types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Music, 
  Heart, 
  HeartPulse,
  CheckCircle, 
  AlertCircle,
  Hourglass
} from "lucide-react";
import MusicPreviewPlayer from "./MusicPreviewPlayer";
import TechnicalDetailsViewer from "../music/TechnicalDetailsViewer";

interface OrderCardProps {
  request: MusicRequest;
}

const OrderCard = ({ request }: OrderCardProps) => {
  // Determinar o status do pedido para exibição
  const getStatusInfo = () => {
    switch (request.status) {
      case 'pending':
        return {
          label: 'Pendente',
          icon: <AlertCircle className="h-4 w-4 mr-1 text-yellow-500" />,
          description: 'Seu pedido está em análise pela nossa equipe.',
          color: 'text-yellow-600'
        };
      case 'in_production':
        return {
          label: 'Em Produção',
          icon: <Hourglass className="h-4 w-4 mr-1 text-blue-500" />,
          description: 'Sua música está sendo produzida! Em breve você receberá uma prévia.',
          color: 'text-blue-600'
        };
      case 'completed':
        return {
          label: 'Concluído',
          icon: <CheckCircle className="h-4 w-4 mr-1 text-green-500" />,
          description: request.payment_status === 'completed' 
            ? 'Sua música está pronta e disponível para download!'
            : 'Sua música está pronta! Faça o pagamento para baixar a versão completa.',
          color: 'text-green-600'
        };
      default:
        return {
          label: 'Desconhecido',
          icon: <AlertCircle className="h-4 w-4 mr-1 text-gray-500" />,
          description: 'Status desconhecido.',
          color: 'text-gray-600'
        };
    }
  };

  const getPaymentStatusInfo = () => {
    if (request.payment_status === 'completed') {
      return {
        label: 'Pago',
        icon: <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
      };
    } else {
      return {
        label: 'Aguardando Pagamento',
        icon: <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
      };
    }
  };

  const statusInfo = getStatusInfo();
  const paymentStatusInfo = getPaymentStatusInfo();

  return (
    <div className="border border-blue-100 rounded-lg overflow-hidden mb-4 bg-white shadow">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              Música para {request.honoree_name}
            </h3>
            <div className="flex flex-wrap items-center text-sm text-gray-500 gap-3 mb-2">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-blue-500" />
                {formatDate(request.created_at)}
              </span>
              <span className="flex items-center">
                <Heart className="h-4 w-4 mr-1 text-pink-500" />
                {request.relationship_type === 'other' 
                  ? request.custom_relationship 
                  : request.relationship_type}
              </span>
              <span className="flex items-center">
                <Music className="h-4 w-4 mr-1 text-purple-500" />
                {request.music_genre}
              </span>
              {request.music_tone && (
                <span className="flex items-center">
                  <HeartPulse className="h-4 w-4 mr-1 text-indigo-500" />
                  {request.music_tone}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:items-end gap-2">
            <Badge variant={request.status === 'completed' ? 'success' : request.status === 'in_production' ? 'info' : 'warning'} className="text-xs">
              <div className="flex items-center">
                {statusInfo.icon}
                {statusInfo.label}
              </div>
            </Badge>
            {request.status === 'completed' && (
              <Badge variant={request.payment_status === 'completed' ? 'success' : 'destructive'} className="text-xs">
                <div className="flex items-center">
                  {paymentStatusInfo.icon}
                  {paymentStatusInfo.label}
                </div>
              </Badge>
            )}
          </div>
        </div>
        
        <p className={`text-sm ${statusInfo.color} mb-4`}>
          {statusInfo.description}
        </p>
        
        {/* Player de música de prévia, se disponível */}
        {(request.preview_url || request.full_song_url) && (
          <div className="mb-4">
            <MusicPreviewPlayer 
              previewUrl={request.preview_url || request.full_song_url || ''}
              fullSongUrl={request.full_song_url}
              isCompleted={request.status === 'completed'}
              paymentStatus={request.payment_status}
            />
          </div>
        )}
        
        {/* Detalhes técnicos, se disponíveis */}
        {request.has_technical_details && (
          <div className="mt-4">
            <TechnicalDetailsViewer request={request} variant="inline" />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
