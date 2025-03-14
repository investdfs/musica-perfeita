
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Music, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { MusicRequest } from "@/types/database.types";

interface TechnicalDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  request: MusicRequest | null;
  onSave: (requestId: string, details: string) => Promise<void>;
}

const TechnicalDetailsDialog = ({ 
  isOpen, 
  onClose, 
  request,
  onSave
}: TechnicalDetailsDialogProps) => {
  const [details, setDetails] = useState<string>(request?.technical_details || "");
  const [isSaving, setSaving] = useState(false);

  // Resetar os detalhes quando mudar o pedido
  useState(() => {
    if (request) {
      setDetails(request.technical_details || "");
    }
  });

  const handleSave = async () => {
    if (!request) return;
    
    try {
      setSaving(true);
      await onSave(request.id, details);
      
      toast({
        title: "Detalhes salvos",
        description: "Os detalhes técnicos da música foram salvos com sucesso.",
      });
      
      onClose();
    } catch (error) {
      console.error("Erro ao salvar detalhes técnicos:", error);
      
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar os detalhes técnicos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Music className="h-5 w-5 text-purple-600" />
            Detalhes Técnicos da Música
          </DialogTitle>
          <DialogDescription>
            Adicione informações técnicas sobre a composição, arranjo, instrumentos, etc.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <p className="text-gray-700">
              Estas informações serão exibidas para o cliente junto com a música, 
              permitindo que ele conheça aspectos técnicos da composição.
            </p>
          </div>
          
          <Textarea
            placeholder="Descreva os detalhes técnicos da música, como tipo de composição, instrumentos utilizados, características do arranjo, etc."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="min-h-[200px]"
          />
        </div>
        
        <DialogFooter className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {request?.honoree_name && (
              <span>Música para: <span className="font-medium">{request.honoree_name}</span></span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
              disabled={isSaving}
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Salvando..." : "Salvar Detalhes"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TechnicalDetailsDialog;
