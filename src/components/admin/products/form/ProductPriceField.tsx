
import { DollarSign } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProductPriceFieldProps {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  formatPrice: (value: number) => string;
  disabled?: boolean;
}

export const ProductPriceField = ({
  value,
  onChange,
  error,
  formatPrice,
  disabled = false
}: ProductPriceFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="price" className="flex items-center">
        <DollarSign className="h-4 w-4 mr-2 text-green-500" />
        Preço (R$)
      </Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          R$
        </span>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={value}
          onChange={onChange}
          className={`pl-10 ${error ? "border-red-500" : ""}`}
          placeholder="0,00"
          disabled={disabled}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      <p className="text-sm text-gray-500">
        Valor formatado: {formatPrice(value)}
      </p>
    </div>
  );
};
