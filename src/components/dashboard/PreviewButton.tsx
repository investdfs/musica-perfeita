
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { MusicRequest } from "@/types/database.types";

interface PreviewButtonProps {
  musicRequest: MusicRequest;
}

const PreviewButton = ({ musicRequest }: PreviewButtonProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center mb-8">
      <Button 
        onClick={() => navigate("/music-preview", { 
          state: { musicRequest } 
        })}
        className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-all"
      >
        <Eye className="mr-2 h-5 w-5 inline-block" />
        Ver meu Pedido
      </Button>
    </div>
  );
};

export default PreviewButton;
