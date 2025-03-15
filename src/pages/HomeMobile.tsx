
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";

const HomeMobile = () => {
  useEffect(() => {
    // Incrementar contador de visitantes
    const incrementVisitorCount = async () => {
      try {
        await supabase.rpc('increment_visitor_count');
        console.log("Contador de visitantes incrementado");
      } catch (error) {
        console.error("Erro ao incrementar contador:", error);
      }
    };

    incrementVisitorCount();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-indigo-50 to-white flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="px-4 py-12 flex-1 flex flex-col justify-center">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Crie Músicas Personalizadas com Inteligência Artificial
          </h1>
          <p className="text-gray-600 mb-8">
            Transforme sua história em uma música especial feita exclusivamente para você ou para presentear alguém.
          </p>
          <div className="space-y-4">
            <Link to="/cadastro">
              <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-lg py-6">
                Criar Minha Música
              </Button>
            </Link>
            <Link to="/nossas-musicas">
              <Button variant="outline" className="w-full text-lg py-6">
                Ouvir Exemplos
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Como Funciona Section */}
      <section className="px-4 py-12 bg-white">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Como Funciona
          </h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-pink-100 rounded-full p-3 mr-4">
                <span className="flex items-center justify-center h-6 w-6 text-pink-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Conte sua história</h3>
                <p className="text-gray-600">Compartilhe detalhes sobre o relacionamento e momentos especiais.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-purple-100 rounded-full p-3 mr-4">
                <span className="flex items-center justify-center h-6 w-6 text-purple-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Nossos artistas criam</h3>
                <p className="text-gray-600">Transformamos sua história em uma música personalizada.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 mr-4">
                <span className="flex items-center justify-center h-6 w-6 text-blue-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Receba sua música</h3>
                <p className="text-gray-600">Baixe e compartilhe sua música especial com quem você ama.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefícios Section */}
      <section className="px-4 py-12 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Por que escolher a Música Perfeita?
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-3">
                <CheckCircle className="h-5 w-5 text-pink-500 mr-2" />
                <h3 className="font-semibold">Personalização Completa</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Sua música será única, criada especialmente para refletir sua história.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-3">
                <CheckCircle className="h-5 w-5 text-pink-500 mr-2" />
                <h3 className="font-semibold">Alta Qualidade</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Produzimos músicas com qualidade profissional, com vozes e arranjos incríveis.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-3">
                <CheckCircle className="h-5 w-5 text-pink-500 mr-2" />
                <h3 className="font-semibold">Presente Inesquecível</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Surpreenda alguém especial com um presente que será lembrado para sempre.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Depoimentos Section */}
      <section className="px-4 py-12 bg-white">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            O que nossos clientes dizem
          </h2>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6">
              <p className="text-gray-700 italic mb-4">
                "Presenteei minha esposa no nosso aniversário com uma música que conta nossa história. Ela chorou de emoção! Foi o presente mais especial que já dei."
              </p>
              <div className="font-semibold">Carlos R.</div>
            </div>
            
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6">
              <p className="text-gray-700 italic mb-4">
                "A música ficou incrível, supriu todas as minhas expectativas! Conseguiram captar exatamente o que eu queria expressar."
              </p>
              <div className="font-semibold">Mariana S.</div>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link to="/depoimentos">
              <Button variant="outline" className="text-sm">
                Ver mais depoimentos
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="px-4 py-12 bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Transforme sua história em música
          </h2>
          <p className="text-white/80 mb-8">
            Comece agora mesmo e crie uma lembrança musical que durará para sempre.
          </p>
          <Link to="/cadastro">
            <Button className="w-full bg-white text-pink-600 hover:bg-gray-100 text-lg py-6">
              Quero Minha Música Personalizada
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
      
      {/* Notificações de novos pedidos */}
      <div className="fixed bottom-20 left-4 z-50 max-w-xs hidden">
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <p className="text-sm font-medium">
            <span className="text-green-500">•</span> Joana acabou de solicitar uma música para seu namorado
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeMobile;
