
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigateFunction } from "react-router-dom";
import { MusicRequest } from "@/types/database.types";

interface ActionButtonProps {
  navigate: NavigateFunction;
  musicRequest?: MusicRequest;
  disabled?: boolean;
}

const ActionButton = ({ navigate, musicRequest, disabled = false }: ActionButtonProps) => {
  const handleClick = () => {
    if (musicRequest) {
      console.log("Navegando para pagamento com dados:", musicRequest);
      navigate("/pagamento", { state: { musicRequest } });
    } else {
      console.error("Erro: Tentativa de navegar sem dados do pedido");
    }
  };

  return (
    <div className="flex justify-center mb-8">
      <Button 
        onClick={handleClick} 
        disabled={disabled}
        className={`group relative bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all text-lg overflow-hidden ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <span className="flex items-center relative z-10">
          Liberar Música Completa
          <ChevronRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
        </span>
        <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
      </Button>
    </div>
  );
};

export default ActionButton;
