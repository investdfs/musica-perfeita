
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { isDevelopmentOrPreview } from "@/lib/environment";
import { useAdmin } from "@/contexts/AdminContext";
import UserManagement from "@/components/admin/UserManagement";
import RequestsManagement from "@/components/admin/RequestsManagement";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import NotificationsPanel from "@/components/admin/NotificationsPanel";
import RequestsFilters from "@/components/admin/RequestsFilters";
import { useAdminFilters } from "@/contexts/AdminContext";

const AdminDashboard = () => {
  const { isLoading, requests, users, filteredRequests, setRequests, getUserEmail, fetchUsers } = useAdmin();
  const {
    searchQuery,
    filterStatus,
    filterPaymentStatus,
    handleSearch,
    handleFilterByStatus,
    handleFilterByPaymentStatus,
    handleClearFilters
  } = useAdminFilters();
  const navigate = useNavigate();

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

  return (
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
  );
};

export default AdminDashboard;
