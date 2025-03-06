
import { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { 
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MusicRequest } from "@/types/database.types";
import { Calendar, FileText, Music, CheckCircle, Clock, AlertCircle, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OrderControlPanelProps {
  userRequests: MusicRequest[];
  onCreateNewRequest: () => void;
}

const OrderControlPanel = ({ userRequests, onCreateNewRequest }: OrderControlPanelProps) => {
  const navigate = useNavigate();
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusIcon = (status: string, paymentStatus: string | null) => {
    if (status === 'completed' && paymentStatus === 'completed') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (status === 'completed' && paymentStatus !== 'completed') {
      return <AlertCircle className="h-5 w-5 text-orange-500" />;
    } else if (status === 'in_production') {
      return <Clock className="h-5 w-5 text-blue-500" />;
    } else {
      return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string, paymentStatus: string | null) => {
    if (status === 'completed' && paymentStatus === 'completed') {
      return "Concluído";
    } else if (status === 'completed' && paymentStatus !== 'completed') {
      return "Pronto, pagamento pendente";
    } else if (status === 'in_production') {
      return "Em produção";
    } else {
      return "Aguardando produção";
    }
  };

  const getGenreTranslation = (genre: string): string => {
    const genres: Record<string, string> = {
      'romantic': 'Romântica',
      'mpb': 'MPB',
      'classical': 'Clássica',
      'jazz': 'Jazz',
      'hiphop': 'Hip Hop',
      'rock': 'Rock',
      'country': 'Country',
      'reggae': 'Reggae',
      'electronic': 'Eletrônica',
      'samba': 'Samba',
      'folk': 'Folk',
      'pop': 'Pop'
    };
    return genres[genre] || genre;
  };

  const handleViewDetails = (requestId: string) => {
    const request = userRequests.find(req => req.id === requestId);
    if (!request) return;

    if (request.status === 'completed' && request.payment_status !== 'completed') {
      navigate("/music-preview", { state: { musicRequest: request } });
    } else if (request.status === 'completed' && request.payment_status === 'completed') {
      navigate("/confirmacao", { state: { musicRequest: request } });
    }
  };

  const toggleDetails = (requestId: string) => {
    if (expandedRequest === requestId) {
      setExpandedRequest(null);
    } else {
      setExpandedRequest(requestId);
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-100 transition-all mb-8">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold text-indigo-700">
          Controle de Pedidos
        </CardTitle>
        <Button 
          onClick={onCreateNewRequest}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
        >
          <Plus className="mr-1 h-4 w-4" />
          Novo Pedido
        </Button>
      </CardHeader>
      <CardContent>
        {userRequests.length === 0 ? (
          <div className="text-center py-10">
            <Music className="mx-auto h-12 w-12 text-indigo-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum pedido encontrado</h3>
            <p className="text-gray-500 mb-4">Você ainda não fez nenhum pedido de música.</p>
            <Button 
              onClick={onCreateNewRequest}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
            >
              <Plus className="mr-1 h-4 w-4" />
              Fazer Meu Primeiro Pedido
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Para</TableHead>
                  <TableHead className="hidden md:table-cell">Gênero</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userRequests.map((request) => (
                  <>
                    <TableRow key={request.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium flex items-center whitespace-nowrap">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {formatDate(request.created_at)}
                      </TableCell>
                      <TableCell className="font-medium">{request.honoree_name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getGenreTranslation(request.music_genre)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getStatusIcon(request.status, request.payment_status)}
                          <span className="ml-2">{getStatusText(request.status, request.payment_status)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleDetails(request.id)}
                          >
                            <FileText className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-2">Detalhes</span>
                          </Button>
                          {(request.status === 'completed') && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleViewDetails(request.id)}
                            >
                              <Music className="h-4 w-4" />
                              <span className="sr-only md:not-sr-only md:ml-2">Acessar</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedRequest === request.id && (
                      <TableRow>
                        <TableCell colSpan={5} className="p-4 bg-blue-50">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h4 className="font-semibold text-sm text-gray-600 mb-1">História</h4>
                              <p className="text-sm text-gray-800 bg-white p-2 rounded border border-gray-200">
                                {request.story.length > 150 
                                  ? `${request.story.substring(0, 150)}...` 
                                  : request.story}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm text-gray-600 mb-1">Relacionamento</h4>
                              <p className="text-sm text-gray-800">
                                {request.relationship_type === 'other' 
                                  ? request.custom_relationship 
                                  : request.relationship_type}
                              </p>
                              {request.include_names && (
                                <>
                                  <h4 className="font-semibold text-sm text-gray-600 mb-1 mt-3">Nomes incluídos</h4>
                                  <p className="text-sm text-gray-800">{request.names_to_include}</p>
                                </>
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm text-gray-600 mb-1">Status do Pagamento</h4>
                              <p className="text-sm text-gray-800">
                                {request.payment_status === 'completed' 
                                  ? 'Pago' 
                                  : 'Pendente'}
                              </p>
                              {request.status === 'completed' && request.payment_status !== 'completed' && (
                                <Button
                                  className="mt-3 w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black"
                                  size="sm"
                                  onClick={() => navigate("/pagamento", { state: { musicRequest: request } })}
                                >
                                  Realizar Pagamento
                                </Button>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-gray-100 text-xs text-gray-500 pt-4">
        Mostrando {userRequests.length} pedido(s). Cada pedido representa uma música personalizada.
      </CardFooter>
    </Card>
  );
};

export default OrderControlPanel;
