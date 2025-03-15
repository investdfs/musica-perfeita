
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product.types";

interface FormActionsProps {
  onCancel: () => void;
  isLoading: boolean;
  product: Product | null;
}

export const FormActions = ({
  onCancel,
  isLoading,
  product
}: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-3 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        className="bg-purple-600 hover:bg-purple-700"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Salvando...
          </>
        ) : (
          <>
            <Check className="h-4 w-4 mr-2" />
            {product ? "Atualizar Produto" : "Adicionar Produto"}
          </>
        )}
      </Button>
    </div>
  );
};
