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
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('name', { ascending: true });
        
      if (error) throw error;
      
      if (data) {
        console.log("Users data fetched:", data);
        setUsers(data as UserProfile[]);
        
        const adminEmail = localStorage.getItem('admin_email');
        if (adminEmail) {
          const admin = data.find(user => user.email === adminEmail);
          if (admin) {
            setCurrentUserProfile(admin);
            setIsMainAdmin(admin.is_main_admin === true);
          }
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

    return () => {
      supabase.removeChannel(requestsChannel);
      supabase.removeChannel(usersChannel);
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
