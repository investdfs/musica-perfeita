
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
}

const SubmitButton = ({ isSubmitting }: SubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-6 text-lg font-bold shadow-lg transition-all duration-300"
      disabled={isSubmitting}
      onClick={(e) => {
        // Prevenção dupla para garantir que o formulário seja submetido
        if (isSubmitting) {
          e.preventDefault();
          return;
        }
        console.log("Botão de envio clicado");
      }}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Enviando...
        </>
      ) : (
        "Enviar Pedido"
      )}
    </Button>
  );
};

export default SubmitButton;
