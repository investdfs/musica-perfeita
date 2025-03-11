
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";
import { PlusCircle, Trash, Edit, AlertTriangle } from "lucide-react";

interface UserManagementProps {
  users: UserProfile[];
  fetchUsers: () => void | Promise<void>;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, fetchUsers }) => {
  const [showUserForm, setShowUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    whatsapp: "",
    password: ""
  });

  const handleUserFormSubmit = async () => {
    try {
      if (selectedUser) {
        const { error } = await supabase
          .from('user_profiles')
          .update({
            name: newUser.name,
            email: newUser.email,
            whatsapp: newUser.whatsapp,
            password: newUser.password
          })
          .eq('id', selectedUser.id);
          
        if (error) throw error;
        
        toast({
          title: "Cliente atualizado",
          description: "As informações foram atualizadas com sucesso",
        });
      } else {
        const { error } = await supabase
          .from('user_profiles')
          .insert([{
            name: newUser.name,
            email: newUser.email,
            whatsapp: newUser.whatsapp,
            password: newUser.password
          }]);
          
        if (error) throw error;
        
        toast({
          title: "Cliente criado",
          description: "Novo cliente adicionado com sucesso",
        });
      }
      
      setNewUser({ name: "", email: "", whatsapp: "", password: "" });
      setSelectedUser(null);
      setShowUserForm(false);
      
      await fetchUsers();
    } catch (error) {
      console.error('Error managing user:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o cliente",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = (user: UserProfile) => {
    setSelectedUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      whatsapp: user.whatsapp,
      password: user.password
    });
    setShowUserForm(true);
  };

  const confirmDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      const { data } = await supabase
        .from('music_requests')
        .select('id')
        .eq('user_id', userToDelete);
        
      if (data && data.length > 0) {
        toast({
          title: "Não foi possível excluir",
          description: "Este cliente possui pedidos de música associados",
          variant: "destructive",
        });
        setShowDeleteConfirm(false);
        setUserToDelete(null);
        return;
      }
      
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userToDelete);
        
      if (error) throw error;
      
      toast({
        title: "Cliente excluído",
        description: "Cliente excluído com sucesso",
      });
      
      setShowDeleteConfirm(false);
      setUserToDelete(null);
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o cliente",
        variant: "destructive",
      });
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Filter out any admin users that might have been passed to this component
  const regularUsers = users.filter(user => !user.is_admin);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gerenciar Clientes</h2>
        <Button 
          onClick={() => {
            setSelectedUser(null);
            setNewUser({ name: "", email: "", whatsapp: "", password: "" });
            setShowUserForm(true);
          }}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>
      
      {regularUsers.length === 0 ? (
        <p className="text-center py-8">Nenhum cliente cadastrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Senha</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Data de Cadastro</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regularUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.password}</TableCell>
                  <TableCell>{user.whatsapp}</TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => confirmDeleteUser(user.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Formulário para adicionar/editar clientes */}
      <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedUser ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para {selectedUser ? "editar as informações do" : "adicionar um novo"} cliente.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Nome Completo</label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Senha</label>
              <Input
                id="password"
                type="text"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="whatsapp" className="text-sm font-medium">WhatsApp</label>
              <Input
                id="whatsapp"
                value={newUser.whatsapp}
                onChange={(e) => setNewUser({...newUser, whatsapp: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserForm(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUserFormSubmit}>
              {selectedUser ? "Salvar Alterações" : "Adicionar Cliente"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="bg-white border-red-200 border-2">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="w-5 h-5 mr-2" /> Confirmar exclusão
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O cliente será permanentemente removido do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash className="w-4 h-4 mr-2" /> Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserManagement;
