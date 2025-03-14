
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigateFunction } from "react-router-dom";
import { MusicRequest } from "@/types/database.types";
import { toast } from "@/hooks/use-toast";
import { validateMusicRequest } from "@/utils/validationUtils";

interface ActionButtonProps {
  navigate: NavigateFunction;
  musicRequest?: MusicRequest | null;
}

const ActionButton = ({ navigate, musicRequest }: ActionButtonProps) => {
  const handleNavigation = () => {
    // Verificar se temos um ID de pedido pelo menos, mesmo sem dados completos
    if (!musicRequest?.id) {
      console.log("Navegando para pagamento sem dados do pedido");
      
      // Permitir navegação mesmo sem os dados completos do pedido
      navigate("/pagamento", { replace: true });
      return;
    }
    
    try {
      // Se tivermos os dados do pedido, vamos usá-los
      console.log("Navegando para pagamento com dados:", musicRequest);
      
      // Validar os tipos enumerados se possível
      let validatedRequest;
      try {
        validatedRequest = validateMusicRequest(musicRequest);
      } catch (error) {
        console.error("Erro na validação do pedido, prosseguindo com dados parciais:", error);
        validatedRequest = musicRequest;
      }
      
      // Armazenar os dados do pedido no localStorage para recuperação
      try {
        localStorage.setItem("current_music_request", JSON.stringify(validatedRequest));
      } catch (error) {
        console.error("Erro ao salvar no localStorage:", error);
      }
      
      // Usar navigate com replace para evitar problemas de histórico de navegação
      navigate("/pagamento", { 
        state: { musicRequest: validatedRequest },
        replace: true 
      });
    } catch (error) {
      console.error("Erro ao processar navegação:", error);
      toast({
        title: "Aviso",
        description: "Prosseguindo para a página de pagamento.",
        variant: "default",
      });
      
      // Mesmo com erro, permitir a navegação para a página de pagamento
      navigate("/pagamento", { replace: true });
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
