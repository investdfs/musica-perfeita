
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MusicRequest } from "@/types/database.types";

interface TechnicalDetailsViewerProps {
  request: MusicRequest;
  variant?: 'inline' | 'dialog';
  className?: string;
}

const TechnicalDetailsViewer = ({ 
  request, 
  variant = 'inline',
  className
}: TechnicalDetailsViewerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!request.technical_details) {
    return null;
  }
  
  const formattedDetails = request.technical_details
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');

  const renderDetailsContent = () => {
    return (
      <div 
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: formattedDetails }}
      />
    );
  };
  
  if (variant === 'dialog') {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className={cn("flex items-center gap-1", className)}
          >
            <InfoIcon className="h-4 w-4" />
            Sobre a música
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <FileText className="h-5 w-5" />
              Sobre a música
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {renderDetailsContent()}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-blue-900 flex items-center">
          <FileText className="h-4 w-4 mr-2 text-blue-700" />
          Sobre a música
        </h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-blue-700 h-8">
              <InfoIcon className="h-4 w-4 mr-1" />
              Ver detalhes
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                <FileText className="h-5 w-5" />
                Sobre a música
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {renderDetailsContent()}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="line-clamp-2 text-sm text-blue-700">
        <div dangerouslySetInnerHTML={{ 
          __html: formattedDetails.substring(0, 200) + (formattedDetails.length > 200 ? '...' : '') 
        }} />
      </div>
    </div>
  );
};

export default TechnicalDetailsViewer;
