
import { ImageIcon, ExternalLink } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProductImageUrlFieldProps {
  value: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const ProductImageUrlField = ({
  value,
  onChange,
  disabled = false
}: ProductImageUrlFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="imageUrl" className="flex items-center">
        <ImageIcon className="h-4 w-4 mr-2 text-indigo-500" />
        Link da Imagem do Produto
      </Label>
      <Input
        id="imageUrl"
        name="imageUrl"
        value={value || ""}
        onChange={onChange}
        className="w-full"
        placeholder="https://exemplo.com/imagem.jpg"
        disabled={disabled}
      />
      {value && (
        <div className="mt-2">
          <p className="text-sm text-gray-500 mb-2">Prévia da imagem:</p>
          <div className="w-24 h-24 border rounded-md overflow-hidden">
            <img 
              src={value} 
              alt="Prévia" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/200x200?text=Erro+na+imagem';
              }}
            />
          </div>
        </div>
      )}
      <p className="text-xs text-gray-500 flex items-center gap-1">
        <ExternalLink className="h-3 w-3" />
        Você pode usar sites como <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Imgur</a> ou 
        <a href="https://postimages.org" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">PostImages</a> para hospedar suas imagens gratuitamente.
      </p>
    </div>
  );
};
