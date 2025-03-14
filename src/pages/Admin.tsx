
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import NotificationsPanel from "@/components/admin/NotificationsPanel";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { AdminProvider } from "@/contexts/AdminContext";
import { toast } from "@/hooks/use-toast";
import { isDevelopmentOrPreview } from "@/lib/environment";
import supabase from "@/lib/supabase";
import { UserProfile } from "@/types/database.types";

interface AdminProps {
  userProfile: UserProfile;
  onLogout: () => void;
}

const AdminPage = ({ userProfile, onLogout }: AdminProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Verify admin authentication on every page visit
    const checkAdminAuth = async () => {
      // Skip authentication check if in Lovable editor environment
      if (window.location.href.includes("lovable.dev/projects/")) {
        console.log("Bypassing auth check - Lovable editor environment detected");
        
        // Set admin info for editor environment with proper admin permissions
        localStorage.setItem("musicaperfeita_admin", "true");
        localStorage.setItem("admin_email", "editor@musicaperfeita.com");
        localStorage.setItem("admin_id", "editor-session");
        localStorage.setItem("admin_is_main", "true");
        
        toast({
          title: "Acesso de edição",
          description: "Modo de edição ativado automaticamente",
        });
        
        setIsLoading(false);
        return;
      }
      
      // Check if in development or preview mode
      if (isDevelopmentOrPreview()) {
        console.log("Bypassing auth check - Development or preview environment detected");
        
        // Set admin info for development with proper admin permissions
        localStorage.setItem("musicaperfeita_admin", "true");
        localStorage.setItem("admin_email", "contato@musicaperfeita.com");
        localStorage.setItem("admin_id", "dev-session");
        localStorage.setItem("admin_is_main", "true");
        
        toast({
          title: "Acesso de desenvolvimento",
          description: "Modo de desenvolvimento ativado automaticamente",
        });
        
        setIsLoading(false);
        return;
      }
      
      // Check if admin is logged in
      const isAdmin = localStorage.getItem("musicaperfeita_admin");
      if (!isAdmin) {
        toast({
          title: "Acesso restrito",
          description: "Você precisa fazer login como administrador para acessar esta página",
          variant: "destructive",
        });
        navigate("/admin-login");
        return;
      }
      
      // Check if we have admin email
      const adminEmail = localStorage.getItem("admin_email");
      if (!adminEmail) {
        toast({
          title: "Sessão inválida",
          description: "Sua sessão expirou ou está inválida. Por favor, faça login novamente",
          variant: "destructive",
        });
        localStorage.removeItem("musicaperfeita_admin");
        navigate("/admin-login");
        return;
      }
      
      // Verificar se o email existe na base de dados como admin
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('is_admin')
          .eq('email', adminEmail)
          .single();
          
        if (error || !data || data.is_admin !== true) {
          console.error("Usuário não é admin:", adminEmail);
          localStorage.removeItem("musicaperfeita_admin");
          localStorage.removeItem("admin_email");
          localStorage.removeItem("admin_id");
          localStorage.removeItem("admin_is_main");
          
          toast({
            title: "Acesso negado",
            description: "Você não possui permissões de administrador",
            variant: "destructive",
          });
          
          navigate("/");
          return;
        }
      } catch (error) {
        console.error("Erro ao verificar permissões de admin:", error);
        navigate("/admin-login");
        return;
      }
      
      setIsLoading(false);
    };

    // Check auth immediately
    checkAdminAuth();
    
    // Add event listener for when the page becomes visible again (user returns to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAdminAuth();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <AdminProvider>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        <main className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Painel do Administrador</h1>
              <div className="flex items-center gap-4">
                <NotificationsPanel />
                <button 
                  onClick={onLogout}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md text-sm flex items-center"
                >
                  Sair
                </button>
              </div>
            </div>
            
            <AdminDashboard />
          </div>
        </main>
        
        <footer className="bg-gray-800 text-white py-8 text-center">
          <div className="max-w-5xl mx-auto px-6">
            <p>&copy; {new Date().getFullYear()} Musicaperfeita. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    </AdminProvider>
  );
};

export default AdminPage;
