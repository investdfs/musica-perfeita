
import React from "react";
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
import { Trash, AlertTriangle } from "lucide-react";

interface DeleteConfirmDialogProps {
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (show: boolean) => void;
  handleRemoveAdmin: () => Promise<void>;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  showDeleteConfirm,
  setShowDeleteConfirm,
  handleRemoveAdmin
}) => {
  return (
    <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
      <AlertDialogContent className="bg-white border-red-200 border-2">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center text-red-600">
            <AlertTriangle className="w-5 h-5 mr-2" /> Confirmar remoção de administrador
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação irá remover as permissões de administrador deste usuário. O usuário continuará existindo como cliente regular.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleRemoveAdmin}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash className="w-4 h-4 mr-2" /> Remover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;
