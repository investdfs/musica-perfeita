
import { MusicRequest } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

interface RequestDetailsProps {
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;
  selectedRequest: MusicRequest | null;
  handleSaveSoundCloudId: (soundCloudId: string) => void;
  isUploading: boolean;
}

const RequestDetails = ({ 
  showDetails, 
  setShowDetails, 
  selectedRequest
}: RequestDetailsProps) => {
  return (
    <Dialog open={showDetails} onOpenChange={setShowDetails}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalhes do Pedido</DialogTitle>
          <DialogDescription>
            {selectedRequest && `Pedido para ${selectedRequest.honoree_name}`}
          </DialogDescription>
        </DialogHeader>
        
        {selectedRequest && (
          <div className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Relacionamento</h3>
                <p className="text-gray-900">{selectedRequest.relationship_type}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Gênero Musical</h3>
                <p className="text-gray-900">{selectedRequest.music_genre}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Incluir Nomes</h3>
                <p className="text-gray-900">{selectedRequest.include_names ? 'Sim' : 'Não'}</p>
              </div>
              
              {selectedRequest.include_names && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Nomes</h3>
                  <p className="text-gray-900">{selectedRequest.names_to_include || 'Nenhum nome especificado'}</p>
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Status do Pagamento</h3>
                <p className="text-gray-900">{selectedRequest.payment_status === 'completed' ? 'Pago' : 'Não Pago'}</p>
              </div>
              
              {selectedRequest.technical_details && (
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h3 className="text-sm font-medium text-purple-700 mb-2">Detalhes Técnicos</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedRequest.technical_details}</p>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-3">História</h3>
              <p className="text-gray-900 whitespace-pre-wrap">{selectedRequest.story}</p>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Link atual da música</h3>
              {selectedRequest.full_song_url ? (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700">
                    Link atual: <a href={selectedRequest.full_song_url} target="_blank" rel="noopener noreferrer" className="font-medium underline">{selectedRequest.full_song_url}</a>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Para alterar o link da música, use a opção "Enviar" na lista de pedidos.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700">
                    Nenhum link de música foi adicionado a este pedido ainda.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Use a opção "Enviar" na lista de pedidos para adicionar um link de música.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        <DialogFooter className="mt-6">
          <Button 
            onClick={() => setShowDetails(false)}
            className="bg-gray-700 hover:bg-gray-800"
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetails;
