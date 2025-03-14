
import { MusicRequest } from "@/types/database.types";
import { FileText, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

interface TechnicalDetailsViewerProps {
  request: MusicRequest;
  variant?: "inline" | "card" | "modal" | "dialog";
  className?: string;
}

const TechnicalDetailsViewer = ({ 
  request, 
  variant = "inline",
  className = ""
}: TechnicalDetailsViewerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Se não houver detalhes técnicos, não renderizar nada
  if (!request.has_technical_details || !request.technical_details) {
    return null;
  }
  
  // Formatar os detalhes técnicos para exibição, preservando quebras de linha
  const formattedDetails = request.technical_details
    .split('\n')
    .map((line, index) => (
      <p key={index} className={index > 0 ? "mt-1" : ""}>
        {line}
      </p>
    ));
    
  if (variant === "inline") {
    return (
      <div className={`border border-purple-200 rounded-md overflow-hidden ${className}`}>
        <div 
          className="flex items-center justify-between p-3 bg-purple-50 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center text-purple-800">
            <FileText className="w-4 h-4 mr-2" />
            <span className="font-medium">Detalhes Técnicos da Música</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-purple-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-purple-600" />
          )}
        </div>
        
        {isExpanded && (
          <div className="p-3 text-sm bg-white text-gray-700">
            {formattedDetails}
          </div>
        )}
      </div>
    );
  }
  
  if (variant === "card") {
    return (
      <div className={`border border-purple-200 rounded-md overflow-hidden shadow-sm ${className}`}>
        <div className="p-3 bg-purple-50 border-b border-purple-200">
          <div className="flex items-center text-purple-800">
            <FileText className="w-4 h-4 mr-2" />
            <span className="font-medium">Detalhes Técnicos da Música</span>
          </div>
        </div>
        <div className="p-4 text-sm bg-white text-gray-700">
          {formattedDetails}
        </div>
      </div>
    );
  }
  
  if (variant === "dialog") {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsDialogOpen(true)}
          className={`flex items-center gap-1 text-purple-700 border-purple-200 hover:bg-purple-50 ${className}`}
        >
          <FileText className="w-4 h-4" />
          <span>Ver Detalhes Técnicos</span>
        </Button>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Detalhes Técnicos da Música
              </DialogTitle>
            </DialogHeader>
            <div className="p-4 text-sm bg-white text-gray-700 border border-purple-100 rounded-md">
              {formattedDetails}
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }
  
  // Modal variant - botão que abre um modal
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setIsDialogOpen(true)}
      className={`flex items-center gap-1 text-purple-700 border-purple-200 hover:bg-purple-50 ${className}`}
    >
      <FileText className="w-4 h-4" />
      <span>Ver Detalhes Técnicos</span>
    </Button>
  );
};

export default TechnicalDetailsViewer;
