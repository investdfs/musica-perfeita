
import React from "react";
import { UserProfile } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import UserForm from "./users/UserForm";
import DeleteConfirmDialog from "./users/DeleteConfirmDialog";
import UsersTable from "./users/UsersTable";
import { useUserManagement } from "./users/useUserManagement";

interface UserManagementProps {
  users: UserProfile[];
  fetchUsers: () => void | Promise<void>;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, fetchUsers }) => {
  const {
    showUserForm,
    setShowUserForm,
    selectedUser,
    setSelectedUser,
    showDeleteConfirm,
    setShowDeleteConfirm,
    newUser,
    setNewUser,
    handleUserFormSubmit,
    handleEditUser,
    confirmDeleteUser,
    handleDeleteUser,
    formatDate
  } = useUserManagement(fetchUsers);

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
        <UsersTable 
          users={regularUsers}
          handleEditUser={handleEditUser}
          confirmDeleteUser={confirmDeleteUser}
          formatDate={formatDate}
        />
      )}

      {/* Formulário para adicionar/editar clientes */}
      <UserForm 
        showUserForm={showUserForm}
        setShowUserForm={setShowUserForm}
        selectedUser={selectedUser}
        newUser={newUser}
        setNewUser={setNewUser}
        handleUserFormSubmit={handleUserFormSubmit}
      />

      {/* Diálogo de confirmação de exclusão */}
      <DeleteConfirmDialog 
        showDeleteConfirm={showDeleteConfirm}
        setShowDeleteConfirm={setShowDeleteConfirm}
        handleDeleteUser={handleDeleteUser}
      />
    </>
  );
};

export default UserManagement;
