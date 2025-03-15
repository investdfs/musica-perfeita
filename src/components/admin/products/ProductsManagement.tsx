import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Plus, Pencil, Trash2, Package, DollarSign, 
  Link, ImageIcon, Check, X, ArrowUpDown
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductFormData, ProductDatabaseMapping } from "@/types/product.types";
import ProductForm from "./ProductForm";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

export const ProductsManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [sortField, setSortField] = useState<keyof Product>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order(sortField === "createdAt" ? "created_at" : 
               sortField === "updatedAt" ? "updated_at" : 
               sortField === "imageUrl" ? "image_url" : 
               sortField === "paymentLink" ? "payment_link" : 
               sortField === "isActive" ? "is_active" : 
               sortField, 
               { ascending: sortDirection === "asc" });

      if (error) {
        console.error("Erro ao buscar produtos:", error);
        throw error;
      }

      const mappedProducts = data.map((item: ProductDatabaseMapping): Product => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.image_url,
        paymentLink: item.payment_link,
        isActive: item.is_active,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));

      setProducts(mappedProducts);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      toast({
        title: "Erro ao carregar produtos",
        description: "Não foi possível carregar a lista de produtos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [sortField, sortDirection]);

  const handleSaveProduct = async (productData: ProductFormData) => {
    try {
      setIsLoading(true);
      console.log("Dados do formulário:", productData);

      const dbData = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        image_url: productData.imageUrl,
        payment_link: productData.paymentLink,
        is_active: productData.isActive,
      };

      console.log("Dados formatados para o banco:", dbData);

      if (currentProduct) {
        const { data, error } = await supabase
          .from("products")
          .update({
            ...dbData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentProduct.id)
          .select();

        if (error) {
          console.error("Erro ao atualizar produto:", error);
          throw error;
        }

        console.log("Resposta da atualização:", data);

        toast({
          title: "Produto atualizado",
          description: `O produto "${productData.name}" foi atualizado com sucesso.`,
        });
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert({
            ...dbData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select();

        if (error) {
          console.error("Erro ao inserir produto:", error);
          throw error;
        }

        console.log("Resposta da inserção:", data);

        toast({
          title: "Produto adicionado",
          description: `O produto "${productData.name}" foi adicionado com sucesso.`,
        });
      }

      setIsProductFormOpen(false);
      setCurrentProduct(null);
      fetchProducts();
    } catch (error: any) {
      console.error("Erro ao salvar produto:", error);
      toast({
        title: "Erro ao salvar produto",
        description: error.message || "Não foi possível salvar as alterações do produto.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      if (!productToDelete) return;

      setIsLoading(true);
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productToDelete.id);

      if (error) throw error;

      toast({
        title: "Produto excluído",
        description: `O produto "${productToDelete.name}" foi excluído com sucesso.`,
      });

      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      toast({
        title: "Erro ao excluir produto",
        description: "Não foi possível excluir o produto.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsProductFormOpen(true);
  };

  const handleConfirmDelete = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleSort = (field: keyof Product) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold flex items-center gap-2 text-gray-800">
            <Package className="h-5 w-5 text-purple-600" />
            Gerenciamento de Produtos
          </CardTitle>
          <Dialog open={isProductFormOpen} onOpenChange={setIsProductFormOpen}>
            <DialogTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => setCurrentProduct(null)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {currentProduct ? "Editar Produto" : "Adicionar Novo Produto"}
                </DialogTitle>
              </DialogHeader>
              <ProductForm
                product={currentProduct}
                onSave={handleSaveProduct}
                onCancel={() => {
                  setIsProductFormOpen(false);
                  setCurrentProduct(null);
                }}
                isLoading={isLoading}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead
                  className="w-[300px] cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Produto
                    {sortField === "name" && (
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("price")}
                >
                  <div className="flex items-center">
                    Preço
                    {sortField === "price" && (
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center">
                    Criado em
                    {sortField === "createdAt" && (
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <div className="flex flex-col items-center gap-3">
                      <Package className="h-10 w-10 text-gray-300" />
                      <p className="text-gray-500">
                        Nenhum produto cadastrado ainda
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsProductFormOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar primeiro produto
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-purple-100 flex items-center justify-center overflow-hidden">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = 'https://placehold.co/100x100?text=Imagem+não+disponível';
                              }}
                            />
                          ) : (
                            <Package className="h-5 w-5 text-purple-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500 truncate max-w-[250px]">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                        {formatCurrency(product.price)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.isActive ? (
                        <div className="flex items-center text-green-600">
                          <Check className="h-4 w-4 mr-1" />
                          Ativo
                        </div>
                      ) : (
                        <div className="flex items-center text-red-500">
                          <X className="h-4 w-4 mr-1" />
                          Inativo
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(product.createdAt).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleConfirmDelete(product)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteProduct}
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
