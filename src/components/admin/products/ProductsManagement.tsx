
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/types/product.types";
import { useProductsManagement } from "./hooks/useProductsManagement";
import ProductsTable from "./ProductsTable";
import ProductFormDialog from "./ProductFormDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

export const ProductsManagement = () => {
  const {
    products,
    isLoading,
    sortField,
    sortDirection,
    handleSaveProduct,
    handleDeleteProduct,
    handleSort
  } = useProductsManagement();

  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsProductFormOpen(true);
  };

  const handleConfirmDelete = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveFormData = async (formData: any) => {
    return await handleSaveProduct(formData, currentProduct);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return false;
    
    const success = await handleDeleteProduct(productToDelete.id);
    if (success) {
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
    return success;
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-gray-800">
            <Package className="h-5 w-5 text-purple-600" />
            Gerenciamento de Produtos
          </CardTitle>
          <ProductFormDialog
            product={null}
            isOpen={isProductFormOpen && currentProduct === null}
            onOpenChange={(open) => {
              setIsProductFormOpen(open);
              if (!open) setCurrentProduct(null);
            }}
            onSave={handleSaveFormData}
            isLoading={isLoading}
          >
            <Button
              variant="default"
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => {
                setCurrentProduct(null);
                setIsProductFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Button>
          </ProductFormDialog>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ProductsTable
          products={products}
          isLoading={isLoading}
          sortField={sortField}
          onSort={handleSort}
          onEdit={handleEditProduct}
          onDelete={handleConfirmDelete}
          onAddProduct={() => setIsProductFormOpen(true)}
        />
      </CardContent>

      {/* Diálogo para editar produto */}
      <ProductFormDialog
        product={currentProduct}
        isOpen={isProductFormOpen && currentProduct !== null}
        onOpenChange={(open) => {
          setIsProductFormOpen(open);
          if (!open) setCurrentProduct(null);
        }}
        onSave={handleSaveFormData}
        isLoading={isLoading}
      />

      {/* Diálogo de confirmação de exclusão */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Excluir Produto"
        description={
          productToDelete
            ? `Tem certeza que deseja excluir o produto "${productToDelete.name}"? Esta ação não pode ser desfeita.`
            : "Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
        }
        isLoading={isLoading}
      />
    </Card>
  );
};

export default ProductsManagement;
