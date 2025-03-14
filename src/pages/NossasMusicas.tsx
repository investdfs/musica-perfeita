
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NativePlaylist, { AudioFooterPlayer } from "@/components/music/NativePlaylist";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const NossasMusicas = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />
      
      <main className="flex-grow container mx-auto px-3 sm:px-4 py-6 sm:py-8 pb-24">
        <section className="mb-6 sm:mb-8">
          <div className="w-full max-w-4xl mx-auto mt-4 sm:mt-8">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center text-gray-800">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
                Playlist - Exemplos de Músicas Personalizadas
              </span>
            </h3>
            <p className="text-center text-sm sm:text-base text-gray-600 mb-4 max-w-3xl mx-auto px-4">
              Ouça nossa seleção de músicas personalizadas criadas especialmente para diversas ocasiões.
              Cada música conta uma história única e emocionante, criada com nossa tecnologia de inteligência artificial.
            </p>
            <NativePlaylist className="mb-4" />
          </div>
        </section>
        
        <section className="mb-10 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-center text-purple-800">Sobre Nossas Composições</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-purple-50 p-5 rounded-lg">
              <h3 className="font-medium text-lg mb-2 text-purple-700">Criação 100% Única</h3>
              <p className="text-gray-700">
                Cada música é completamente original e criada especificamente para capturar a essência da sua história e sentimentos.
              </p>
            </div>
            <div className="bg-pink-50 p-5 rounded-lg">
              <h3 className="font-medium text-lg mb-2 text-pink-700">Tecnologia Avançada</h3>
              <p className="text-gray-700">
                Utilizamos inteligência artificial de última geração para compor melodias, harmonias e letras personalizadas.
              </p>
            </div>
            <div className="bg-yellow-50 p-5 rounded-lg">
              <h3 className="font-medium text-lg mb-2 text-yellow-700">Variedade de Estilos</h3>
              <p className="text-gray-700">
                Oferecemos diversos gêneros musicais, desde baladas românticas até músicas animadas e contemporâneas.
              </p>
            </div>
          </div>
        </section>
        
        <section className="max-w-4xl mx-auto mt-12 text-center">
          <h3 className="text-2xl font-semibold mb-4 text-purple-800">
            Pronto para Criar Sua Própria Música Personalizada?
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Assim como os exemplos que você acabou de ouvir, nossa inteligência artificial pode criar uma música 
            exclusiva baseada na sua história. Perfeita para presentear em aniversários, casamentos, datas comemorativas ou expressar seus sentimentos.
          </p>
          <Link to="/cadastro">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Criar Minha Música <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </section>
      </main>
      
      {/* Player global de áudio no rodapé da página com tema escuro */}
      <AudioFooterPlayer />
      
      <Footer />
    </div>
  );
};

export default NossasMusicas;

