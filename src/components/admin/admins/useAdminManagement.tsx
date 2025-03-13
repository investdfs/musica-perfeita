
import { useState } from "react";
import { UserProfile } from "@/types/database.types";
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";

export const useAdminManagement = (
  users: UserProfile[],
  fetchUsers: () => void | Promise<void>,
  isMainAdmin: boolean
) => {
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [adminToRemove, setAdminToRemove] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    password: "",
    is_admin: false,
    is_main_admin: false
  });

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

  const confirmRemoveAdmin = (userId: string) => {
    setAdminToRemove(userId);
    setShowDeleteConfirm(true);
  };

  const handleRemoveAdmin = async () => {
    if (!adminToRemove) return;
    
    try {
      if (!isMainAdmin) {
        toast({
          title: "Operação não permitida",
          description: "Apenas o administrador principal pode remover administradores",
          variant: "destructive",
        });
        setShowDeleteConfirm(false);
        setAdminToRemove(null);
        return;
      }

      const adminToRemoveData = users.find(user => user.id === adminToRemove);
      if (adminToRemoveData?.is_main_admin) {
        toast({
          title: "Operação não permitida",
          description: "Não é possível remover o administrador principal",
          variant: "destructive",
        });
        setShowDeleteConfirm(false);
        setAdminToRemove(null);
        return;
      }
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_admin: false })
        .eq('id', adminToRemove);
        
      if (error) throw error;
      
      toast({
        title: "Administrador removido",
        description: "Permissões de administrador revogadas com sucesso",
      });
      
      setShowDeleteConfirm(false);
      setAdminToRemove(null);
      await fetchUsers();
    } catch (error) {
      console.error('Error removing admin:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o administrador",
        variant: "destructive",
      });
      setShowDeleteConfirm(false);
      setAdminToRemove(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return {
    showAdminForm,
    setShowAdminForm,
    selectedUser,
    setSelectedUser,
    showDeleteConfirm,
    setShowDeleteConfirm,
    formData,
    setFormData,
    handleFormSubmit,
    handleEditAdmin,
    confirmRemoveAdmin,
    handleRemoveAdmin,
    formatDate
  };
};
