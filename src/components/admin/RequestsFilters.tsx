
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
            <SelectItem value="">Todos os status</SelectItem>
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
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="pending">Não Pago</SelectItem>
            <SelectItem value="completed">Pago</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" onClick={onClearFilters}>
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
};

export default RequestsFilters;
