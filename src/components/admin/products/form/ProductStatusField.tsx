
import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ProductStatusFieldProps {
  value: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const ProductStatusField = ({
  value,
  onChange,
  disabled = false
}: ProductStatusFieldProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="isActive" className="flex items-center cursor-pointer">
          <Check className="h-4 w-4 mr-2 text-green-500" />
          Produto Ativo
        </Label>
        <Switch
          id="isActive"
          checked={value}
          onCheckedChange={onChange}
          disabled={disabled}
        />
      </div>
      <p className="text-sm text-gray-500">
        {value
          ? "O produto está visível e disponível para compra."
          : "O produto está oculto e não aparecerá para os clientes."}
      </p>
    </div>
  );
};
