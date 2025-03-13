
import React from "react";
import { UserProfile } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

interface UserFormProps {
  showUserForm: boolean;
  setShowUserForm: (show: boolean) => void;
  selectedUser: UserProfile | null;
  newUser: {
    name: string;
    email: string;
    whatsapp: string;
    password: string;
  };
  setNewUser: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    whatsapp: string;
    password: string;
  }>>;
  handleUserFormSubmit: () => Promise<void>;
}

const UserForm: React.FC<UserFormProps> = ({ 
  showUserForm, 
  setShowUserForm, 
  selectedUser, 
  newUser, 
  setNewUser, 
  handleUserFormSubmit 
}) => {
  return (
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
  );
};

export default UserForm;
