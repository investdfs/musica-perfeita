
import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface RequestsFiltersProps {
  onSearch: (query: string) => void;
  onFilterByStatus: (status: string | null) => void;
  onFilterByPaymentStatus: (status: string | null) => void;
  onClearFilters: () => void;
  searchQuery: string;
  filterStatus: string | null;
  filterPaymentStatus: string | null;
}

const RequestsFilters = ({ 
  onSearch, 
  onFilterByStatus, 
  onFilterByPaymentStatus, 
  onClearFilters,
  searchQuery,
  filterStatus,
  filterPaymentStatus
}: RequestsFiltersProps) => {
  const handleNotificationsToggle = (enabled: boolean) => {
    if (enabled) {
      toast({
        title: "Notificações por email ativadas",
        description: "Você receberá notificações por email para novos pedidos e atualizações de status.",
      });
    } else {
      toast({
        title: "Notificações por email desativadas",
        description: "Você não receberá mais notificações por email.",
      });
    }
  };

  return (
    <div className="mb-6 space-y-4">
      <h2 className="text-xl font-semibold mb-4">Filtrar Pedidos</h2>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Buscar por cliente, homenageado ou ID..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        
        <Select 
          value={filterStatus || ""} 
          onValueChange={(value) => onFilterByStatus(value || null)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status do pedido" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="in_production">Em Produção</SelectItem>
            <SelectItem value="completed">Concluído</SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          value={filterPaymentStatus || ""} 
          onValueChange={(value) => onFilterByPaymentStatus(value || null)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status do pagamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Não Pago</SelectItem>
            <SelectItem value="completed">Pago</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" onClick={onClearFilters}>
          Limpar Filtros
        </Button>
      </div>
      
      <div className="flex items-center space-x-2 pt-2">
        <Switch id="email-notifications" onCheckedChange={handleNotificationsToggle} />
        <Label htmlFor="email-notifications" className="flex items-center cursor-pointer">
          <Bell className="h-4 w-4 mr-2 text-gray-500" />
          Notificações por email para novos pedidos
        </Label>
      </div>
    </div>
  );
};

export default RequestsFilters;
