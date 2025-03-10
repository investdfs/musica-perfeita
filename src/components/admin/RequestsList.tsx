
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MusicRequest } from "@/types/database.types";
import { Send, Download, Save, ExternalLink, Music } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";

interface RequestsListProps {
  requests: MusicRequest[];
  isLoading: boolean;
  getUserName: (userId: string) => string;
  onViewDetails: (request: MusicRequest) => void;
  onUpdateStatus: (requestId: string, status?: MusicRequest['status'], paymentStatus?: MusicRequest['payment_status']) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, request: MusicRequest) => void;
  onDeliverMusic: (request: MusicRequest) => void;
  onDownloadFile?: (request: MusicRequest) => void;
  isUploading: boolean;
  selectedRequestId: string | null;
}

const RequestsList = ({ 
  requests, 
  isLoading, 
  getUserName,
  onViewDetails, 
  onUpdateStatus, 
  onFileUpload, 
  onDeliverMusic,
  onDownloadFile,
  isUploading,
  selectedRequestId
}: RequestsListProps) => {
  const [soundcloudIds, setSoundcloudIds] = useState<{[key: string]: string}>({});

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handleSoundCloudIdChange = (requestId: string, value: string) => {
    setSoundcloudIds(prev => ({
      ...prev,
      [requestId]: value
    }));
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Lista de Pedidos</h2>
      
      {isLoading ? (
        <p className="text-center py-8 text-gray-700">Carregando pedidos...</p>
      ) : requests.length === 0 ? (
        <p className="text-center py-8 text-gray-700">Nenhum pedido encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px] text-gray-700">Cliente</TableHead>
                <TableHead className="w-[150px] text-gray-700">Homenageado</TableHead>
                <TableHead className="w-[120px] text-gray-700">Status</TableHead>
                <TableHead className="w-[120px] text-gray-700">Pagamento</TableHead>
                <TableHead className="w-[100px] text-gray-700">Data</TableHead>
                <TableHead className="text-gray-700">Link da Música</TableHead>
                <TableHead className="w-[100px] text-right text-gray-700">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium truncate max-w-[150px] text-gray-900">
                    {getUserName(request.user_id)}
                    <div className="text-xs text-gray-500 mt-1">ID: {request.id.substring(0, 6)}...</div>
                  </TableCell>
                  <TableCell className="truncate max-w-[150px] text-gray-900">{request.honoree_name}</TableCell>
                  <TableCell>
                    <Badge variant={
                      request.status === 'pending' ? 'warning' : 
                      request.status === 'in_production' ? 'info' : 'success'
                    }>
                      {request.status === 'pending' 
                        ? 'Pendente' 
                        : request.status === 'in_production' 
                          ? 'Em Produção' 
                          : 'Concluído'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={request.payment_status === 'pending' ? 'destructive' : 'success'}>
                      {request.payment_status === 'pending' ? 'Não Pago' : 'Pago'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-900">{formatDate(request.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Input
                        type="text"
                        className="h-8 text-xs"
                        placeholder="Link Música"
                        value={soundcloudIds[request.id] || ''}
                        onChange={(e) => handleSoundCloudIdChange(request.id, e.target.value)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewDetails(request)}
                        disabled={!soundcloudIds[request.id]?.trim()}
                        className="h-8 w-8 ml-1"
                        title="Salvar Link"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      {request.status === 'completed' && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onDeliverMusic(request)}
                            className="h-8 w-8"
                            title="Entregar Música"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                          
                          {onDownloadFile && request.full_song_url && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => onDownloadFile && onDownloadFile(request)}
                              className="h-8 w-8"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>Opções do Pedido</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem onClick={() => onViewDetails(request)}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Alterar Status</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => onUpdateStatus(request.id, 'pending')}>
                            Status: Pendente
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateStatus(request.id, 'in_production')}>
                            Status: Em Produção
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateStatus(request.id, 'completed')}>
                            Status: Concluído
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Alterar Pagamento</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => onUpdateStatus(request.id, undefined, 'pending')}>
                            Pagamento: Não Pago
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateStatus(request.id, undefined, 'completed')}>
                            Pagamento: Pago
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};

export default RequestsList;
