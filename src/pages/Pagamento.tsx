
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Pagamento = () => {
  const { products, isLoading, error } = useProducts();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast({
        title: "Erro ao carregar produtos",
        description: error,
        variant: "destructive"
      });
    }
  }, [error]);

  const handleSelectProduct = (paymentLink: string) => {
    if (!paymentLink || paymentLink.trim() === "") {
      toast({
        title: "Link indisponível",
        description: "Este produto não possui um link de pagamento configurado.",
        variant: "destructive"
      });
      return;
    }
    
    window.open(paymentLink, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Escolha seu Plano
          </h1>
          
          <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Selecione o plano ideal para sua música personalizada e comece a criar lembranças musicais inesquecíveis.
          </p>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
              <span className="ml-3 text-lg text-gray-600">Carregando opções...</span>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">Ocorreu um erro ao carregar os produtos.</p>
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
              >
                Voltar
              </Button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-gray-600 mb-4">Nenhum produto disponível no momento.</p>
              <Button 
                variant="outline" 
                onClick={() => navigate("/dashboard")}
              >
                Voltar para o Dashboard
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              {products.map((product) => (
                <div 
                  key={product.id}
                  className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow overflow-hidden border border-gray-100 flex flex-col"
                >
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
                      onClick={() => handleSelectProduct(product.paymentLink)}
                    >
                      Escolher este plano
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pagamento;
