
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Send, Upload, Download } from "lucide-react";

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
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Pessoa Homenageada</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-mono">{request.id.substring(0, 8)}...</TableCell>
                  <TableCell>{getUserName(request.user_id)}</TableCell>
                  <TableCell>{request.honoree_name}</TableCell>
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
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onViewDetails(request)}
                      >
                        Ver Detalhes
                      </Button>
                      
                      <Select 
                        onValueChange={(value) => onUpdateStatus(request.id, value as MusicRequest['status'])}
                        defaultValue={request.status}
                      >
                        <SelectTrigger className="w-[130px] h-9">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="in_production">Em Produção</SelectItem>
                          <SelectItem value="completed">Concluído</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select
                        onValueChange={(value) => onUpdateStatus(request.id, undefined, value as MusicRequest['payment_status'])}
                        defaultValue={request.payment_status || 'pending'}
                      >
                        <SelectTrigger className="w-[130px] h-9">
                          <SelectValue placeholder="Pagamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Não Pago</SelectItem>
                          <SelectItem value="completed">Pago</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {/* Botão de Upload de Música */}
                      <div className="relative">
                        <input
                          type="file"
                          id={`upload-music-${request.id}`}
                          className="sr-only"
                          accept="audio/mp3,audio/mpeg,audio/wav"
                          onChange={(e) => onFileUpload(e, request)}
                          disabled={isUploading}
                        />
                        <label
                          htmlFor={`upload-music-${request.id}`}
                          className={`inline-flex items-center justify-center gap-2 whitespace-nowrap h-9 rounded-md px-3 text-sm font-medium ${
                            isUploading && request.id === selectedRequestId
                              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                              : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                          }`}
                        >
                          <Upload className="w-4 h-4" />
                          {isUploading && request.id === selectedRequestId
                            ? "Enviando..."
                            : "Upload"}
                        </label>
                      </div>
                      
                      {request.status === 'completed' && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => onDeliverMusic(request)}
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Entregar
                          </Button>
                          
                          {onDownloadFile && request.full_song_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onDownloadFile(request)}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          )}
                        </>
                      )}
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
