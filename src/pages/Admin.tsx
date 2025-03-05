import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";
import { MusicRequest, UserProfile } from "@/types/database.types";
import { isDevelopmentOrPreview } from "@/lib/environment";
import UserManagement from "@/components/admin/UserManagement";
import RequestsManagement from "@/components/admin/RequestsManagement";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import NotificationsPanel from "@/components/admin/NotificationsPanel";
import RequestsFilters from "@/components/admin/RequestsFilters";
import { Card } from "@/components/ui/card";

const mockUsers: UserProfile[] = [
  {
    id: "1",
    created_at: new Date().toISOString(),
    name: "João Silva",
    email: "joao@teste.com",
    whatsapp: "+5511999999991",
    password: "senha123"
  },
  {
    id: "2",
    created_at: new Date().toISOString(),
    name: "Maria Oliveira",
    email: "maria@teste.com",
    whatsapp: "+5511999999992",
    password: "senha456"
  }
];

const mockRequests: MusicRequest[] = [
  {
    id: "1",
    created_at: new Date().toISOString(),
    user_id: "1",
    honoree_name: "Ana Pereira",
    relationship_type: "esposa",
    custom_relationship: null,
    music_genre: "romantic",
    include_names: true,
    names_to_include: "João e Ana",
    story: "Esta é uma história de teste para o sistema. João quer uma música romântica para sua esposa Ana que está completando 10 anos de casamento.",
    status: "pending",
    payment_status: "completed",
    preview_url: null,
    full_song_url: null,
    cover_image_url: null
  },
  {
    id: "2",
    created_at: new Date().toISOString(),
    user_id: "2",
    honoree_name: "Pedro Santos",
    relationship_type: "friend",
    custom_relationship: null,
    music_genre: "rock",
    include_names: false,
    names_to_include: null,
    story: "Pedro é meu melhor amigo desde a escola. Sempre gostamos de rock e queremos compartilhar momentos especiais com uma música personalizada sobre nossa amizade.",
    status: "in_production",
    payment_status: "completed",
    preview_url: null,
    full_song_url: null,
    cover_image_url: null
  }
];

const Admin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState<MusicRequest[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<MusicRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  const getUserEmail = (userId: string): string | undefined => {
    const user = users.find(u => u.id === userId);
    return user?.email;
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (isDevelopmentOrPreview()) {
        localStorage.setItem("musicaperfeita_admin", "true");
        toast({
          title: "Acesso de desenvolvimento/preview",
          description: "Autenticação automática como administrador em modo de desenvolvimento ou preview",
        });
        return;
      }
      
      const isAdmin = localStorage.getItem("musicaperfeita_admin");
      if (!isAdmin) {
        navigate("/admin-login");
      }
    };
    
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const initializeData = async () => {
      if (isDevelopmentOrPreview()) {
        setUsers(mockUsers);
        setRequests(mockRequests);
        setFilteredRequests(mockRequests);
        setIsLoading(false);
        return;
      }
      
      try {
        await fetchRequests();
        await fetchUsers();
      } catch (error) {
        console.error("Error initializing data:", error);
        setUsers(mockUsers);
        setRequests(mockRequests);
        setFilteredRequests(mockRequests);
      }
      
      setIsLoading(false);
    };

    initializeData();
  }, []);

  useEffect(() => {
    if (requests.length === 0) return;
    
    let result = [...requests];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(request => {
        const userName = users.find(u => u.id === request.user_id)?.name?.toLowerCase() || '';
        const honoreeName = request.honoree_name?.toLowerCase() || '';
        return userName.includes(query) || honoreeName.includes(query) || request.id.includes(query);
      });
    }
    
    if (filterStatus && filterStatus !== "all") {
      result = result.filter(request => request.status === filterStatus);
    }
    
    if (filterPaymentStatus && filterPaymentStatus !== "all") {
      result = result.filter(request => request.payment_status === filterPaymentStatus);
    }
    
    setFilteredRequests(result);
  }, [requests, searchQuery, filterStatus, filterPaymentStatus, users]);

  const fetchRequests = async () => {
    try {
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
      throw error;
    }
  };
  
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
      throw error;
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterByStatus = (status: string | null) => {
    setFilterStatus(status);
  };

  const handleFilterByPaymentStatus = (status: string | null) => {
    setFilterPaymentStatus(status);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterStatus("all");
    setFilterPaymentStatus("all");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <main className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Painel do Administrador</h1>
            <NotificationsPanel />
          </div>
          
          <div className="space-y-8">
            <Card className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Análises</h2>
              <AnalyticsDashboard requests={requests} users={users} />
            </Card>
            
            <Card className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Pedidos de Música</h2>
              <RequestsFilters 
                onSearch={handleSearch} 
                onFilterByStatus={handleFilterByStatus}
                onFilterByPaymentStatus={handleFilterByPaymentStatus}
                onClearFilters={handleClearFilters}
                searchQuery={searchQuery}
                filterStatus={filterStatus}
                filterPaymentStatus={filterPaymentStatus}
              />
              
              <RequestsManagement 
                requests={filteredRequests} 
                users={users}
                setRequests={setRequests}
                isLoading={isLoading}
                getUserEmail={getUserEmail}
              />
            </Card>
            
            <Card className="bg-white rounded-lg shadow-md p-6">
              <UserManagement users={users} fetchUsers={fetchUsers} />
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-8 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <p>&copy; {new Date().getFullYear()} Musicaperfeita. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Admin;
