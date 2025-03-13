
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

interface FormData {
  name: string;
  email: string;
  whatsapp: string;
  password: string;
  is_admin: boolean;
  is_main_admin: boolean;
}

interface AdminFormProps {
  showAdminForm: boolean;
  setShowAdminForm: (show: boolean) => void;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleFormSubmit: () => Promise<void>;
  isEditMode: boolean;
}

const AdminForm: React.FC<AdminFormProps> = ({
  showAdminForm,
  setShowAdminForm,
  formData,
  setFormData,
  handleFormSubmit,
  isEditMode
}) => {
  return (
    <Dialog open={showAdminForm} onOpenChange={setShowAdminForm}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Editar Administrador" : "Novo Administrador"}</DialogTitle>
          <DialogDescription>
            {isEditMode 
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
            {isEditMode ? "Salvar Alterações" : "Adicionar Administrador"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminForm;
