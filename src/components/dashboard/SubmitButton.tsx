
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isSubmitting: boolean;
}

const SubmitButton = ({ isSubmitting }: SubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-6 text-lg" 
      disabled={isSubmitting}
    >
      {isSubmitting ? "Enviando..." : "Enviar Pedido"}
    </Button>
  );
};

export default SubmitButton;
