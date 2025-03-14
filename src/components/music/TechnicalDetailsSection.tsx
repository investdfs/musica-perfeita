
import { FileText } from "lucide-react";
import { MusicRequest } from "@/types/database.types";
import TechnicalDetailsViewer from "@/components/music/TechnicalDetailsViewer";

interface TechnicalDetailsSectionProps {
  requestData: MusicRequest | null;
}

const TechnicalDetailsSection = ({ requestData }: TechnicalDetailsSectionProps) => {
  if (!requestData?.has_technical_details) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="h-5 w-5 text-purple-400 mr-2" />
          <span className="text-purple-200 font-medium">Detalhes técnicos disponíveis para esta música</span>
        </div>
        {requestData && (
          <TechnicalDetailsViewer 
            request={requestData} 
            variant="dialog" 
            className="text-purple-200 border-purple-400/50 hover:bg-purple-800/30"
          />
        )}
      </div>
    </div>
  );
};

export default TechnicalDetailsSection;
