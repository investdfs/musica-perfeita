
import { useState } from "react";
import { 
  Button 
} from "@/components/ui/button";
import { 
  TableRow,
  TableCell
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Download, 
  ExternalLink, 
  MoreHorizontal, 
  CheckCircle, 
  AlertTriangle,
  FileText
} from "lucide-react";
import { MusicRequest } from "@/types/database.types";
import { toast } from "@/hooks/use-toast";

interface RequestRowProps {
  request: MusicRequest;
  getUserName: (userId: string) => string;
  onViewDetails: (request: MusicRequest) => void;
  onUpdateStatus: (requestId: string, status?: MusicRequest['status'], paymentStatus?: MusicRequest['payment_status']) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, request: MusicRequest) => void;
  onDeliverMusic: (request: MusicRequest) => void;
  onDownloadFile?: (request: MusicRequest) => void;
  isUploading: boolean;
  selectedRequestId: string | null;
  onSaveMusicLink: (requestId: string, musicLink: string) => Promise<void>;
  onEditTechnicalDetails: (request: MusicRequest) => void;
}

const RequestRow = ({
  request,
  getUserName,
  onViewDetails,
  onUpdateStatus,
  onFileUpload,
  onDeliverMusic,
  onDownloadFile,
  isUploading,
  selectedRequestId,
  onSaveMusicLink,
  onEditTechnicalDetails
}: RequestRowProps) => {
  const [musicLink, setMusicLink] = useState<string>('');
  const [errorState, setErrorState] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handleMusicLinkChange = (value: string) => {
    setMusicLink(value);
    
    // Limpar estado de erro quando o usuário começa a digitar novamente
    if (errorState) {
      setErrorState('');
    }
  };

  const handleSaveMusicLink = async () => {
    if (!musicLink?.trim()) {
      setErrorState('O link não pode estar vazio');
      
      toast({
        title: "Link vazio",
        description: "Por favor, insira um link para a música",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      await onSaveMusicLink(request.id, musicLink);
      
      // Limpa o campo após salvar com sucesso
      setMusicLink('');
      
      toast({
        title: "Link salvo com sucesso",
        description: "O link da música foi salvo e o pedido foi atualizado.",
      });
    } catch (error: any) {
      console.error("Erro ao salvar link:", error);
      
      setErrorState(error.message || 'Erro ao salvar o link');
      
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar o link. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TableRow className="border-b border-gray-200 hover:bg-gray-50">
      <TableCell className="font-medium py-4 text-gray-900">
        <div className="truncate max-w-[140px]">{getUserName(request.user_id)}</div>
        <div className="text-xs text-gray-500 mt-1">ID: {request.id.substring(0, 6)}...</div>
      </TableCell>
      <TableCell className="py-4 text-gray-900">
        <div className="truncate max-w-[140px]">{request.honoree_name}</div>
      </TableCell>
      <TableCell className="py-4">
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
      <TableCell className="py-4">
        <Badge variant={request.payment_status === 'pending' ? 'destructive' : 'success'}>
          {request.payment_status === 'pending' ? 'Não Pago' : 'Pago'}
        </Badge>
      </TableCell>
      <TableCell className="py-4 text-gray-900">{formatDate(request.created_at)}</TableCell>
      <TableCell className="py-4">
        <div className="flex items-center">
          <div className="flex-1 relative">
            <Input
              type="text"
              className={`h-8 text-xs ${errorState ? 'border-red-500 focus:ring-red-300' : ''}`}
              placeholder={request.full_song_url ? "Link atual: " + request.full_song_url.substring(0, 30) + "..." : "Cole o link da música aqui"}
              value={musicLink}
              onChange={(e) => handleMusicLinkChange(e.target.value)}
            />
            {errorState && (
              <div className="absolute -bottom-5 left-0 text-xs text-red-500 flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" /> {errorState}
              </div>
            )}
          </div>
          <div className="flex ml-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveMusicLink}
              disabled={!musicLink?.trim() || isSaving}
              className="h-8 whitespace-nowrap"
              title="Enviar Música"
            >
              {isSaving ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-1">⏳</span> Enviando...
                </span>
              ) : (
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" /> Enviar
                </span>
              )}
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEditTechnicalDetails(request)}
              className="h-8 ml-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              title="Detalhes técnicos da música"
            >
              <FileText className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {request.full_song_url && (
          <div className="mt-1 text-xs text-green-600 truncate">
            ✓ Música disponível
          </div>
        )}
        {request.technical_details && (
          <div className="mt-1 text-xs text-purple-600">
            ✓ Detalhes técnicos adicionados
          </div>
        )}
      </TableCell>
      <TableCell className="text-right py-4">
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
              
              <DropdownMenuItem onClick={() => onEditTechnicalDetails(request)}>
                <FileText className="w-4 h-4 mr-2 text-purple-600" />
                Editar Detalhes Técnicos
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
  );
};

export default RequestRow;
