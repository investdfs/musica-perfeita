
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
              <strong>Você sabia?</strong> A média de preço para músicas personalizadas no mercado varia de <strong>R$ 700</strong> a <strong>R$ 3.500</strong>, 
              com valores raramente divulgados nas páginas dos serviços. No <strong>Música Perfeita</strong>, 
              você conhece todos os detalhes e preços antes mesmo de contratar, e só paga depois de se 
              emocionar com o resultado!
            </p>
          </div>
        </div>

        {/* Novo componente de opções de preço */}
        <div className="mb-10">
          <Card className="border-2 border-green-300 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-6 text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-green-700 mb-2">Nossas Opções</h3>
              <p className="text-green-600 font-medium">Escolha o plano ideal para você</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 p-6">
              {/* Opção 1: Somente a Música */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center mb-4">
                  <div className="h-40 w-40 mb-4 flex items-center justify-center">
                    <img 
                      src="https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/9758649.png" 
                      alt="Somente a Música" 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <Music className="h-8 w-8 text-blue-500 mr-3" />
                    <h4 className="text-xl font-semibold text-gray-800">Somente a Música</h4>
                  </div>
                </div>
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 mb-2">Entrega da Música Digital (Arquivo)</p>
                  <p className="text-3xl font-bold text-blue-600">R$ 79,90</p>
                </div>
                <Button 
                  onClick={() => window.location.href = "/cadastro"} 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Selecionar
                </Button>
              </div>
              
              {/* Opção 2: Música + Quadro Físico */}
              <div className="bg-white rounded-xl border-2 border-green-500 shadow-md p-6 relative hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-semibold py-1 px-3 rounded-bl-lg">
                  Recomendado
                </div>
                <div className="flex flex-col items-center mb-4">
                  <div className="h-40 w-40 mb-4 flex items-center justify-center">
                    <img 
                      src="https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/quadro-decorativo-personalizado-interativo-com-qr-code-fundo-branco-68936-removebg-preview.png" 
                      alt="Música Digital + Quadro" 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <Package className="h-8 w-8 text-green-500 mr-3" />
                    <h4 className="text-xl font-semibold text-gray-800">Música Digital + Quadro</h4>
                  </div>
                </div>
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 mb-2">Quadro Player Físico com QR Code</p>
                  <p className="text-3xl font-bold text-green-600">R$ 169,90</p>
                  <span className="inline-block mt-1 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Frete Grátis</span>
                </div>
                <Button 
                  onClick={() => window.location.href = "/cadastro"} 
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Selecionar
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Versão desktop (ou tablet grande) para os recursos */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-xl overflow-hidden border border-green-200 shadow-xl">
            <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Music className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-green-700">Música Perfeita</h3>
              </div>
              <p className="text-lg font-medium text-green-600">Todos os recursos inclusos em cada produção</p>
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

        {/* Versão mobile e tablet pequeno para os recursos */}
        <div className="lg:hidden">
          <Card className="relative overflow-hidden border-2 border-green-300 shadow-lg">
            <CardContent className="pt-8 px-4 pb-6 flex flex-col items-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full mb-4 bg-green-100 text-green-600">
                <Music className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-green-700">Recursos Inclusos</h3>
              
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
