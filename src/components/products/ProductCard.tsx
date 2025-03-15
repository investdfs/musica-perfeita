
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product.types";

interface ProductCardProps {
  product: Product;
  onSelect: (paymentLink: string) => void;
}

const ProductCard = ({ product, onSelect }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow overflow-hidden border border-gray-100 flex flex-col">
      {product.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h3>
        
        <div className="mb-4 text-purple-600 font-bold text-3xl">
          {new Intl.NumberFormat('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
          }).format(product.price)}
        </div>
        
        <p className="text-gray-600 mb-6 flex-grow">{product.description}</p>
        
        <Button
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
          onClick={() => onSelect(product.paymentLink)}
        >
          Escolher este plano
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
