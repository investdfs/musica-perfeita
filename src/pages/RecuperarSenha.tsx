
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const RecuperarSenha = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulando o envio de e-mail de recuperação
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: "E-mail enviado",
        description: "As instruções de recuperação foram enviadas para seu e-mail.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <Link to="/login" className="text-purple-600 hover:text-purple-800 flex items-center mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar para login
          </Link>
          
          <h1 className="text-2xl font-bold text-center mb-6">Recuperação de Senha</h1>
          
          {!isSubmitted ? (
            <>
              <p className="text-gray-600 mb-6 text-center">
                Informe seu e-mail abaixo e enviaremos instruções para redefinir sua senha.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    E-mail
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@email.com"
                    required
                    className="w-full"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting || !email}
                >
                  {isSubmitting ? "Enviando..." : "Enviar instruções"}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-green-50 text-green-800 p-4 rounded-md">
                <p className="font-medium">E-mail enviado com sucesso!</p>
                <p className="text-sm mt-2">
                  Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                </p>
              </div>
              
              <p className="text-gray-600 text-sm">
                Não recebeu o e-mail? Verifique sua pasta de spam ou 
                <button 
                  onClick={() => setIsSubmitted(false)} 
                  className="text-purple-600 hover:text-purple-800 ml-1"
                >
                  tente novamente
                </button>.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RecuperarSenha;
