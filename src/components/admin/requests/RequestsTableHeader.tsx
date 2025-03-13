
import { 
  TableHeader, 
  TableRow, 
  TableHead 
} from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export type SortColumn = 'cliente' | 'honoree' | 'status' | 'payment' | 'date';
export type SortDirection = 'asc' | 'desc';

interface RequestsTableHeaderProps {
  sortColumn: SortColumn | null;
  sortDirection: SortDirection;
  onSort: (column: SortColumn) => void;
}

const RequestsTableHeader = ({ 
  sortColumn,
  sortDirection, 
  onSort 
}: RequestsTableHeaderProps) => {
  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="ml-1 h-4 w-4 inline" />;
    }
    
    return sortDirection === 'asc' 
      ? <ArrowUp className="ml-1 h-4 w-4 inline text-blue-500" />
      : <ArrowDown className="ml-1 h-4 w-4 inline text-blue-500" />;
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead 
          className="w-[150px] text-gray-700 cursor-pointer hover:bg-gray-50"
          onClick={() => onSort('cliente')}
        >
          Cliente {getSortIcon('cliente')}
        </TableHead>
        <TableHead 
          className="w-[150px] text-gray-700 cursor-pointer hover:bg-gray-50"
          onClick={() => onSort('honoree')}
        >
          Homenageado {getSortIcon('honoree')}
        </TableHead>
        <TableHead 
          className="w-[120px] text-gray-700 cursor-pointer hover:bg-gray-50"
          onClick={() => onSort('status')}
        >
          Status {getSortIcon('status')}
        </TableHead>
        <TableHead 
          className="w-[120px] text-gray-700 cursor-pointer hover:bg-gray-50"
          onClick={() => onSort('payment')}
        >
          Pagamento {getSortIcon('payment')}
        </TableHead>
        <TableHead 
          className="w-[100px] text-gray-700 cursor-pointer hover:bg-gray-50"
          onClick={() => onSort('date')}
        >
          Data {getSortIcon('date')}
        </TableHead>
        <TableHead className="text-gray-700">Link da Música</TableHead>
        <TableHead className="w-[100px] text-right text-gray-700">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default RequestsTableHeader;
