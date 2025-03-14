
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
import { Send, Download, Save, ExternalLink, Music, ArrowUpDown, ArrowUp, ArrowDown, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
  onSaveMusicLink: (requestId: string, musicLink: string) => Promise<void>;
}

type SortColumn = 'cliente' | 'honoree' | 'status' | 'payment' | 'date';
type SortDirection = 'asc' | 'desc';

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
  selectedRequestId,
  onSaveMusicLink
}: RequestsListProps) => {
  const [soundcloudIds, setSoundcloudIds] = useState<{[key: string]: string}>({});
  const [savingLinks, setSavingLinks] = useState<{[key: string]: boolean}>({});
  const [errorStates, setErrorStates] = useState<{[key: string]: string}>({});
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handleSoundCloudIdChange = (requestId: string, value: string) => {
    setSoundcloudIds(prev => ({
      ...prev,
      [requestId]: value
    }));
    
    // Limpar estado de erro quando o usuário começa a digitar novamente
    if (errorStates[requestId]) {
      setErrorStates(prev => ({
        ...prev,
        [requestId]: ''
      }));
    }
  };

  const handleSaveMusicLink = async (requestId: string) => {
    const musicLink = soundcloudIds[requestId];
    if (!musicLink?.trim()) {
      setErrorStates(prev => ({
        ...prev,
        [requestId]: 'O link não pode estar vazio'
      }));
      
      toast({
        title: "Link vazio",
        description: "Por favor, insira um link para a música",
        variant: "destructive",
      });
      return;
    }

    try {
      setSavingLinks(prev => ({ ...prev, [requestId]: true }));
      await onSaveMusicLink(requestId, musicLink);
      
      // Limpa o campo após salvar com sucesso
      setSoundcloudIds(prev => ({ ...prev, [requestId]: '' }));
      
      toast({
        title: "Link salvo com sucesso",
        description: "O link da música foi salvo e o pedido foi atualizado.",
      });
    } catch (error: any) {
      console.error("Erro ao salvar link:", error);
      
      setErrorStates(prev => ({
        ...prev,
        [requestId]: error.message || 'Erro ao salvar o link'
      }));
      
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar o link. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSavingLinks(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Inverter a direção se a coluna já estiver selecionada
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Definir a nova coluna e resetar a direção para ascendente
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortedRequests = () => {
    if (!sortColumn) return requests;

    return [...requests].sort((a, b) => {
      let comparison = 0;
      
      switch (sortColumn) {
        case 'cliente':
          const userNameA = getUserName(a.user_id).toLowerCase();
          const userNameB = getUserName(b.user_id).toLowerCase();
          comparison = userNameA.localeCompare(userNameB);
          break;
        case 'honoree':
          comparison = a.honoree_name.toLowerCase().localeCompare(b.honoree_name.toLowerCase());
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'payment':
          comparison = a.payment_status.localeCompare(b.payment_status);
          break;
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="ml-1 h-4 w-4 inline" />;
    }
    
    return sortDirection === 'asc' 
      ? <ArrowUp className="ml-1 h-4 w-4 inline text-blue-500" />
      : <ArrowDown className="ml-1 h-4 w-4 inline text-blue-500" />;
  };

  const sortedRequests = getSortedRequests();

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
                <TableHead 
                  className="w-[150px] text-gray-700 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('cliente')}
                >
                  Cliente {getSortIcon('cliente')}
                </TableHead>
                <TableHead 
                  className="w-[150px] text-gray-700 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('honoree')}
                >
                  Homenageado {getSortIcon('honoree')}
                </TableHead>
                <TableHead 
                  className="w-[120px] text-gray-700 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('status')}
                >
                  Status {getSortIcon('status')}
                </TableHead>
                <TableHead 
                  className="w-[120px] text-gray-700 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('payment')}
                >
                  Pagamento {getSortIcon('payment')}
                </TableHead>
                <TableHead 
                  className="w-[100px] text-gray-700 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('date')}
                >
                  Data {getSortIcon('date')}
                </TableHead>
                <TableHead className="text-gray-700">Link da Música</TableHead>
                <TableHead className="w-[100px] text-right text-gray-700">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRequests.map((request) => (
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
                      <div className="flex-1 relative">
                        <Input
                          type="text"
                          className={`h-8 text-xs ${errorStates[request.id] ? 'border-red-500 focus:ring-red-300' : ''}`}
                          placeholder={request.full_song_url ? "Link atual: " + request.full_song_url.substring(0, 30) + "..." : "Cole o link da música aqui"}
                          value={soundcloudIds[request.id] || ''}
                          onChange={(e) => handleSoundCloudIdChange(request.id, e.target.value)}
                        />
                        {errorStates[request.id] && (
                          <div className="absolute -bottom-5 left-0 text-xs text-red-500 flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-1" /> {errorStates[request.id]}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSaveMusicLink(request.id)}
                        disabled={!soundcloudIds[request.id]?.trim() || savingLinks[request.id]}
                        className="h-8 ml-1 whitespace-nowrap"
                        title="Enviar Música"
                      >
                        {savingLinks[request.id] ? (
                          <span className="flex items-center">
                            <span className="animate-spin mr-1">⏳</span> Enviando...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" /> Enviar
                          </span>
                        )}
                      </Button>
                    </div>
                    {request.full_song_url && (
                      <div className="mt-1 text-xs text-green-600 truncate">
                        ✓ Música disponível: {request.full_song_url.substring(0, 40)}...
                      </div>
                    )}
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
                            title="Entregar Música por Email"
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
