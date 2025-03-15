
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Product, ProductFormData } from "@/types/product.types";

export function useProductForm(product: Product | null, onSave: (productData: ProductFormData) => void) {
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

  return {
    formData,
    formErrors,
    handleChange,
    handleSwitchChange,
    handleSubmit,
    formatPrice
  };
}
