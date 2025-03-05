
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import NotificationsPanel from "@/components/admin/NotificationsPanel";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { AdminProvider } from "@/contexts/AdminContext";
import { toast } from "@/hooks/use-toast";

const AdminPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verifica se o usuário está logado como admin
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
    
    // Verifica se temos o email do admin
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
  }, [navigate]);
  
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
