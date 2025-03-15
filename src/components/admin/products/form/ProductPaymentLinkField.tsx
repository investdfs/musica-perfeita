
import { Link2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProductPaymentLinkFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
}

export const ProductPaymentLinkField = ({
  value,
  onChange,
  error,
  disabled = false
}: ProductPaymentLinkFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="paymentLink" className="flex items-center">
        <Link2 className="h-4 w-4 mr-2 text-blue-500" />
        Link de Pagamento
      </Label>
      <Input
        id="paymentLink"
        name="paymentLink"
        value={value}
        onChange={onChange}
        className={error ? "border-red-500" : ""}
        placeholder="https://..."
        disabled={disabled}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      <p className="text-sm text-gray-500">
        Este link será usado para redirecionar o cliente para o pagamento.
      </p>
    </div>
  );
};
