
import { useState } from "react";
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
import { toast } from "@/hooks/use-toast";
import { MusicRequest } from "@/types/database.types";

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
  selectedRequest, 
  handleSaveSoundCloudId, 
  isUploading 
}: RequestDetailsProps) => {
  const [soundCloudId, setSoundCloudId] = useState<string>("");
  
  const handleSaveClicked = () => {
    if (!soundCloudId.trim()) {
      toast({
        title: "Erro",
        description: "Digite um ID do SoundCloud válido.",
        variant: "destructive",
      });
      return;
    }

    handleSaveSoundCloudId(soundCloudId);
  };

  return (
    <Dialog open={showDetails} onOpenChange={setShowDetails}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Pedido</DialogTitle>
          <DialogDescription>
            {selectedRequest && `Pedido para ${selectedRequest.honoree_name}`}
          </DialogDescription>
        </DialogHeader>
        
        {selectedRequest && (
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Relacionamento</h3>
                <p>{selectedRequest.relationship_type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Gênero Musical</h3>
                <p>{selectedRequest.music_genre}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Incluir Nomes</h3>
                <p>{selectedRequest.include_names ? 'Sim' : 'Não'}</p>
              </div>
              {selectedRequest.include_names && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nomes</h3>
                  <p>{selectedRequest.names_to_include || 'Nenhum nome especificado'}</p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status do Pagamento</h3>
                <p>{selectedRequest.payment_status === 'completed' ? 'Pago' : 'Não Pago'}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">História</h3>
              <p className="p-3 bg-gray-50 rounded whitespace-pre-wrap">{selectedRequest.story}</p>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">ID do SoundCloud</h3>
              <div className="flex gap-2">
                <Input 
                  type="text" 
                  placeholder="Digite o ID do SoundCloud"
                  value={soundCloudId}
                  onChange={(e) => setSoundCloudId(e.target.value)}
                />
                <Button 
                  onClick={handleSaveClicked}
                  disabled={isUploading || !soundCloudId.trim()}
                >
                  {isUploading ? "Salvando..." : "Salvar"}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Digite o ID da faixa do SoundCloud para disponibilizar a música para o cliente.
              </p>
              {selectedRequest.soundcloud_id && (
                <div className="mt-3 p-3 bg-green-50 rounded">
                  <p className="text-sm text-green-700">
                    ID do SoundCloud atual: <span className="font-medium">{selectedRequest.soundcloud_id}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setShowDetails(false)}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetails;
