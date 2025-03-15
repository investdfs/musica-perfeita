
import { Check, Star, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product.types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  isSelected: boolean;
}

export const ProductCard = ({ product, onSelect, isSelected }: ProductCardProps) => {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(product.price));

  return (
    <Card 
      className={`w-full transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ${
        isSelected 
          ? "border-2 border-purple-500 shadow-lg shadow-purple-500/20" 
          : "border border-gray-200 hover:shadow-md"
      }`}
    >
      <div className="relative">
        {product.imageUrl ? (
          <div className="w-full aspect-video overflow-hidden bg-gray-50">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full aspect-video bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
            <Star className="h-16 w-16 text-purple-300" />
          </div>
        )}
        
        {isSelected && (
          <div className="absolute top-2 right-2 bg-purple-600 text-white p-1 rounded-full">
            <Check className="h-4 w-4" />
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-center font-bold text-gray-800">{product.name}</CardTitle>
        <CardDescription className="text-center">
          <span className="text-2xl font-bold text-purple-600">{formattedPrice}</span>
          <span className="text-gray-500 text-sm"> (pagamento único)</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-700 text-sm">{product.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-start">
            <div className="bg-green-100 p-1 rounded-full mr-2 mt-1 flex-shrink-0">
              <Check className="h-3 w-3 text-green-600" />
            </div>
            <p className="text-xs text-gray-600">
              Download em alta qualidade
            </p>
          </div>
          <div className="flex items-start">
            <div className="bg-green-100 p-1 rounded-full mr-2 mt-1 flex-shrink-0">
              <Check className="h-3 w-3 text-green-600" />
            </div>
            <p className="text-xs text-gray-600">
              Entrega rápida após pagamento
            </p>
          </div>
          <div className="flex items-start">
            <Shield className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-600">
              Satisfação garantida ou seu dinheiro de volta
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => onSelect(product)} 
          className={`w-full ${
            isSelected 
              ? "bg-purple-700 hover:bg-purple-800" 
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {isSelected ? "Selecionado" : "Selecionar"}
        </Button>
      </CardFooter>
    </Card>
  );
};
