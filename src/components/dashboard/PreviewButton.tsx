
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MusicRequest } from "@/types/database.types";

interface PreviewButtonProps {
  hasCompletedRequest: boolean;
  hasPaidRequest: boolean;
  latestRequest?: MusicRequest;
}

const PreviewButton = ({ hasCompletedRequest, hasPaidRequest, latestRequest }: PreviewButtonProps) => {
  const navigate = useNavigate();

  if (!(hasCompletedRequest && !hasPaidRequest)) return null;

  return (
    <div className="text-center mb-8">
      <Button 
        onClick={() => navigate("/music-preview", { 
          state: { musicRequest: latestRequest } 
        })}
        className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-all"
      >
        <Eye className="mr-2 h-5 w-5" />
        Ver meu Pedido
      </Button>
    </div>
  );
};

export default PreviewButton;
