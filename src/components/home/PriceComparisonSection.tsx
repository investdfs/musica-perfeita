
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Music, Mic, PenTool, Sparkles, Zap, Heart, Image, Package } from "lucide-react";

// Lista dos recursos para exibir com ícones coloridos
const features = [
  { id: "composicao", name: "Composição musical", description: "Criamos melodias exclusivas que contam sua história", icon: <Music className="h-5 w-5 text-purple-500" /> },
  { id: "arranjo", name: "Arranjo profissional", description: "Instrumentação completa com músicos experientes", icon: <Sparkles className="h-5 w-5 text-amber-500" /> },
  { id: "letra", name: "Letra personalizada", description: "Contamos sua história de forma poética e emocionante", icon: <PenTool className="h-5 w-5 text-blue-500" /> },
  { id: "gravacao", name: "Gravação em estúdio", description: "Alta qualidade sonora com equipamentos profissionais", icon: <Mic className="h-5 w-5 text-pink-500" /> },
  { id: "mixagem", name: "Mixagem profissional", description: "Equilíbrio perfeito entre os instrumentos e vozes", icon: <Music className="h-5 w-5 text-indigo-500" /> },
  { id: "masterizacao", name: "Masterização de qualidade", description: "Finalização que garante som potente em qualquer dispositivo", icon: <Sparkles className="h-5 w-5 text-violet-500" /> },
  { id: "vocais", name: "Vocais profissionais", description: "Cantores com técnica e emoção para sua música", icon: <Mic className="h-5 w-5 text-rose-500" /> },
  { id: "instrumentos", name: "Instrumentos de qualidade", description: "Sons autênticos gravados por instrumentistas experientes", icon: <Music className="h-5 w-5 text-cyan-500" /> },
  { id: "quadro", name: "Quadro Musical Físico", description: "Um quadro decorativo com QR code para ouvir sua música", icon: <Image className="h-5 w-5 text-emerald-500" /> },
  { id: "entregaRapida", name: "Entrega em até 7 dias", description: "Receba sua música rapidamente no seu WhatsApp", icon: <Zap className="h-5 w-5 text-amber-500" /> },
  { id: "transparencia", name: "Preço transparente", description: "Sem surpresas ou taxas adicionais depois", icon: <Heart className="h-5 w-5 text-red-500" /> },
  { id: "pacote", name: "Pacote completo", description: "Todos os serviços inclusos em um único valor acessível", icon: <Package className="h-5 w-5 text-green-500" /> },
];

const PriceComparisonSection = () => {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Por Que Escolher o Música Perfeita?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Um serviço completo de música personalizada com preço justo e transparente
          </p>
          <div className="bg-amber-100 border-l-4 border-amber-500 p-4 rounded-r-lg max-w-3xl mx-auto text-left mb-8">
            <p className="text-amber-800">
              <strong>Você sabia?</strong> A média de preço para músicas personalizadas no mercado varia de R$ 700 a R$ 3.500, 
              com valores raramente divulgados nas páginas dos serviços. No <strong>Música Perfeita</strong>, 
              você conhece todos os detalhes e preços antes mesmo de contratar, e só paga depois de se 
              emocionar com o resultado!
            </p>
          </div>
        </div>

        {/* Versão desktop (ou tablet grande) */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-xl overflow-hidden border border-green-200 shadow-xl">
            <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-8 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <Music className="h-10 w-10 text-green-600" />
                </div>
                <div className="text-left">
                  <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2 inline-block">
                    Recomendado
                  </span>
                  <h3 className="text-2xl font-bold text-green-700">Música Perfeita</h3>
                  <p className="text-3xl font-bold text-green-600 mt-1">R$ 100,00</p>
                </div>
              </div>
              <Button 
                onClick={() => window.location.href = "/cadastro"}
                className="bg-green-600 hover:bg-green-700 text-white font-medium text-lg px-8 py-6 h-auto shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
              >
                Começar Agora
              </Button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {features.map((feature) => (
                  <div key={feature.id} className="flex p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="mr-4 flex-shrink-0">
                      <div className="rounded-full p-2 bg-green-100">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {feature.icon}
                        <h4 className="font-semibold text-gray-800">{feature.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Button 
                  onClick={() => window.location.href = "/cadastro"}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium px-10 py-6 h-auto shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 text-lg"
                >
                  Criar Minha Música Personalizada
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Versão mobile e tablet pequeno */}
        <div className="lg:hidden">
          <Card className="relative overflow-hidden border-2 border-green-500 shadow-lg">
            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-semibold py-1 px-3 rounded-bl-lg">
              Recomendado
            </div>
            <CardContent className="pt-8 px-4 pb-6 flex flex-col items-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full mb-4 bg-green-100 text-green-600">
                <Music className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-700">Música Perfeita</h3>
              <p className="text-2xl font-bold mb-6">R$ 100,00</p>
              
              <div className="w-full space-y-3 mb-6">
                {features.map(feature => (
                  <div key={feature.id} className="flex p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                    <div className="mr-3 flex-shrink-0">
                      <div className="rounded-full p-1 bg-green-100">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {feature.icon}
                        <span className="font-medium text-gray-800">{feature.name}</span>
                      </div>
                      <p className="text-xs text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={() => window.location.href = "/cadastro"}
                className="mt-auto w-full bg-green-600 hover:bg-green-700 text-white font-medium shadow-md hover:shadow-lg transition-all py-5"
              >
                Comece Agora
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PriceComparisonSection;
