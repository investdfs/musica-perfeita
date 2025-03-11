
import React from "react";
import { UserProfile } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import AdminsTable from "./admins/AdminsTable";
import AdminForm from "./admins/AdminForm";
import DeleteConfirmDialog from "./admins/DeleteConfirmDialog";
import { useAdminManagement } from "./admins/useAdminManagement";

interface AdminManagementProps {
  users: UserProfile[];
  fetchUsers: () => void | Promise<void>;
  isMainAdmin: boolean;
  showPasswordField?: boolean;
}

const AdminManagement: React.FC<AdminManagementProps> = ({ 
  users, 
  fetchUsers, 
  isMainAdmin,
  showPasswordField = false
}) => {
  const {
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
  } = useAdminManagement(users, fetchUsers, isMainAdmin);

  const admins = users.filter(user => user.is_admin);

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
            <UserPlus className="w-4 h-4 mr-2" />
            Novo Administrador
          </Button>
        )}
      </div>
      
      {admins.length === 0 ? (
        <p className="text-center py-8">Nenhum administrador cadastrado.</p>
      ) : (
        <AdminsTable
          admins={admins}
          isMainAdmin={isMainAdmin}
          showPasswordField={showPasswordField}
          onEditAdmin={handleEditAdmin}
          onConfirmRemoveAdmin={confirmRemoveAdmin}
          formatDate={formatDate}
        />
      )}

      {/* Formulário para adicionar/editar administradores */}
      <AdminForm
        showAdminForm={showAdminForm}
        setShowAdminForm={setShowAdminForm}
        formData={formData}
        setFormData={setFormData}
        handleFormSubmit={handleFormSubmit}
        isEditMode={!!selectedUser}
      />

      {/* Diálogo de confirmação de exclusão */}
      <DeleteConfirmDialog
        showDeleteConfirm={showDeleteConfirm}
        setShowDeleteConfirm={setShowDeleteConfirm}
        handleRemoveAdmin={handleRemoveAdmin}
      />
    </div>
  );
};

export default AdminManagement;
