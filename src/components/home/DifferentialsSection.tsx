
import { Check } from "lucide-react";

const DifferentialsSection = () => {
  return (
    <section className="py-16 px-6 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-5xl mx-auto">
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
