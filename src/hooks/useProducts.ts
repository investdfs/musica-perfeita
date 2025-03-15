
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product.types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActiveProducts();
  }, []);

  const fetchActiveProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Buscando produtos ativos...");
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar produtos:", error);
        setError("Não foi possível carregar os produtos.");
        throw error;
      }

      console.log("Produtos encontrados:", data);

      const mappedProducts = data.map((item): Product => ({
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
      setError("Não foi possível carregar os produtos.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    products,
    isLoading,
    error,
    fetchActiveProducts
  };
}
