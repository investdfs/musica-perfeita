
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/AdminContext";
import UserManagement from "@/components/admin/UserManagement";
import RequestsManagement from "@/components/admin/RequestsManagement";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import RequestsFilters from "@/components/admin/RequestsFilters";
import { useAdminFilters } from "@/contexts/AdminContext";
import AdminManagement from "@/components/admin/AdminManagement";

const AdminDashboard = () => {
  const { 
    isLoading, 
    requests, 
    users, 
    filteredRequests, 
    setRequests, 
    getUserEmail,
    fetchUsers,
    isMainAdmin,
    visitorCount
  } = useAdmin();
  
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
      const isAdmin = localStorage.getItem("musicaperfeita_admin");
      if (!isAdmin) {
        navigate("/admin-login");
        return;
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Filter regular users (non-admin)
  const regularUsers = users.filter(user => !user.is_admin);

  return (
    <div className="space-y-8">
      <Card className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Análises</h2>
        <AnalyticsDashboard 
          requests={requests} 
          users={regularUsers} 
          visitorCount={visitorCount} 
        />
      </Card>
      
      <Card className="bg-white rounded-lg shadow-md p-6 overflow-hidden">
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
        <h2 className="text-xl font-semibold mb-4">Clientes</h2>
        <UserManagement users={regularUsers} fetchUsers={fetchUsers} />
      </Card>
      
      {/* Movida para o final da página conforme solicitado */}
      <Card className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Administradores</h2>
        <AdminManagement 
          users={users} 
          fetchUsers={fetchUsers} 
          isMainAdmin={isMainAdmin}
          showPasswordField={true}
        />
      </Card>
    </div>
  );
};

export default AdminDashboard;
