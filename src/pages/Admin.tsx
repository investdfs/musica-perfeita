
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import NotificationsPanel from "@/components/admin/NotificationsPanel";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { AdminProvider, useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";

const AdminPage = () => {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        <main className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Painel do Administrador</h1>
              <div className="flex items-center gap-4">
                <AdminActionsButton />
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

// New component for Admin Actions including adding new administrators
const AdminActionsButton = () => {
  const { isMainAdmin, fetchUsers } = useAdmin();
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    password: "",
    is_admin: true,
    is_main_admin: false
  });

  // Only show the button if user is main admin
  if (!isMainAdmin) return null;

  const handleFormSubmit = async () => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .insert([{
          name: formData.name,
          email: formData.email,
          whatsapp: formData.whatsapp || "",
          password: formData.password,
          is_admin: true,
          is_main_admin: formData.is_main_admin
        }]);
        
      if (error) throw error;
      
      toast({
        title: "Administrador criado",
        description: "Novo administrador adicionado com sucesso",
      });
      
      setFormData({ 
        name: "", 
        email: "", 
        whatsapp: "", 
        password: "", 
        is_admin: true,
        is_main_admin: false 
      });
      setShowAdminForm(false);
      
      await fetchUsers();
    } catch (error) {
      console.error('Error adding admin:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o administrador",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button onClick={() => setShowAdminForm(true)} variant="default">
        <UserPlus className="mr-2 h-4 w-4" />
        Novo Administrador
      </Button>

      <Dialog open={showAdminForm} onOpenChange={setShowAdminForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Administrador</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para adicionar um novo administrador
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="text"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="main-admin"
                checked={formData.is_main_admin}
                onCheckedChange={(checked) => setFormData({...formData, is_main_admin: checked})}
              />
              <Label htmlFor="main-admin">Administrador Principal</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdminForm(false)}>
              Cancelar
            </Button>
            <Button onClick={handleFormSubmit}>
              Adicionar Administrador
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminPage;
