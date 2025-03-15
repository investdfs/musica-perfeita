
import { Product, ProductFormData } from "@/types/product.types";
import { useProductForm } from "./form/useProductForm";
import { ProductNameField } from "./form/ProductNameField";
import { ProductDescriptionField } from "./form/ProductDescriptionField";
import { ProductPriceField } from "./form/ProductPriceField";
import { ProductPaymentLinkField } from "./form/ProductPaymentLinkField";
import { ProductImageUrlField } from "./form/ProductImageUrlField";
import { ProductStatusField } from "./form/ProductStatusField";
import { FormActions } from "./form/FormActions";

interface ProductFormProps {
  product: Product | null;
  onSave: (productData: ProductFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const ProductForm = ({ product, onSave, onCancel, isLoading }: ProductFormProps) => {
  const {
    formData,
    formErrors,
    handleChange,
    handleSwitchChange,
    handleSubmit,
    formatPrice
  } = useProductForm(product, onSave);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      {/* Nome do produto */}
      <ProductNameField
        value={formData.name}
        onChange={handleChange}
        error={formErrors.name}
        disabled={isLoading}
      />

      {/* Descrição */}
      <ProductDescriptionField
        value={formData.description}
        onChange={handleChange}
        error={formErrors.description}
        disabled={isLoading}
      />

      {/* Preço */}
      <ProductPriceField
        value={formData.price}
        onChange={handleChange}
        error={formErrors.price}
        formatPrice={formatPrice}
        disabled={isLoading}
      />

      {/* Link de pagamento */}
      <ProductPaymentLinkField
        value={formData.paymentLink}
        onChange={handleChange}
        error={formErrors.paymentLink}
        disabled={isLoading}
      />

      {/* Link da imagem */}
      <ProductImageUrlField
        value={formData.imageUrl}
        onChange={handleChange}
        disabled={isLoading}
      />

      {/* Status do produto */}
      <ProductStatusField
        value={formData.isActive}
        onChange={handleSwitchChange}
        disabled={isLoading}
      />

      {/* Botões de ação */}
      <FormActions
        onCancel={onCancel}
        isLoading={isLoading}
        product={product}
      />
    </form>
  );
};

export default ProductForm;
