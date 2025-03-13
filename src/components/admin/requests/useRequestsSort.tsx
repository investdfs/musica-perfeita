
import { useState } from "react";
import { MusicRequest } from "@/types/database.types";

export type SortColumn = 'cliente' | 'honoree' | 'status' | 'payment' | 'date';
export type SortDirection = 'asc' | 'desc';

export const useRequestsSort = (requests: MusicRequest[], getUserName: (userId: string) => string) => {
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Inverter a direção se a coluna já estiver selecionada
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Definir a nova coluna e resetar a direção para ascendente
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortedRequests = () => {
    if (!sortColumn) return requests;

    return [...requests].sort((a, b) => {
      let comparison = 0;
      
      switch (sortColumn) {
        case 'cliente':
          const userNameA = getUserName(a.user_id).toLowerCase();
          const userNameB = getUserName(b.user_id).toLowerCase();
          comparison = userNameA.localeCompare(userNameB);
          break;
        case 'honoree':
          comparison = a.honoree_name.toLowerCase().localeCompare(b.honoree_name.toLowerCase());
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'payment':
          comparison = a.payment_status.localeCompare(b.payment_status);
          break;
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  return {
    sortColumn,
    sortDirection,
    handleSort,
    getSortedRequests
  };
};
