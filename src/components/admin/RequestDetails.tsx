
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
  const [musicLink, setMusicLink] = useState<string>("");
  
  const handleSaveClicked = () => {
    if (!musicLink.trim()) {
      toast({
        title: "Erro",
        description: "Digite um link de música válido.",
        variant: "destructive",
      });
      return;
    }

    // Verificação básica para garantir que o link seja um arquivo de áudio
    const isValidAudioLink = musicLink.match(/\.(mp3|wav|ogg|m4a|flac)($|\?)/i) || 
                            musicLink.includes('wp.novaenergiamg.com.br') ||
                            musicLink.includes('drive.google.com');

    if (!isValidAudioLink) {
      const confirmUpload = window.confirm(
        "O link fornecido não parece ser um arquivo de áudio. Deseja continuar mesmo assim?"
      );
      if (!confirmUpload) return;
    }

    handleSaveSoundCloudId(musicLink);
    setMusicLink("");
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
              <h3 className="text-sm font-medium text-gray-500 mb-2">Link atual da música</h3>
              {selectedRequest.full_song_url ? (
                <div className="p-3 bg-green-50 rounded">
                  <p className="text-sm text-green-700">
                    Link atual: <a href={selectedRequest.full_song_url} target="_blank" rel="noopener noreferrer" className="font-medium underline">{selectedRequest.full_song_url}</a>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Para alterar o link da música, use a opção "Enviar" na lista de pedidos.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded">
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
