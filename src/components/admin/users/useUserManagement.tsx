
import { useState } from "react";
import { UserProfile } from "@/types/database.types";
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";

export const useUserManagement = (fetchUsers: () => void | Promise<void>) => {
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

  return {
    showUserForm,
    setShowUserForm,
    selectedUser,
    setSelectedUser,
    userToDelete,
    setUserToDelete,
    showDeleteConfirm,
    setShowDeleteConfirm,
    newUser,
    setNewUser,
    handleUserFormSubmit,
    handleEditUser,
    confirmDeleteUser,
    handleDeleteUser,
    formatDate
  };
};
