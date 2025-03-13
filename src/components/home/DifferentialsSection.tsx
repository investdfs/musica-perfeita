
import { Check, Music, HeadphonesIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const DifferentialsSection = () => {
  return (
    <section className="py-16 px-6 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-5xl mx-auto">
        {/* Seção de exemplos de músicas - Simplificada com imagem arredondada */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            Ouça exemplos de nossas criações
          </h3>
          <div className="max-w-2xl mx-auto text-center">
            <Link to="/nossas-musicas">
              <img 
                src="https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/a-colorful-image-of-a-playlist-with-vari__XCmGShzQkS-Iq7yoemBqw_VSsFHl0uRn2g15SpD0M6Pg.webp" 
                alt="Playlist de músicas personalizadas" 
                className="w-1/2 mx-auto rounded-xl hover:opacity-90 transition-opacity"
              />
            </Link>
            <div className="mt-4">
              <Link to="/nossas-musicas">
                <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                  Ouvir Exemplos <Music className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Por que escolher a Musicaperfeita?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-pink-500 rounded-full p-1">
                <Check className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Baixo custo, alta qualidade</h3>
                <p className="text-gray-700">Pague só após aprovar sua música!</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-pink-500 rounded-full p-1">
                <Check className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Sem pagamento antecipado</h3>
                <p className="text-gray-700">Nem dados de cartão de crédito no cadastro ou produção.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-pink-500 rounded-full p-1">
                <Check className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Música pronta em poucos dias</h3>
                <p className="text-gray-700">Direto no seu WhatsApp!</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-lg relative overflow-hidden">
            <div className="absolute -top-10 -right-10 text-8xl">🎵</div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl opacity-20">❤️</div>
            <div className="absolute bottom-4 left-8 text-7xl">🎵</div>
            <div className="absolute bottom-20 right-6 text-5xl">🎵</div>
            <div className="relative z-10 text-center py-12">
              <h3 className="text-2xl font-bold mb-2 text-pink-500">Sua emoção em melodia</h3>
              <p className="text-gray-600">Transformamos histórias de amor em canções inesquecíveis</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DifferentialsSection;
