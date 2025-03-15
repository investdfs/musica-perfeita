
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductFormData, ProductDatabaseMapping } from "@/types/product.types";

export function useProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const handleSaveProduct = async (productData: ProductFormData, currentProduct: Product | null) => {
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

      fetchProducts();
      return true;
    } catch (error: any) {
      console.error("Erro ao salvar produto:", error);
      toast({
        title: "Erro ao salvar produto",
        description: error.message || "Não foi possível salvar as alterações do produto.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      fetchProducts();
      return true;
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      toast({
        title: "Erro ao excluir produto",
        description: "Não foi possível excluir o produto.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field: keyof Product) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [sortField, sortDirection]);

  return {
    products,
    isLoading,
    sortField,
    sortDirection,
    handleSaveProduct,
    handleDeleteProduct,
    handleSort,
    fetchProducts
  };
}
