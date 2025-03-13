
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Music, Mic, PenTool, Sparkles, Zap, Heart, Image, Package, Badge, Clock, ArrowDown } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

// Tooltips para a seção "Mais ocasiões"
const occasionTooltips = {
  aniversario: "Comemore aniversários com uma melodia única que celebra a vida e a história do aniversariante.",
  casamento: "Eternize o amor do casal com uma canção personalizada para o casamento, cerimônia ou recepção.",
  nascimento: "Anuncie a chegada do seu bebê de uma forma mágica e musical, com uma melodia que traga emoção e alegria para este momento único.",
  formatura: "Celebre esta conquista acadêmica com uma música que represente a jornada de aprendizado e superação.",
  namoro: "Declare seu amor com uma composição única que expresse seus sentimentos mais profundos.",
  reconciliacao: "Peça perdão ou reconcilie-se com alguém especial através de uma melodia emocionante.",
  homenagem: "Homenageie pessoas especiais em vida ou eternize a memória de quem já partiu com uma canção.",
  agradecimento: "Demonstre gratidão de forma inesquecível com uma música personalizada de agradecimento.",
  pedidoCasamento: "Faça um pedido de casamento inesquecível com uma canção romântica e personalizada.",
};

const PriceComparisonSection = () => {
  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-6xl mx-auto">
        {/* Primeiro, mostramos a seção "Música Perfeita" (anteriormente estava abaixo) */}
        <div className="mb-8">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
            </div>
          </div>
        </div>

        {/* Agora vem a seção de preços com promoção */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por Que Escolher o Música Perfeita?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
              Um serviço completo de música personalizada com preço justo e transparente
            </p>
            <div className="bg-amber-100 border-l-4 border-amber-500 p-4 rounded-r-lg max-w-3xl mx-auto text-left mb-6">
              <p className="text-amber-800">
                <strong>Você sabia?</strong> A média de preço para músicas personalizadas no mercado varia de <strong>R$ 700</strong> a <strong>R$ 3.500</strong>, 
                com valores raramente divulgados nas páginas dos serviços. No <strong>Música Perfeita</strong>, 
                você conhece todos os detalhes e preços antes mesmo de contratar, e só paga depois de se 
                emocionar com o resultado!
              </p>
            </div>
          </div>

          <Card className="border-2 border-red-300 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-amber-100 p-6 text-center">
              <div className="flex items-center justify-center">
                <Badge className="h-6 w-6 text-red-600 mr-2" />
                <h3 className="text-xl sm:text-2xl font-bold text-red-700 mb-2">OFERTA ESPECIAL</h3>
              </div>
              <div className="flex items-center justify-center mt-1 mb-2">
                <Clock className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-600 font-bold">PROMOÇÃO POR TEMPO LIMITADO!</p>
              </div>
              <p className="text-red-600 font-medium">Não perca esta oportunidade! Peça já sua música antes que a promoção termine.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 p-6">
              {/* Opção 1: Somente a Música - Melhorias para mobile */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center mb-4">
                  <div className="h-32 sm:h-40 w-auto mb-4 flex items-center justify-center">
                    <img 
                      src="https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/9758649.png" 
                      alt="Somente a Música" 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <Music className="h-6 sm:h-8 w-6 sm:w-8 text-blue-500 mr-3" />
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-800">Somente a Música</h4>
                  </div>
                </div>
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 mb-2">Entrega da Música Digital (Arquivo)</p>
                  <div className="flex flex-wrap items-center justify-center gap-1">
                    <p className="text-base sm:text-lg font-medium text-gray-500 line-through">R$ 149,90</p>
                    <ArrowDown className="h-4 w-4 text-red-500 mx-1" />
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">R$ 79,90</p>
                  </div>
                  <span className="inline-block mt-1 bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">Economize R$ 70,00</span>
                </div>
                <Button 
                  onClick={() => window.location.href = "/cadastro"} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-sm py-2 md:text-base md:py-3"
                >
                  Selecionar
                </Button>
              </div>
              
              {/* Opção 2: Música + Quadro Físico - CORRIGINDO o problema de imagem */}
              <div className="bg-white rounded-xl border-2 border-green-500 shadow-md p-4 sm:p-6 relative hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-semibold py-1 px-3 rounded-bl-lg">
                  Recomendado
                </div>
                <div className="flex flex-col items-center mb-4">
                  {/* CORREÇÃO: Reduzindo o tamanho da imagem */}
                  <div className="h-24 sm:h-32 w-auto mb-4 flex items-center justify-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="cursor-pointer h-full flex items-center justify-center">
                          <img 
                            src="https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/quadro-decorativo-personalizado-interativo-com-qr-code-fundo-branco-68936-removebg-preview.png" 
                            alt="Música Digital + Quadro" 
                            className="object-contain hover:opacity-90 transition-opacity"
                            style={{ maxHeight: "100%", maxWidth: "90%" }}
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl p-1 bg-white">
                        <img 
                          src="https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/quadro-decorativo-personalizado-interativo-com-qr-code-fundo-branco-68936-removebg-preview.png" 
                          alt="Música Digital + Quadro - Ampliado" 
                          className="w-full h-auto object-contain"
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="flex items-center justify-center">
                    <Package className="h-6 sm:h-8 w-6 sm:w-8 text-green-500 mr-3" />
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-800">Música Digital + Quadro</h4>
                  </div>
                </div>
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 mb-2">Quadro Player Físico com QR Code</p>
                  <div className="flex flex-wrap items-center justify-center gap-1">
                    <p className="text-base sm:text-lg font-medium text-gray-500 line-through">R$ 219,90</p>
                    <ArrowDown className="h-4 w-4 text-red-500 mx-1" />
                    <p className="text-2xl sm:text-3xl font-bold text-green-600">R$ 169,90</p>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-center mt-1">
                    <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Economize R$ 50,00</span>
                    <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Frete Grátis</span>
                  </div>
                </div>
                <Button 
                  onClick={() => window.location.href = "/cadastro"} 
                  className="w-full bg-green-600 hover:bg-green-700 text-sm py-2 md:text-base md:py-3"
                >
                  Selecionar
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* REMOVENDO a seção "Ouça exemplos" conforme solicitado */}

        {/* Tooltips para "Mais ocasiões para eternizar com música" */}
        <TooltipProvider>
          <div className="mt-6 text-center">
            <Button 
              onClick={() => window.location.href = "/cadastro"}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-10 py-6 h-auto shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 text-lg"
            >
              Criar Minha Música Personalizada
            </Button>
          </div>
        </TooltipProvider>
      </div>
    </section>
  );
};

export default PriceComparisonSection;
