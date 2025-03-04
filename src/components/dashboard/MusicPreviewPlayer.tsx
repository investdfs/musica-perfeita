
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface MusicPreviewPlayerProps {
  previewUrl: string;
}

const MusicPreviewPlayer = ({ previewUrl }: MusicPreviewPlayerProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Ouça 1/3 da sua música!</h2>
      <audio controls className="w-full mb-4">
        <source src={previewUrl} type="audio/mpeg" />
        Seu navegador não suporta áudio HTML5.
      </audio>
      <p className="mb-4">Gostou? Finalize o pagamento para receber a versão completa!</p>
      <Button 
        className="w-full bg-pink-500 hover:bg-pink-600" 
        onClick={() => navigate("/pagamento")}
      >
        Pagar Agora
      </Button>
    </div>
  );
};

export default MusicPreviewPlayer;
