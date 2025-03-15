
import { Package } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProductNameFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
}

export const ProductNameField = ({ 
  value, 
  onChange, 
  error, 
  disabled = false 
}: ProductNameFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="name" className="flex items-center">
        <Package className="h-4 w-4 mr-2 text-purple-500" />
        Nome do Produto
      </Label>
      <Input
        id="name"
        name="name"
        value={value}
        onChange={onChange}
        className={error ? "border-red-500" : ""}
        placeholder="Ex: Música Personalizada Premium"
        disabled={disabled}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
