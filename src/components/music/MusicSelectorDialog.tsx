
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Music, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MusicRequest } from "@/types/database.types";
import { formatDate } from "@/lib/utils";

interface MusicSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  musicRequests: MusicRequest[];
}

const MusicSelectorDialog = ({ open, onOpenChange, musicRequests }: MusicSelectorDialogProps) => {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleSelectMusic = (requestId: string) => {
    setSelectedRequestId(requestId);
  };
  
  const handleContinue = () => {
    if (!selectedRequestId) return;
    
    const selectedRequest = musicRequests.find(req => req.id === selectedRequestId);
    if (!selectedRequest) return;
    
    navigate("/music-player-full", { 
      state: { 
        musicUrl: selectedRequest.full_song_url,
        downloadUrl: selectedRequest.full_song_url,
        requestId: selectedRequest.id
      } 
    });
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Selecione sua música</DialogTitle>
          <DialogDescription>
            Você tem várias músicas disponíveis. Selecione qual deseja ouvir.
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[400px] overflow-y-auto py-4">
          {musicRequests.map((request) => (
            <div 
              key={request.id}
              className={`p-4 mb-3 rounded-lg border cursor-pointer transition-all ${
                selectedRequestId === request.id 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
              }`}
              onClick={() => handleSelectMusic(request.id)}
            >
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-indigo-100 text-indigo-600 mr-3">
                  <Music className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{request.honoree_name}</h4>
                  <p className="text-sm text-gray-500">
                    {request.relationship_type === 'other' 
                      ? request.custom_relationship 
                      : request.relationship_type}
                    {request.order_number && ` • Pedido ${request.order_number}`}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Criada em {formatDate(request.created_at)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end space-x-2 mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            disabled={!selectedRequestId} 
            onClick={handleContinue}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MusicSelectorDialog;
