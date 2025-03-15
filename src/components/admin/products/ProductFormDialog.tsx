
import { useState } from "react";
import { Product } from "@/types/product.types";
import ProductForm from "./ProductForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProductFormDialogProps {
  product: Product | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (formData: any) => Promise<boolean>;
  isLoading: boolean;
  children?: React.ReactNode;
}

const ProductFormDialog = ({
  product,
  isOpen,
  onOpenChange,
  onSave,
  isLoading,
  children
}: ProductFormDialogProps) => {
  const handleSave = async (formData: any) => {
    const success = await onSave(formData);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {product ? "Editar Produto" : "Adicionar Novo Produto"}
          </DialogTitle>
        </DialogHeader>
        <ProductForm
          product={product}
          onSave={handleSave}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
