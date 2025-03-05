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
import supabase from "@/lib/supabase";

interface RequestDetailsProps {
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;
  selectedRequest: MusicRequest | null;
  handleUpload: (uploadedUrl: string) => void;
  isUploading: boolean;
  setAudioFile: (file: File | null) => void;
}

const RequestDetails = ({ 
  showDetails, 
  setShowDetails, 
  selectedRequest, 
  handleUpload, 
  isUploading,
  setAudioFile 
}: RequestDetailsProps) => {
  const [audioFileLocal, setAudioFileLocal] = useState<File | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioFileLocal(file);
      setAudioFile(file);
    }
  };

  const uploadToSupabase = async () => {
    if (!audioFileLocal || !selectedRequest) {
      toast({
        title: "Erro",
        description: "Selecione um arquivo de áudio para enviar.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create a unique file path
      const fileName = `music/${selectedRequest.id}/${Date.now()}-${audioFileLocal.name}`;
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('music-files')
        .upload(fileName, audioFileLocal, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) throw error;
      
      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('music-files')
        .getPublicUrl(fileName);
        
      // Pass the URL back to the parent component
      handleUpload(urlData.publicUrl);
      
      toast({
        title: "Sucesso",
        description: "Arquivo de áudio enviado com sucesso!",
      });
      
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: "Erro no upload",
        description: error.message || "Não foi possível enviar o arquivo de áudio",
        variant: "destructive",
      });
    }
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
              <h3 className="text-sm font-medium text-gray-500 mb-2">Enviar Música</h3>
              <Input 
                type="file" 
                accept="audio/mp3,audio/mpeg,audio/wav" 
                onChange={handleFileChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                Envie o arquivo da música em formato MP3 ou WAV (máximo 15MB).
              </p>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setShowDetails(false)}
          >
            Cancelar
          </Button>
          <Button 
            onClick={uploadToSupabase}
            disabled={isUploading || !audioFileLocal}
          >
            {isUploading ? "Enviando..." : "Enviar Música"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetails;
