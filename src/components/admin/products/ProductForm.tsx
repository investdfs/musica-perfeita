
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Package, 
  DollarSign, 
  Link2, 
  ImageIcon, 
  Loader2,
  Check,
  ExternalLink
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Product, ProductFormData } from "@/types/product.types";

interface ProductFormProps {
  product: Product | null;
  onSave: (productData: ProductFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const ProductForm = ({ product, onSave, onCancel, isLoading }: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    imageUrl: null,
    paymentLink: "",
    isActive: true,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Inicializar formulário com dados do produto se estiver editando
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        paymentLink: product.paymentLink,
        isActive: product.isActive,
      });
    }
  }, [product]);

  // Manipular mudanças nos campos
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "price") {
      // Remove caracteres não numéricos e converte para número
      const formattedValue = value.replace(/[^0-9.]/g, "");
      setFormData({
        ...formData,
        [name]: parseFloat(formattedValue) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Limpar erro quando o campo é editado
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  // Manipular alterações no switch de ativo/inativo
  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      isActive: checked,
    });
  };

  // Validação do formulário
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "O nome do produto é obrigatório";
    }

    if (!formData.description.trim()) {
      errors.description = "A descrição do produto é obrigatória";
    }

    if (formData.price <= 0) {
      errors.price = "O preço deve ser maior que zero";
    }

    if (!formData.paymentLink.trim()) {
      errors.paymentLink = "O link de pagamento é obrigatório";
    } else if (
      !formData.paymentLink.startsWith("http://") &&
      !formData.paymentLink.startsWith("https://")
    ) {
      errors.paymentLink = "O link deve começar com http:// ou https://";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submeter formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Erro no formulário",
        description: "Por favor, corrija os erros antes de salvar.",
        variant: "destructive",
      });
      return;
    }

    onSave(formData);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      {/* Nome do produto */}
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center">
          <Package className="h-4 w-4 mr-2 text-purple-500" />
          Nome do Produto
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={formErrors.name ? "border-red-500" : ""}
          placeholder="Ex: Música Personalizada Premium"
          disabled={isLoading}
        />
        {formErrors.name && (
          <p className="text-sm text-red-500">{formErrors.name}</p>
        )}
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <Label htmlFor="description" className="flex items-center">
          <ImageIcon className="h-4 w-4 mr-2 text-purple-500" />
          Descrição
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`min-h-[100px] ${
            formErrors.description ? "border-red-500" : ""
          }`}
          placeholder="Descreva os detalhes do produto..."
          disabled={isLoading}
        />
        {formErrors.description && (
          <p className="text-sm text-red-500">{formErrors.description}</p>
        )}
      </div>

      {/* Preço */}
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
            value={formData.price}
            onChange={handleChange}
            className={`pl-10 ${formErrors.price ? "border-red-500" : ""}`}
            placeholder="0,00"
            disabled={isLoading}
          />
        </div>
        {formErrors.price && (
          <p className="text-sm text-red-500">{formErrors.price}</p>
        )}
        <p className="text-sm text-gray-500">
          Valor formatado: {formatPrice(formData.price)}
        </p>
      </div>

      {/* Link de pagamento */}
      <div className="space-y-2">
        <Label htmlFor="paymentLink" className="flex items-center">
          <Link2 className="h-4 w-4 mr-2 text-blue-500" />
          Link de Pagamento
        </Label>
        <Input
          id="paymentLink"
          name="paymentLink"
          value={formData.paymentLink}
          onChange={handleChange}
          className={formErrors.paymentLink ? "border-red-500" : ""}
          placeholder="https://..."
          disabled={isLoading}
        />
        {formErrors.paymentLink && (
          <p className="text-sm text-red-500">{formErrors.paymentLink}</p>
        )}
        <p className="text-sm text-gray-500">
          Este link será usado para redirecionar o cliente para o pagamento.
        </p>
      </div>

      {/* Link da imagem */}
      <div className="space-y-2">
        <Label htmlFor="imageUrl" className="flex items-center">
          <ImageIcon className="h-4 w-4 mr-2 text-indigo-500" />
          Link da Imagem do Produto
        </Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl || ""}
          onChange={handleChange}
          className="w-full"
          placeholder="https://exemplo.com/imagem.jpg"
          disabled={isLoading}
        />
        {formData.imageUrl && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-2">Prévia da imagem:</p>
            <div className="w-24 h-24 border rounded-md overflow-hidden">
              <img 
                src={formData.imageUrl} 
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

      {/* Status do produto */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="isActive" className="flex items-center cursor-pointer">
            <Check className="h-4 w-4 mr-2 text-green-500" />
            Produto Ativo
          </Label>
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={handleSwitchChange}
            disabled={isLoading}
          />
        </div>
        <p className="text-sm text-gray-500">
          {formData.isActive
            ? "O produto está visível e disponível para compra."
            : "O produto está oculto e não aparecerá para os clientes."}
        </p>
      </div>

      {/* Botões de ação */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              {product ? "Atualizar Produto" : "Adicionar Produto"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
