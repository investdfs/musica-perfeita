
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
import { Send, Download, Save } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
      <h2 className="text-xl font-semibold mb-6">Lista de Pedidos</h2>
      
      {isLoading ? (
        <p className="text-center py-8">Carregando pedidos...</p>
      ) : requests.length === 0 ? (
        <p className="text-center py-8">Nenhum pedido encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead className="w-[120px]">Cliente</TableHead>
                <TableHead className="w-[120px]">Homenageado</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[100px]">Pagamento</TableHead>
                <TableHead className="w-[100px]">Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-mono text-xs">{request.id.substring(0, 6)}...</TableCell>
                  <TableCell className="truncate max-w-[120px]">{getUserName(request.user_id)}</TableCell>
                  <TableCell className="truncate max-w-[120px]">{request.honoree_name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      request.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : request.status === 'in_production' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                    }`}>
                      {request.status === 'pending' 
                        ? 'Pendente' 
                        : request.status === 'in_production' 
                          ? 'Em Produção' 
                          : 'Concluído'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      request.payment_status === 'pending' 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {request.payment_status === 'pending' ? 'Não Pago' : 'Pago'}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(request.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>Opções do Pedido</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem onClick={() => onViewDetails(request)}>
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
                          
                          {request.status === 'completed' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Ações de Entrega</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => onDeliverMusic(request)}>
                                <Send className="w-4 h-4 mr-2" />
                                Entregar Música
                              </DropdownMenuItem>
                              
                              {onDownloadFile && request.full_song_url && (
                                <DropdownMenuItem onClick={() => onDownloadFile(request)}>
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                              )}
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      {/* SoundCloud ID input in a more compact form */}
                      <div className="flex items-center mr-2 ml-2">
                        <div className="relative flex items-center max-w-[180px]">
                          <Input
                            type="text"
                            className="h-8 w-32 text-xs pr-8"
                            placeholder="ID SoundCloud"
                            value={soundcloudIds[request.id] || ''}
                            onChange={(e) => handleSoundCloudIdChange(request.id, e.target.value)}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onViewDetails(request)}
                            disabled={!soundcloudIds[request.id]?.trim()}
                            className="h-6 w-6 absolute right-1"
                          >
                            <Save className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
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
