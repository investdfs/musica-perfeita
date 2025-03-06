
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, ImageIcon, CheckCircle, AlertCircle, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageSelected: (file: File) => void;
}

const ImageUpload = ({ onImageSelected }: ImageUploadProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isNonSquare, setIsNonSquare] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Check if image is square
          const aspectRatio = img.width / img.height;
          setIsNonSquare(Math.abs(aspectRatio - 1) > 0.1);
          
          setSelectedImage(file);
          onImageSelected(file);
          setPreviewUrl(URL.createObjectURL(file));
        };
        img.src = event.target?.result as string;
      };
      
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-pink-50 p-6 rounded-lg border border-pink-100 shadow-sm mb-6">
      <h3 className="text-lg font-medium mb-3 text-pink-600">Imagem de Capa</h3>
      <p className="text-sm text-gray-600 mb-2">
        <span className="font-semibold">IMPORTANTE:</span> A imagem deve ser quadrada (1:1) para melhor 
        visualização. Imagens retangulares podem ficar cortadas ou distorcidas.
      </p>
      
      <div className="flex justify-center mb-3">
        <a 
          href="https://www.iloveimg.com/crop-image" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-medium text-pink-600 hover:text-pink-800 transition-colors"
        >
          <Scissors size={16} className="mr-1" />
          Corte sua imagem gratuitamente aqui
        </a>
      </div>
      
      <div className="flex flex-col items-center">
        <div 
          className={cn(
            "w-full max-w-sm mx-auto aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all",
            isNonSquare 
              ? "border-amber-400 bg-amber-50" 
              : previewUrl 
                ? "border-green-400 bg-green-50" 
                : "border-pink-300 bg-pink-50 hover:bg-pink-100"
          )}
        >
          {previewUrl ? (
            <div className="relative w-full h-full overflow-hidden rounded-lg">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
              <div className={cn(
                "absolute top-2 right-2 text-white p-1 rounded-full",
                isNonSquare ? "bg-amber-500" : "bg-green-500"
              )}>
                {isNonSquare ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
              </div>
            </div>
          ) : (
            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
              <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-pink-500 mb-2" />
                <p className="text-sm font-medium text-pink-700">Clique para selecionar</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP até 5MB</p>
                <p className="text-xs font-medium text-pink-600 mt-1">Imagem quadrada (1:1) recomendada</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>
        
        {isNonSquare && previewUrl && (
          <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-700">
            <div className="flex items-center gap-1">
              <AlertCircle size={14} />
              <span className="font-medium">Atenção:</span>
            </div>
            <p className="mt-1">Esta imagem não é quadrada e pode ser cortada ou distorcida. Recomendamos enviar uma imagem quadrada.</p>
          </div>
        )}
        
        {previewUrl && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3 text-xs text-gray-600"
            onClick={() => {
              setSelectedImage(null);
              setPreviewUrl(null);
              setIsNonSquare(false);
            }}
          >
            Remover imagem
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
