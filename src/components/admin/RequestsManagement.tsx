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
import { MusicRequest, UserProfile } from "@/types/database.types";
import { isDevelopmentOrPreview } from "@/lib/environment";
import supabase from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { Send, Upload } from "lucide-react";
import RequestDetails from "./RequestDetails";
import DeliveryForm from "./DeliveryForm";

interface RequestsManagementProps {
  requests: MusicRequest[];
  users: UserProfile[];
  setRequests: (requests: MusicRequest[]) => void;
  isLoading: boolean;
  getUserEmail: (userId: string) => string | undefined;
}

const RequestsManagement = ({ 
  requests, 
  users, 
  setRequests, 
  isLoading,
  getUserEmail
}: RequestsManagementProps) => {
  const [selectedRequest, setSelectedRequest] = useState<MusicRequest | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);

  const getUserName = (userId: string): string => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : userId;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handleViewDetails = (request: MusicRequest) => {
    setSelectedRequest(request);
    setShowDetails(true);
  };

  const handleDeliverMusic = (request: MusicRequest) => {
    setSelectedRequest(request);
    setShowDeliveryForm(true);
  };

  const handleUpload = async (uploadedUrl: string) => {
    if (!selectedRequest) return;
    
    setIsUploading(true);
    
    try {
      if (isDevelopmentOrPreview()) {
        const updatedRequests = requests.map(req => 
          req.id === selectedRequest.id 
            ? { ...req, status: 'completed' as MusicRequest['status'], full_song_url: uploadedUrl, preview_url: uploadedUrl } 
            : req
        );
        
        setRequests(updatedRequests);
      } else {
        const { error } = await supabase
          .from('music_requests')
          .update({ 
            status: 'completed' as MusicRequest['status'], 
            full_song_url: uploadedUrl,
            preview_url: uploadedUrl
          })
          .eq('id', selectedRequest.id);
          
        if (error) throw error;
        
        // Fix: Explicitly cast status to the correct type
        const updatedRequests = requests.map(req => 
          req.id === selectedRequest.id 
            ? { ...req, status: 'completed' as MusicRequest['status'], full_song_url: uploadedUrl, preview_url: uploadedUrl } 
            : req
        );
        
        setRequests(updatedRequests);
      }
      
      setShowDetails(false);
      
      toast({
        title: "Música Enviada",
        description: "A música foi enviada e o status do pedido foi atualizado para Concluído.",
      });
    } catch (error: any) {
      console.error('Error updating request:', error);
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Não foi possível atualizar o status do pedido",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedRequest) return;
    
    try {
      toast({
        title: "E-mail enviado",
        description: "A música foi enviada ao cliente por e-mail",
      });
      setShowDeliveryForm(false);
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar o e-mail",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, request: MusicRequest) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioFile(file);
      setSelectedRequest(request);
      uploadMusicFile(file, request);
    }
  };
  
  const uploadMusicFile = async (file: File, request: MusicRequest) => {
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // Create a unique file path
      const fileName = `music/${request.id}/${Date.now()}-${file.name}`;
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('music-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) throw error;
      
      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('music-files')
        .getPublicUrl(fileName);
        
      // Update the request status
      if (isDevelopmentOrPreview()) {
        const updatedRequests = requests.map(req => 
          req.id === request.id 
            ? { ...req, status: 'completed' as MusicRequest['status'], full_song_url: urlData.publicUrl, preview_url: urlData.publicUrl } 
            : req
        );
        
        setRequests(updatedRequests);
      } else {
        const { error } = await supabase
          .from('music_requests')
          .update({ 
            status: 'completed' as MusicRequest['status'], 
            full_song_url: urlData.publicUrl,
            preview_url: urlData.publicUrl
          })
          .eq('id', request.id);
          
        if (error) throw error;
        
        const updatedRequests = requests.map(req => 
          req.id === request.id 
            ? { ...req, status: 'completed' as MusicRequest['status'], full_song_url: urlData.publicUrl, preview_url: urlData.publicUrl } 
            : req
        );
        
        setRequests(updatedRequests);
      }
      
      toast({
        title: "Música Enviada",
        description: "A música foi enviada e o status do pedido foi atualizado para Concluído.",
      });
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: "Erro ao fazer upload",
        description: error.message || "Não foi possível fazer o upload do arquivo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateStatus = async (requestId: string, status?: MusicRequest['status'], paymentStatus?: MusicRequest['payment_status']) => {
    try {
      const updates: { status?: MusicRequest['status'], payment_status?: MusicRequest['payment_status'] } = {};
      
      if (status) updates.status = status;
      if (paymentStatus) updates.payment_status = paymentStatus;
      
      if (!isDevelopmentOrPreview()) {
        const { error } = await supabase
          .from('music_requests')
          .update(updates)
          .eq('id', requestId);
          
        if (error) throw error;
      }
      
      const updatedRequests = requests.map(req => 
        req.id === requestId 
          ? { ...req, ...updates } 
          : req
      );
      
      setRequests(updatedRequests);
      
      toast({
        title: "Status atualizado",
        description: "O status do pedido foi atualizado com sucesso",
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o status",
        variant: "destructive",
      });
    }
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
                        onClick={() => handleViewDetails(request)}
                      >
                        Ver Detalhes
                      </Button>
                      
                      <Select 
                        onValueChange={(value) => handleUpdateStatus(request.id, value as MusicRequest['status'])}
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
                        onValueChange={(value) => handleUpdateStatus(request.id, undefined, value as MusicRequest['payment_status'])}
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
                          onChange={(e) => handleFileUpload(e, request)}
                          disabled={isUploading}
                        />
                        <label
                          htmlFor={`upload-music-${request.id}`}
                          className={`inline-flex items-center justify-center gap-2 whitespace-nowrap h-9 rounded-md px-3 text-sm font-medium ${
                            isUploading
                              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                              : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                          }`}
                        >
                          <Upload className="w-4 h-4" />
                          {isUploading && request.id === selectedRequest?.id
                            ? "Enviando..."
                            : "Upload"}
                        </label>
                      </div>
                      
                      {request.status === 'completed' && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleDeliverMusic(request)}
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Entregar
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <RequestDetails 
        showDetails={showDetails} 
        setShowDetails={setShowDetails} 
        selectedRequest={selectedRequest} 
        handleUpload={handleUpload} 
        isUploading={isUploading} 
        setAudioFile={setAudioFile} 
      />

      <DeliveryForm 
        showDeliveryForm={showDeliveryForm}
        setShowDeliveryForm={setShowDeliveryForm}
        selectedRequest={selectedRequest}
        handleSendEmail={handleSendEmail}
        getUserName={getUserName}
        getUserEmail={getUserEmail}
      />
    </>
  );
};

export default RequestsManagement;
