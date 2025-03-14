
import { 
  Table, 
  TableBody
} from "@/components/ui/table";
import { MusicRequest } from "@/types/database.types";
import RequestsTableHeader from "./RequestsTableHeader";
import RequestRow from "./RequestRow";
import { useRequestsSort } from "./useRequestsSort";

interface RequestsListProps {
  requests: MusicRequest[];
  isLoading: boolean;
  getUserName: (userId: string) => string;
  onViewDetails: (request: MusicRequest) => void;
  onUpdateStatus: (requestId: string, status?: MusicRequest['status'], paymentStatus?: MusicRequest['payment_status']) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, request: MusicRequest) => void;
  onDeliverMusic: (request: MusicRequest) => void;
  onDownloadFile?: (request: MusicRequest) => void;
  isUploading: boolean;
  selectedRequestId: string | null;
  onSaveMusicLink: (requestId: string, musicLink: string) => Promise<void>;
  onEditTechnicalDetails: (request: MusicRequest) => void;
}

const RequestsList = ({ 
  requests, 
  isLoading, 
  getUserName,
  onViewDetails, 
  onUpdateStatus, 
  onFileUpload, 
  onDeliverMusic,
  onDownloadFile,
  isUploading,
  selectedRequestId,
  onSaveMusicLink,
  onEditTechnicalDetails
}: RequestsListProps) => {
  const {
    sortColumn,
    sortDirection,
    handleSort,
    getSortedRequests
  } = useRequestsSort(requests, getUserName);

  const sortedRequests = getSortedRequests();

  return (
    <>
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Lista de Pedidos</h2>
      
      {isLoading ? (
        <p className="text-center py-8 text-gray-700">Carregando pedidos...</p>
      ) : requests.length === 0 ? (
        <p className="text-center py-8 text-gray-700">Nenhum pedido encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table className="w-full">
            <RequestsTableHeader 
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <TableBody>
              {sortedRequests.map((request) => (
                <RequestRow
                  key={request.id}
                  request={request}
                  getUserName={getUserName}
                  onViewDetails={onViewDetails}
                  onUpdateStatus={onUpdateStatus}
                  onFileUpload={onFileUpload}
                  onDeliverMusic={onDeliverMusic}
                  onDownloadFile={onDownloadFile}
                  isUploading={isUploading}
                  selectedRequestId={selectedRequestId}
                  onSaveMusicLink={onSaveMusicLink}
                  onEditTechnicalDetails={onEditTechnicalDetails}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};

export default RequestsList;
