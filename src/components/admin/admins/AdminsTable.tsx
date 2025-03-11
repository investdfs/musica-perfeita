
import React from "react";
import { UserProfile } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Edit, Trash } from "lucide-react";

interface AdminsTableProps {
  admins: UserProfile[];
  isMainAdmin: boolean;
  showPasswordField: boolean;
  onEditAdmin: (admin: UserProfile) => void;
  onConfirmRemoveAdmin: (adminId: string) => void;
  formatDate: (date: string) => string;
}

const AdminsTable: React.FC<AdminsTableProps> = ({ 
  admins, 
  isMainAdmin, 
  showPasswordField, 
  onEditAdmin, 
  onConfirmRemoveAdmin,
  formatDate 
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            {showPasswordField && <TableHead>Senha</TableHead>}
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
              {showPasswordField && <TableCell>{admin.password}</TableCell>}
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
                      onClick={() => onEditAdmin(admin)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {!admin.is_main_admin && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => onConfirmRemoveAdmin(admin.id)}
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
  );
};

export default AdminsTable;
