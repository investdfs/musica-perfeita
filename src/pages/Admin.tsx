
import { useEffect } from "react";
import Header from "@/components/Header";
import NotificationsPanel from "@/components/admin/NotificationsPanel";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { AdminProvider } from "@/contexts/AdminContext";

const Admin = () => {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        <main className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Painel do Administrador</h1>
              <NotificationsPanel />
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

export default Admin;
