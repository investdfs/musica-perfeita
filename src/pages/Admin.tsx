import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import NotificationsPanel from "@/components/admin/NotificationsPanel";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { AdminProvider } from "@/contexts/AdminContext";
import { toast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";

const AdminPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verify admin authentication on every page visit
    const checkAdminAuth = () => {
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
      }
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
  
  // Add admin logout handler
  const handleAdminLogout = () => {
    localStorage.removeItem("musicaperfeita_admin");
    localStorage.removeItem("admin_email");
    localStorage.removeItem("admin_id");
    localStorage.removeItem("admin_is_main");
    
    toast({
      title: "Logout realizado",
      description: "Você saiu da conta de administrador com sucesso"
    });
    
    navigate("/admin-login");
  };
  
  return (
    <AdminProvider>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        <main className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Painel do Administrador</h1>
              <div className="flex items-center gap-4">
                <NotificationsPanel />
                <button
                  onClick={handleAdminLogout}
                  className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
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
