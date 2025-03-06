
import { Music } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MusicRequest } from "@/types/database.types";

interface MusicAccessButtonProps {
  hasCompletedRequest: boolean;
  hasPaidRequest: boolean;
  latestRequest?: MusicRequest;
}

const MusicAccessButton = ({ hasCompletedRequest, hasPaidRequest, latestRequest }: MusicAccessButtonProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8 mt-4 text-center border border-blue-100 transition-all hover:shadow-xl">
      <h2 className="text-xl font-semibold mb-4 text-purple-700">Acesso à sua música</h2>
      
      <Button 
        disabled={!(hasCompletedRequest && hasPaidRequest)}
        onClick={() => navigate("/confirmacao", { state: { musicRequest: latestRequest } })}
        className={`px-6 py-3 rounded-lg shadow-md transition-all text-lg w-full max-w-md ${
          hasCompletedRequest && hasPaidRequest 
            ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white" 
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
      >
        <Music className="mr-2 h-5 w-5" />
        ACESSAR MINHA MÚSICA PERSONALIZADA
      </Button>
      
      <p className="mt-3 text-gray-500 text-sm">
        {hasCompletedRequest && hasPaidRequest 
          ? "Sua música está pronta para acesso." 
          : "Este botão será liberado quando sua música estiver pronta."}
      </p>
    </div>
  );
};

export default MusicAccessButton;
