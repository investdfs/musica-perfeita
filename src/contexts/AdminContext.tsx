
import { createContext, useContext, useState, useEffect } from "react";
import { MusicRequest, UserProfile } from "@/types/database.types";
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";
import { isDevelopmentOrPreview } from "@/lib/environment";

// Mock data for development/preview
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

type AdminContextType = {
  isLoading: boolean;
  requests: MusicRequest[];
  users: UserProfile[];
  filteredRequests: MusicRequest[];
  setRequests: React.Dispatch<React.SetStateAction<MusicRequest[]>>;
  fetchRequests: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  getUserEmail: (userId: string) => string | undefined;
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

  const getUserEmail = (userId: string): string | undefined => {
    const user = users.find(u => u.id === userId);
    return user?.email;
  };

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

  // Apply filters when dependencies change
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

  // Initialize data
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

  // Export public methods/state
  const value = {
    isLoading,
    requests,
    users,
    filteredRequests,
    setRequests,
    fetchRequests,
    fetchUsers,
    getUserEmail,
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
