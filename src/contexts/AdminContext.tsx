
import { createContext, useContext, useState, useEffect, useRef } from "react";
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
  const lastFetchTimeRef = useRef(0);
  const MIN_FETCH_INTERVAL = 2000; // 2 segundos entre fetchs

  const getUserEmail = (userId: string): string | undefined => {
    const user = users.find(u => u.id === userId);
    return user?.email;
  };

  const fetchRequests = async () => {
    try {
      const now = Date.now();
      
      // Evitar fetchs muito frequentes
      if (now - lastFetchTimeRef.current < MIN_FETCH_INTERVAL) {
        console.log('[AdminContext] Ignorando fetch muito frequente');
        return;
      }
      
      lastFetchTimeRef.current = now;
      
      // CORREÇÃO CRÍTICA: Buscar todos os pedidos com a abordagem client-server correta
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
        
        // CORREÇÃO CRÍTICA: Garantir que os dados sejam processados corretamente
        if (Array.isArray(data)) {
          setRequests(data);
        } else {
          console.error('[AdminContext] Dados retornados não são um array:', data);
          setRequests([]);
        }
      }
    } catch (error) {
      console.error('[AdminContext] Erro ao buscar pedidos:', error);
      toast({
        title: "Erro ao carregar pedidos",
        description: "Não foi possível carregar a lista de pedidos",
        variant: "destructive",
      });
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
      console.error('[AdminContext] Erro ao buscar contagem de visitantes:', error);
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
        console.log("[AdminContext] Dados de usuários carregados:", data);
        setUsers(data as UserProfile[]);
        
        // Carrega informações do admin do localStorage
        const adminEmail = localStorage.getItem('admin_email');
        const isAdminMain = localStorage.getItem('admin_is_main') === 'true';
        
        console.log("[AdminContext] Email do admin no localStorage:", adminEmail);
        console.log("[AdminContext] Admin principal no localStorage:", isAdminMain);
        
        if (adminEmail) {
          // Procura o usuário admin pelo email
          const admin = data.find(user => user.email === adminEmail);
          console.log("[AdminContext] Admin encontrado:", admin);
          
          if (admin) {
            setCurrentUserProfile(admin);
            
            // Definir isMainAdmin com base nos dados do localStorage e do banco
            const isMainAdminValue = isAdminMain || admin.is_main_admin === true;
            console.log("[AdminContext] Definindo isMainAdmin como:", isMainAdminValue);
            setIsMainAdmin(isMainAdminValue);
          } else {
            console.log("[AdminContext] Admin não encontrado com o email:", adminEmail);
            setIsMainAdmin(false);
            setCurrentUserProfile(null);
          }
        } else {
          console.log("[AdminContext] Email do admin não encontrado no localStorage");
          setIsMainAdmin(false);
          setCurrentUserProfile(null);
        }
      }
    } catch (error) {
      console.error('[AdminContext] Erro ao buscar usuários:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Sempre que os filtros ou os dados mudarem, atualizar a lista filtrada
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

  // Inicialização e atualização periódica
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      
      try {
        await fetchVisitorCount();
        await fetchRequests();
        await fetchUsers();
      } catch (error) {
        console.error("[AdminContext] Erro ao inicializar dados:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Verifique sua conexão com a internet e tente novamente",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    };

    initializeData();
    
    // CORREÇÃO CRÍTICA: Configurar canais em tempo real para atualizações de dados
    const requestsChannel = supabase
      .channel('admin-music-requests-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'music_requests' 
      }, (payload) => {
        console.log('[AdminContext] Mudança em music_requests detectada:', payload);
        fetchRequests();
      })
      .subscribe((status) => {
        console.log(`[AdminContext] Status da inscrição em tempo real (requests): ${status}`);
      });
      
    const usersChannel = supabase
      .channel('admin-user-profiles-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'user_profiles' 
      }, (payload) => {
        console.log('[AdminContext] Mudança em user_profiles detectada:', payload);
        fetchUsers();
      })
      .subscribe((status) => {
        console.log(`[AdminContext] Status da inscrição em tempo real (users): ${status}`);
      });
      
    const statsChannel = supabase
      .channel('admin-site-stats-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'site_stats' 
      }, (payload) => {
        console.log('[AdminContext] Mudança em site_stats detectada:', payload);
        fetchVisitorCount();
      })
      .subscribe((status) => {
        console.log(`[AdminContext] Status da inscrição em tempo real (stats): ${status}`);
      });
      
    // Verificação periódica para garantir que todos os dados estejam atualizados
    const refreshInterval = setInterval(() => {
      console.log('[AdminContext] Verificação periódica de consistência de dados');
      fetchRequests();
    }, 30000); // Verificação a cada 30 segundos

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
