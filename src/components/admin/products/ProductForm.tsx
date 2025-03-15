
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
  Upload, 
  Loader2,
  Check
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
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
      setImagePreview(product.imageUrl);
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

  // Manipular upload de imagem
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione uma imagem.",
        variant: "destructive",
      });
      return;
    }

    // Verificar tamanho do arquivo (limite de 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload para o Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data, error } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from("images")
        .getPublicUrl(data.path);

      setFormData({
        ...formData,
        imageUrl: publicUrl,
      });

      toast({
        title: "Imagem enviada",
        description: "A imagem foi enviada com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      toast({
        title: "Erro ao enviar imagem",
        description: "Não foi possível fazer o upload da imagem.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
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

      {/* Upload de imagem */}
      <div className="space-y-2">
        <Label className="flex items-center">
          <ImageIcon className="h-4 w-4 mr-2 text-indigo-500" />
          Imagem do Produto
        </Label>
        <div className="flex items-center gap-4">
          <div
            className={`h-24 w-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden ${
              imagePreview ? "border-solid border-purple-300" : ""
            }`}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageIcon className="h-8 w-8 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <div className="relative">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isLoading || isUploading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("image")?.click()}
                disabled={isLoading || isUploading}
                className="w-full justify-start"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                {isUploading
                  ? "Enviando..."
                  : imagePreview
                  ? "Alterar imagem"
                  : "Fazer upload de imagem"}
              </Button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Formatos aceitos: JPG, PNG. Tamanho máximo: 5MB
            </p>
          </div>
        </div>
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
          disabled={isLoading || isUploading}
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
