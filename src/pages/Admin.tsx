
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
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
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";
import { MusicRequest } from "@/types/database.types";
import { isDevelopmentOrPreview } from "@/lib/environment";

const Admin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState<MusicRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<MusicRequest | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const isAdmin = localStorage.getItem("musicaperfeita_admin");
    
    // Skip authentication check in development mode or preview
    if (isDevelopmentOrPreview()) {
      // Auto-authenticate in development mode or preview
      localStorage.setItem("musicaperfeita_admin", "true");
      return;
    }
    
    // Only redirect in production
    if (!isAdmin) {
      navigate("/admin-login");
    }
  }, [navigate]);

  // Fetch requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('music_requests')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          setRequests(data);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
        toast({
          title: "Erro ao carregar pedidos",
          description: "Não foi possível carregar a lista de pedidos",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRequests();
  }, []);

  const handleViewDetails = (request: MusicRequest) => {
    setSelectedRequest(request);
    setShowDetails(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!audioFile || !selectedRequest) return;
    
    setIsUploading(true);
    
    try {
      // In a real application, we would upload to Supabase storage
      // and create a full song and preview (1/3) version
      
      // Mock success for demo purposes
      toast({
        title: "Upload Simulado",
        description: "Em um ambiente real, o arquivo seria processado e enviado.",
      });
      
      // Simulate updating the request status and URL
      const updatedRequests = requests.map(req => 
        req.id === selectedRequest.id 
          ? { ...req, status: 'completed' as const, preview_url: 'URL_SIMULADA' } 
          : req
      );
      
      setRequests(updatedRequests);
      setShowDetails(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível processar o arquivo de áudio",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <main className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Painel do Administrador</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
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
                      <TableHead>Data</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-mono">{request.id.substring(0, 8)}...</TableCell>
                        <TableCell>{request.user_id}</TableCell>
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
                        <TableCell>{formatDate(request.created_at)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(request)}
                          >
                            Ver Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido</DialogTitle>
            <DialogDescription>
              {selectedRequest && `Pedido para ${selectedRequest.honoree_name}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Relacionamento</h3>
                  <p>{selectedRequest.relationship_type}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Gênero Musical</h3>
                  <p>{selectedRequest.music_genre}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Incluir Nomes</h3>
                  <p>{selectedRequest.include_names ? 'Sim' : 'Não'}</p>
                </div>
                {selectedRequest.include_names && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Nomes</h3>
                    <p>{selectedRequest.names_to_include || 'Nenhum nome especificado'}</p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">História</h3>
                <p className="p-3 bg-gray-50 rounded whitespace-pre-wrap">{selectedRequest.story}</p>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Enviar Música</h3>
                <Input 
                  type="file" 
                  accept="audio/mp3,audio/mpeg" 
                  onChange={handleFileChange}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Envie o arquivo da música em formato MP3.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDetails(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={!audioFile || isUploading}
            >
              {isUploading ? "Enviando..." : "Enviar Música"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <footer className="bg-gray-800 text-white py-8 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <p>&copy; {new Date().getFullYear()} Musicaperfeita. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Admin;
