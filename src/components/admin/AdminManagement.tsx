
import React, { useState } from "react";
import { UserProfile } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";
import { Shield, Trash, Edit, PlusCircle } from "lucide-react";

interface AdminManagementProps {
  users: UserProfile[];
  fetchUsers: () => void | Promise<void>;
  isMainAdmin: boolean;
}

const AdminManagement: React.FC<AdminManagementProps> = ({ users, fetchUsers, isMainAdmin }) => {
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    password: "",
    is_admin: false,
    is_main_admin: false
  });

  const admins = users.filter(user => user.is_admin);

  const handleFormSubmit = async () => {
    try {
      if (selectedUser) {
        if (!isMainAdmin && formData.is_main_admin) {
          toast({
            title: "Operação não permitida",
            description: "Apenas o administrador principal pode designar outros administradores principais",
            variant: "destructive",
          });
          return;
        }

        const { error } = await supabase
          .from('user_profiles')
          .update({
            name: formData.name,
            email: formData.email,
            whatsapp: formData.whatsapp,
            password: formData.password,
            is_admin: formData.is_admin,
            is_main_admin: formData.is_main_admin
          })
          .eq('id', selectedUser.id);
          
        if (error) throw error;
        
        toast({
          title: "Administrador atualizado",
          description: "As informações foram atualizadas com sucesso",
        });
      } else {
        if (!isMainAdmin) {
          toast({
            title: "Operação não permitida",
            description: "Apenas o administrador principal pode criar novos administradores",
            variant: "destructive",
          });
          return;
        }

        const { error } = await supabase
          .from('user_profiles')
          .insert([{
            name: formData.name,
            email: formData.email,
            whatsapp: formData.whatsapp,
            password: formData.password,
            is_admin: true,
            is_main_admin: formData.is_main_admin
          }]);
          
        if (error) throw error;
        
        toast({
          title: "Administrador criado",
          description: "Novo administrador adicionado com sucesso",
        });
      }
      
      setFormData({ 
        name: "", 
        email: "", 
        whatsapp: "", 
        password: "", 
        is_admin: false,
        is_main_admin: false 
      });
      setSelectedUser(null);
      setShowAdminForm(false);
      
      await fetchUsers();
    } catch (error) {
      console.error('Error managing admin:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o administrador",
        variant: "destructive",
      });
    }
  };

  const handleEditAdmin = (user: UserProfile) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      whatsapp: user.whatsapp || "",
      password: user.password,
      is_admin: user.is_admin || false,
      is_main_admin: user.is_main_admin || false
    });
    setShowAdminForm(true);
  };

  const handleRemoveAdmin = async (userId: string) => {
    try {
      if (!isMainAdmin) {
        toast({
          title: "Operação não permitida",
          description: "Apenas o administrador principal pode remover administradores",
          variant: "destructive",
        });
        return;
      }

      const adminToRemove = users.find(user => user.id === userId);
      if (adminToRemove?.is_main_admin) {
        toast({
          title: "Operação não permitida",
          description: "Não é possível remover o administrador principal",
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_admin: false })
        .eq('id', userId);
        
      if (error) throw error;
      
      toast({
        title: "Administrador removido",
        description: "Permissões de administrador revogadas com sucesso",
      });
      
      await fetchUsers();
    } catch (error) {
      console.error('Error removing admin:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o administrador",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gerenciar Administradores</h2>
        {isMainAdmin && (
          <Button 
            onClick={() => {
              setSelectedUser(null);
              setFormData({ 
                name: "", 
                email: "", 
                whatsapp: "", 
                password: "", 
                is_admin: true,
                is_main_admin: false 
              });
              setShowAdminForm(true);
            }}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Novo Administrador
          </Button>
        )}
      </div>
      
      {admins.length === 0 ? (
        <p className="text-center py-8">Nenhum administrador cadastrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Data de Cadastro</TableHead>
                <TableHead>Principal</TableHead>
                {isMainAdmin && <TableHead>Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.whatsapp}</TableCell>
                  <TableCell>{formatDate(admin.created_at)}</TableCell>
                  <TableCell>
                    {admin.is_main_admin ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Sim
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        Não
                      </span>
                    )}
                  </TableCell>
                  {isMainAdmin && (
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditAdmin(admin)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {!admin.is_main_admin && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRemoveAdmin(admin.id)}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={showAdminForm} onOpenChange={setShowAdminForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedUser ? "Editar Administrador" : "Novo Administrador"}</DialogTitle>
            <DialogDescription>
              {selectedUser 
                ? "Edite as informações do administrador abaixo" 
                : "Preencha os campos abaixo para adicionar um novo administrador"}
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
              {selectedUser ? "Salvar Alterações" : "Adicionar Administrador"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminManagement;
