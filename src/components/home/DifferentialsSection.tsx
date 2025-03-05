
import { Check } from "lucide-react";

const DifferentialsSection = () => {
  return (
    <section className="py-16 px-6 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-5xl mx-auto">
        {/* SoundCloud music player examples */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            Ouça exemplos de nossas criações
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Example 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <iframe 
                width="100%" 
                height="300" 
                scrolling="no" 
                frameBorder="no" 
                allow="autoplay" 
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/2047308952&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true"
                className="border-0"
              ></iframe>
              <div className="p-3 text-xs text-gray-500 border-t border-gray-100">
                <a href="https://soundcloud.com/musicaperfeita" title="Música Perfeita 🎶" target="_blank" className="hover:text-pink-500 transition-colors">
                  Música Perfeita 🎶
                </a> · 
                <a href="https://soundcloud.com/musicaperfeita/juliana-rafael" title="Entrada da Noiva - Juliana e Rafael" target="_blank" className="hover:text-pink-500 transition-colors ml-1">
                  Entrada da Noiva - Juliana e Rafael
                </a>
              </div>
            </div>
            
            {/* Example 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <iframe 
                width="100%" 
                height="300" 
                scrolling="no" 
                frameBorder="no" 
                allow="autoplay" 
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/2047285828&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true"
                className="border-0"
              ></iframe>
              <div className="p-3 text-xs text-gray-500 border-t border-gray-100">
                <a href="https://soundcloud.com/musicaperfeita" title="Música Perfeita 🎶" target="_blank" className="hover:text-pink-500 transition-colors">
                  Música Perfeita 🎶
                </a> · 
                <a href="https://soundcloud.com/musicaperfeita/ainda-juntos" title="Juntos há muitos anos" target="_blank" className="hover:text-pink-500 transition-colors ml-1">
                  Juntos há muitos anos
                </a>
              </div>
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
