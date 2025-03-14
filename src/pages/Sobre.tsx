
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Music, Users, Heart, MusicNote } from "lucide-react";
import ScrollToTopButton from "@/components/ui/scroll-to-top";

const Sobre = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-full mb-4">
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Sobre Nós</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conheça mais sobre o projeto Música Perfeita e nossa missão de 
              criar emoções através da música personalizada.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <div className="flex items-center mb-6">
              <Music className="h-6 w-6 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Sobre o Projeto Música Perfeita</h2>
            </div>
            <div className="prose prose-indigo max-w-none">
              <p>
                O Música Perfeita nasceu da ideia de que cada momento especial merece uma trilha sonora única. 
                Nossa equipe dedicada trabalha para transformar histórias pessoais em canções exclusivas que 
                capturam a essência dos relacionamentos e sentimentos.
              </p>
              
              <p>
                Utilizamos técnicas avançadas de composição que nos permitem criar músicas totalmente 
                personalizadas. Nossa abordagem combina recursos de produção musical de ponta com 
                uma profunda compreensão das narrativas pessoais compartilhadas por nossos clientes.
              </p>
              
              <p>
                Cada composição é única, criada especificamente para capturar os sentimentos, momentos
                e conexões importantes para você. Nossa equipe trabalha meticulosamente para garantir que
                cada nota ressoe com a história que você compartilha conosco.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-xl p-8">
              <div className="flex items-center mb-4">
                <Heart className="h-6 w-6 mr-3" />
                <h3 className="text-xl font-bold">Nossa Missão</h3>
              </div>
              <p className="mb-4">
                Transformar histórias pessoais em experiências musicais emocionantes que possam ser 
                apreciadas e compartilhadas, criando memórias duradouras através de canções personalizadas.
              </p>
              <p>
                Acreditamos que cada relacionamento é único e merece uma banda sonora personalizada
                que capture sua essência especial.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-xl p-8">
              <div className="flex items-center mb-4">
                <MusicNote className="h-6 w-6 mr-3" />
                <h3 className="text-xl font-bold">Como Funciona</h3>
              </div>
              <p className="mb-4">
                Nosso processo é simples: você nos conta sua história, escolhe o estilo musical 
                de sua preferência, e nossa equipe transforma essas informações em uma música 
                personalizada feita especialmente para você.
              </p>
              <p>
                Cada detalhe da sua história é cuidadosamente considerado para criar uma composição 
                que ressoe verdadeiramente com sua experiência pessoal.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Button 
              onClick={() => navigate("/dashboard")} 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg transition-all"
            >
              Crie Sua Música Personalizada
            </Button>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Sobre;
