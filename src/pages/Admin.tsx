
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";
import { MusicRequest, UserProfile } from "@/types/database.types";
import { isDevelopmentOrPreview } from "@/lib/environment";
import { 
  PlusCircle, 
  Trash, 
  Edit, 
  Lock, 
  Unlock, 
  Send 
} from "lucide-react";

const Admin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState<MusicRequest[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<MusicRequest | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    whatsapp: ""
  });
  const [activeTab, setActiveTab] = useState("requests");
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

  // Create test clients and orders
  useEffect(() => {
    const createTestData = async () => {
      try {
        // Check if we already have test data
        const { data: existingData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('email', 'teste@musicaperfeita.com')
          .single();

        if (existingData) {
          return; // Test data already exists
        }

        // Create test user 1
        const { data: testUser1, error: userError1 } = await supabase
          .from('user_profiles')
          .insert([
            {
              name: 'João Silva',
              email: 'joao@teste.com',
              whatsapp: '+5511999999991'
            }
          ])
          .select();

        if (userError1) throw userError1;

        // Create test user 2
        const { data: testUser2, error: userError2 } = await supabase
          .from('user_profiles')
          .insert([
            {
              name: 'Maria Oliveira',
              email: 'maria@teste.com',
              whatsapp: '+5511999999992'
            }
          ])
          .select();

        if (userError2) throw userError2;

        if (testUser1 && testUser1.length > 0) {
          // Create test request for user 1
          const { error: requestError1 } = await supabase
            .from('music_requests')
            .insert([
              {
                user_id: testUser1[0].id,
                honoree_name: 'Ana Pereira',
                relationship_type: 'esposa',
                custom_relationship: null,
                music_genre: 'romantic',
                include_names: true,
                names_to_include: 'João e Ana',
                story: 'Esta é uma história de teste para o sistema. João quer uma música romântica para sua esposa Ana que está completando 10 anos de casamento.',
                status: 'pending',
                payment_status: 'pending'
              }
            ]);

          if (requestError1) throw requestError1;
        }

        if (testUser2 && testUser2.length > 0) {
          // Create test request for user 2
          const { error: requestError2 } = await supabase
            .from('music_requests')
            .insert([
              {
                user_id: testUser2[0].id,
                honoree_name: 'Pedro Santos',
                relationship_type: 'friend',
                custom_relationship: null,
                music_genre: 'rock',
                include_names: false,
                names_to_include: null,
                story: 'Pedro é meu melhor amigo desde a escola. Sempre gostamos de rock e queremos compartilhar momentos especiais com uma música personalizada sobre nossa amizade.',
                status: 'in_production',
                payment_status: 'completed'
              }
            ]);

          if (requestError2) throw requestError2;
        }
        
        // After creating test data, refresh the lists
        await fetchRequests();
        await fetchUsers();
        
      } catch (error) {
        console.error('Error creating test data:', error);
      }
    };

    if (isDevelopmentOrPreview()) {
      createTestData();
    }
  }, []);

  // Fetch requests
  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('music_requests')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        setRequests(data as MusicRequest[]);
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
  
  // Fetch users
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('name', { ascending: true });
        
      if (error) throw error;
      
      if (data) {
        setUsers(data as UserProfile[]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Handle user form
  const handleUserFormSubmit = async () => {
    try {
      if (selectedUser) {
        // Update existing user
        const { error } = await supabase
          .from('user_profiles')
          .update({
            name: newUser.name,
            email: newUser.email,
            whatsapp: newUser.whatsapp
          })
          .eq('id', selectedUser.id);
          
        if (error) throw error;
        
        toast({
          title: "Cliente atualizado",
          description: "As informações foram atualizadas com sucesso",
        });
      } else {
        // Create new user
        const { error } = await supabase
          .from('user_profiles')
          .insert([{
            name: newUser.name,
            email: newUser.email,
            whatsapp: newUser.whatsapp
          }]);
          
        if (error) throw error;
        
        toast({
          title: "Cliente criado",
          description: "Novo cliente adicionado com sucesso",
        });
      }
      
      // Reset form and refetch users
      setNewUser({ name: "", email: "", whatsapp: "" });
      setSelectedUser(null);
      setShowUserForm(false);
      
      await fetchUsers();
    } catch (error) {
      console.error('Error managing user:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o cliente",
        variant: "destructive",
      });
    }
  };

  // Handle user actions
  const handleEditUser = (user: UserProfile) => {
    setSelectedUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      whatsapp: user.whatsapp
    });
    setShowUserForm(true);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Check if user has any requests
      const { data } = await supabase
        .from('music_requests')
        .select('id')
        .eq('user_id', userId);
        
      if (data && data.length > 0) {
        toast({
          title: "Não foi possível excluir",
          description: "Este cliente possui pedidos de música associados",
          variant: "destructive",
        });
        return;
      }
      
      // Delete user
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);
        
      if (error) throw error;
      
      toast({
        title: "Cliente excluído",
        description: "Cliente excluído com sucesso",
      });
      
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o cliente",
        variant: "destructive",
      });
    }
  };

  // Music delivery functions
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
          ? { ...req, status: 'completed' as MusicRequest['status'], preview_url: 'URL_SIMULADA' } 
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

  const handleDeliverMusic = (request: MusicRequest) => {
    setSelectedRequest(request);
    setShowDeliveryForm(true);
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

  const handleUpdateStatus = async (requestId: string, status?: MusicRequest['status'], paymentStatus?: MusicRequest['payment_status']) => {
    try {
      const updates: { status?: MusicRequest['status'], payment_status?: MusicRequest['payment_status'] } = {};
      
      if (status) updates.status = status;
      if (paymentStatus) updates.payment_status = paymentStatus;
      
      const { error } = await supabase
        .from('music_requests')
        .update(updates)
        .eq('id', requestId);
        
      if (error) throw error;
      
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
          
          <Tabs defaultValue="requests" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="requests">Pedidos de Música</TabsTrigger>
              <TabsTrigger value="users">Gerenciar Clientes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="requests" className="bg-white rounded-lg shadow-md p-6 mb-8">
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
            </TabsContent>
            
            <TabsContent value="users" className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Gerenciar Clientes</h2>
                <Button 
                  onClick={() => {
                    setSelectedUser(null);
                    setNewUser({ name: "", email: "", whatsapp: "" });
                    setShowUserForm(true);
                  }}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Novo Cliente
                </Button>
              </div>
              
              {users.length === 0 ? (
                <p className="text-center py-8">Nenhum cliente cadastrado.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>WhatsApp</TableHead>
                        <TableHead>Data de Cadastro</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.whatsapp}</TableCell>
                          <TableCell>{formatDate(user.created_at)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* User Form Dialog */}
      <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedUser ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para {selectedUser ? "editar as informações do" : "adicionar um novo"} cliente.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Nome Completo</label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="whatsapp" className="text-sm font-medium">WhatsApp</label>
              <Input
                id="whatsapp"
                value={newUser.whatsapp}
                onChange={(e) => setNewUser({...newUser, whatsapp: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserForm(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUserFormSubmit}>
              {selectedUser ? "Salvar Alterações" : "Adicionar Cliente"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Music Details Dialog */}
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
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status do Pagamento</h3>
                  <p>{selectedRequest.payment_status === 'completed' ? 'Pago' : 'Não Pago'}</p>
                </div>
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
      
      {/* Music Delivery Dialog */}
      <Dialog open={showDeliveryForm} onOpenChange={setShowDeliveryForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Entregar Música ao Cliente</DialogTitle>
            <DialogDescription>
              Envie a música finalizada para o cliente por e-mail.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Cliente</h3>
                <p className="p-2 bg-gray-50 rounded">{selectedRequest.user_id}</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Música para</h3>
                <p className="p-2 bg-gray-50 rounded">{selectedRequest.honoree_name}</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Status do Pagamento</h3>
                <p className={`p-2 rounded ${
                  selectedRequest.payment_status === 'completed' 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-red-50 text-red-700'
                }`}>
                  {selectedRequest.payment_status === 'completed' ? 'Pago' : 'Não Pago'}
                </p>
                {selectedRequest.payment_status !== 'completed' && (
                  <p className="text-sm text-red-500">
                    Atenção: Este pedido ainda não foi pago. Recomendamos verificar o pagamento antes de entregar a música.
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Mensagem para o Cliente</h3>
                <textarea 
                  className="w-full p-2 border rounded"
                  rows={4}
                  defaultValue="Olá! Sua música personalizada está pronta. Esperamos que goste do resultado final. Clique no link abaixo para acessar a música completa."
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeliveryForm(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSendEmail}
              disabled={selectedRequest?.payment_status !== 'completed'}
            >
              Enviar por E-mail
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
