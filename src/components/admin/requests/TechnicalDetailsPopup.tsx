
import { useState } from "react";
import { MusicRequest } from "@/types/database.types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, InfoIcon, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TechnicalDetailsPopupProps {
  request: MusicRequest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
}

const TechnicalDetailsPopup = ({ 
  request, 
  open, 
  onOpenChange,
  onSaved
}: TechnicalDetailsPopupProps) => {
  const [details, setDetails] = useState<string>(request.technical_details || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (details.trim() === '') {
      toast({
        title: "Campos vazios",
        description: "Por favor, preencha os detalhes técnicos.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('music_requests')
        .update({ 
          technical_details: details,
          has_technical_details: true
        })
        .eq('id', request.id);
      
      if (error) throw error;
      
      toast({
        title: "Detalhes salvos",
        description: "Os detalhes técnicos da música foram salvos com sucesso.",
      });
      
      if (onSaved) {
        onSaved();
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar detalhes técnicos:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar os detalhes técnicos. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="w-5 h-5 text-purple-500" />
            Detalhes Técnicos da Música
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-purple-50 p-3 rounded-md border border-purple-200 text-sm text-purple-700 flex items-start">
            <InfoIcon className="w-5 h-5 mr-2 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              Informe os detalhes técnicos da música, como informações de composição, 
              BPM, escalas musicais utilizadas, instrumentos, etc. Estes detalhes ficarão 
              visíveis para o cliente.
            </div>
          </div>
          
          <Textarea
            className="min-h-[200px] font-mono text-sm"
            placeholder="Exemplo:
Composição: C. Mixolídio com variação para G Maior
BPM: 120
Instrumentos: Piano, Violão, Baixo, Bateria
Voz: Masculina, estilo pop romântico
Produção: Gravado em estúdio profissional"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>
        
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2">⏳</span> Salvando...
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Salvar Detalhes
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TechnicalDetailsPopup;
