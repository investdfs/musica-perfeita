
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigateFunction } from "react-router-dom";
import { MusicRequest } from "@/types/database.types";
import { toast } from "@/hooks/use-toast";

interface ActionButtonProps {
  navigate: NavigateFunction;
  musicRequest?: MusicRequest;
}

const ActionButton = ({ navigate, musicRequest }: ActionButtonProps) => {
  const handleNavigation = () => {
    if (!musicRequest) {
      toast({
        title: "Erro",
        description: "Não foi possível obter os detalhes da música",
        variant: "destructive",
      });
      return;
    }
    
    // Armazenar os dados do pedido no localStorage para recuperação em caso de perda durante a navegação
    try {
      localStorage.setItem("current_music_request", JSON.stringify(musicRequest));
      console.log("Navegando para pagamento com dados:", musicRequest);
      
      // Usar navigate com replace para evitar problemas de histórico de navegação
      navigate("/pagamento", { 
        state: { musicRequest },
        replace: true 
      });
    } catch (error) {
      console.error("Erro ao processar navegação:", error);
      toast({
        title: "Erro de navegação",
        description: "Houve um problema ao redirecionar. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center mb-8">
      <Button 
        onClick={handleNavigation} 
        className="group relative bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all text-lg overflow-hidden"
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
