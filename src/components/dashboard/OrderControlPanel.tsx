
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Music, 
  RefreshCw,
  Calendar
} from "lucide-react";
import { MusicRequest } from "@/types/database.types";
import supabase from "@/lib/supabase";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";

interface OrderControlPanelProps {
  userProfile: any;
  userRequests: MusicRequest[];
  onNewRequestClick: () => void;
  onRefreshRequests: () => void;
}

const OrderControlPanel = ({ 
  userProfile, 
  userRequests, 
  onNewRequestClick,
  onRefreshRequests
}: OrderControlPanelProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium";
      case 'in_production':
        return "bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium";
      case 'completed':
        return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium";
      default:
        return "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'in_production':
        return <RefreshCw className="h-4 w-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPaymentStatusBadgeClass = (status: string) => {
    if (!status) return "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'pending':
        return "bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium";
      case 'completed':
        return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium";
      default:
        return "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM, yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  const handleViewRequest = (request: MusicRequest) => {
    if (request.status === 'completed' && request.payment_status === 'completed') {
      navigate("/confirmacao", { state: { musicRequest: request } });
    } else if (request.preview_url) {
      navigate("/music-preview", { state: { musicRequest: request } });
    } else {
      toast({
        title: "Visualização não disponível",
        description: "Este pedido ainda não possui uma prévia disponível.",
      });
    }
  };

  const refreshRequests = () => {
    setIsLoading(true);
    onRefreshRequests();
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="mb-8">
      <Card className="shadow-md border-blue-100">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-blue-700">
                Meus Pedidos de Música
              </CardTitle>
              <CardDescription>
                Acompanhe seus pedidos de músicas personalizadas
              </CardDescription>
            </div>
            <Button
              onClick={refreshRequests}
              variant="outline"
              size="icon"
              className={`rounded-full ${isLoading ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Atualizar</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {userRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Data</TableHead>
                    <TableHead>Homenageado</TableHead>
                    <TableHead>Gênero</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userRequests.map((request) => (
                    <TableRow key={request.id} className="hover:bg-blue-50 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {formatDate(request.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>{request.honoree_name}</TableCell>
                      <TableCell>
                        {request.music_genre === 'romantic' && 'Romântico'}
                        {request.music_genre === 'mpb' && 'MPB'}
                        {request.music_genre === 'classical' && 'Clássico'}
                        {request.music_genre === 'jazz' && 'Jazz'}
                        {request.music_genre === 'hiphop' && 'Hip Hop'}
                        {request.music_genre === 'rock' && 'Rock'}
                        {request.music_genre === 'country' && 'Country'}
                        {request.music_genre === 'reggae' && 'Reggae'}
                        {request.music_genre === 'electronic' && 'Eletrônica'}
                        {request.music_genre === 'samba' && 'Samba'}
                        {request.music_genre === 'folk' && 'Folk'}
                        {request.music_genre === 'pop' && 'Pop'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(request.status)}
                          <span className={getStatusBadgeClass(request.status)}>
                            {request.status === 'pending' && 'Aguardando'}
                            {request.status === 'in_production' && 'Em Produção'}
                            {request.status === 'completed' && 'Concluído'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={getPaymentStatusBadgeClass(request.payment_status)}>
                          {!request.payment_status && 'Pendente'}
                          {request.payment_status === 'pending' && 'Pendente'}
                          {request.payment_status === 'completed' && 'Pago'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => handleViewRequest(request)}
                        >
                          <FileText className="h-4 w-4" />
                          {request.status === 'completed' && request.payment_status === 'completed' 
                            ? 'Acessar' 
                            : 'Visualizar'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 bg-blue-50 rounded-lg">
              <Music className="h-12 w-12 text-blue-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                Nenhum pedido encontrado
              </h3>
              <p className="text-blue-600 mb-4 max-w-md mx-auto">
                Você ainda não fez nenhum pedido de música personalizada.
                Crie seu primeiro pedido agora!
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Até o momento: <strong>{userRequests.length}</strong> pedido(s)
          </p>
          <Button
            onClick={onNewRequestClick}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Pedido
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OrderControlPanel;
