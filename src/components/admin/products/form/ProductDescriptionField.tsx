
import { ImageIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProductDescriptionFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  disabled?: boolean;
}

export const ProductDescriptionField = ({
  value,
  onChange,
  error,
  disabled = false
}: ProductDescriptionFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="description" className="flex items-center">
        <ImageIcon className="h-4 w-4 mr-2 text-purple-500" />
        Descrição
      </Label>
      <Textarea
        id="description"
        name="description"
        value={value}
        onChange={onChange}
        className={`min-h-[100px] ${
          error ? "border-red-500" : ""
        }`}
        placeholder="Descreva os detalhes do produto..."
        disabled={disabled}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
