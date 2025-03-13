
import { createContext, useContext, useState, useEffect } from "react";
import { MusicRequest, UserProfile } from "@/types/database.types";
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";

type AdminContextType = {
  isLoading: boolean;
  requests: MusicRequest[];
  users: UserProfile[];
  filteredRequests: MusicRequest[];
  setRequests: React.Dispatch<React.SetStateAction<MusicRequest[]>>;
  fetchRequests: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  getUserEmail: (userId: string) => string | undefined;
  currentUserProfile: UserProfile | null;
  isMainAdmin: boolean;
  visitorCount: number;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState<MusicRequest[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<MusicRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [isMainAdmin, setIsMainAdmin] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);

  const getUserEmail = (userId: string): string | undefined => {
    const user = users.find(u => u.id === userId);
    return user?.email;
  };

  const fetchRequests = async () => {
    try {
      // CORREÇÃO CRÍTICA: Usar o client com permissões de serviço para buscar todos os pedidos
      console.log('[AdminContext] Buscando todos os pedidos com permissões de administrador');
      
      const { data, error } = await supabase
        .from('music_requests')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('[AdminContext] Erro ao buscar pedidos:', error);
        throw error;
      }
      
      if (data) {
        console.log('[AdminContext] Total de pedidos encontrados:', data.length);
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
  
  const fetchVisitorCount = async () => {
    try {
      // Obter contagem de visitantes da tabela site_stats
      const { data, error } = await supabase
        .from('site_stats')
        .select('visitor_count')
        .single();
        
      if (error) {
        // Se a tabela não existir, criamos um valor padrão
        if (error.code === 'PGRST116') {
          setVisitorCount(0);
          console.log('Tabela site_stats não existe ou está vazia. Usando valor padrão 0.');
          return;
        }
        throw error;
      }
      
      if (data) {
        setVisitorCount(data.visitor_count || 0);
      } else {
        setVisitorCount(0);
      }
    } catch (error) {
      console.error('Error fetching visitor count:', error);
      setVisitorCount(0);
    }
  };
  
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('name', { ascending: true });
        
      if (error) throw error;
      
      if (data) {
        console.log("Users data fetched:", data);
        setUsers(data as UserProfile[]);
        
        // Carrega informações do admin do localStorage
        const adminEmail = localStorage.getItem('admin_email');
        const isAdminMain = localStorage.getItem('admin_is_main') === 'true';
        
        console.log("Admin email from localStorage:", adminEmail);
        console.log("Admin is main from localStorage:", isAdminMain);
        
        if (adminEmail) {
          // Procura o usuário admin pelo email
          const admin = data.find(user => user.email === adminEmail);
          console.log("Found admin user:", admin);
          
          if (admin) {
            setCurrentUserProfile(admin);
            
            // Definir isMainAdmin com base nos dados do localStorage e do banco
            const isMainAdminValue = isAdminMain || admin.is_main_admin === true;
            console.log("Setting isMainAdmin to:", isMainAdminValue);
            setIsMainAdmin(isMainAdminValue);
          } else {
            console.log("Admin não encontrado com o email:", adminEmail);
            setIsMainAdmin(false);
            setCurrentUserProfile(null);
          }
        } else {
          console.log("Email do admin não encontrado no localStorage");
          setIsMainAdmin(false);
          setCurrentUserProfile(null);
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

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

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      
      try {
        await fetchVisitorCount();
        await fetchRequests();
        await fetchUsers();
      } catch (error) {
        console.error("Error initializing data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Verifique sua conexão com a internet e tente novamente",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    };

    initializeData();
    
    const requestsChannel = supabase
      .channel('music_requests_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'music_requests' 
      }, () => {
        console.log('Music requests changed, refreshing data...');
        fetchRequests();
      })
      .subscribe();
      
    const usersChannel = supabase
      .channel('user_profiles_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'user_profiles' 
      }, () => {
        console.log('User profiles changed, refreshing data...');
        fetchUsers();
      })
      .subscribe();
      
    const statsChannel = supabase
      .channel('site_stats_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'site_stats' 
      }, () => {
        console.log('Site stats changed, refreshing visitor count...');
        fetchVisitorCount();
      })
      .subscribe();
      
    // Verificação periódica para garantir que todos os dados estejam atualizados
    const refreshInterval = setInterval(() => {
      console.log('[AdminContext] Verificação periódica de consistência de dados');
      fetchRequests();
    }, 90000); // Verificação a cada 1.5 minutos

    return () => {
      supabase.removeChannel(requestsChannel);
      supabase.removeChannel(usersChannel);
      supabase.removeChannel(statsChannel);
      clearInterval(refreshInterval);
    };
  }, []);

  const value = {
    isLoading,
    requests,
    users,
    filteredRequests,
    setRequests,
    fetchRequests,
    fetchUsers,
    getUserEmail,
    currentUserProfile,
    isMainAdmin,
    visitorCount,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const useAdminFilters = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string | null>(null);

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

  return {
    searchQuery,
    filterStatus,
    filterPaymentStatus,
    handleSearch,
    handleFilterByStatus,
    handleFilterByPaymentStatus,
    handleClearFilters
  };
};
