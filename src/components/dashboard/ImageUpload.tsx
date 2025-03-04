
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, ImageIcon, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageSelected: (file: File) => void;
}

const ImageUpload = ({ onImageSelected }: ImageUploadProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      onImageSelected(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg border border-pink-100 shadow-sm mb-6">
      <h3 className="text-lg font-medium mb-3 text-pink-700">Imagem de Capa</h3>
      <p className="text-sm text-gray-600 mb-4">
        Escolha uma foto nítida e marcante para a capa da sua música. 
        Preferencialmente em formato quadrado (1:1) ou que possa ser cortada nesse formato.
      </p>
      
      <div className="flex flex-col items-center">
        <div 
          className={cn(
            "w-full h-48 md:h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all",
            previewUrl 
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
              <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                <CheckCircle size={16} />
              </div>
            </div>
          ) : (
            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
              <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-pink-500 mb-2" />
                <p className="text-sm font-medium text-pink-700">Clique para selecionar</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP até 5MB</p>
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
        
        {previewUrl && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3 text-xs text-gray-600"
            onClick={() => {
              setSelectedImage(null);
              setPreviewUrl(null);
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
