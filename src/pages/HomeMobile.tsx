
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Music, Heart, Gift, CheckCircle, Headphones } from "lucide-react";
import Footer from "@/components/Footer";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import supabase from "@/lib/supabase";

const HomeMobile = () => {
  const [isVideoOpen, setIsVideoOpen] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  
  // Registro de visita única
  useEffect(() => {
    const recordVisit = async () => {
      try {
        const visitorId = localStorage.getItem('mp_visitor_id');
        
        if (!visitorId) {
          const newVisitorId = crypto.randomUUID();
          localStorage.setItem('mp_visitor_id', newVisitorId);
          
          const { error } = await supabase.rpc('increment_visitor_count');
          
          if (error) {
            console.error('Erro ao registrar visitante:', error);
          }
        }
      } catch (error) {
        console.error('Erro ao processar registro de visitante:', error);
      }
    };
    
    recordVisit();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-20">
      {/* Cabeçalho Mobile */}
      <header className="py-4 px-4 bg-white shadow-sm sticky top-0 z-40">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              MúsicaPerfeita
            </h1>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-pink-600">
                Entrar
              </Button>
            </Link>
            <Link to="/cadastro">
              <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                Cadastrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-6 pb-10 px-4">
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold leading-tight bg-gradient-to-r from-yellow-400 via-pink-500 to-green-400 bg-clip-text text-transparent">
              Transforme seu Amor em Música Perfeita
            </h1>
            <p className="text-base text-gray-700">
              Crie uma <strong>música personalizada</strong> com <strong>IA</strong>. 
              Presente exclusivo para <strong>aniversários</strong>, <strong>casamentos</strong> 
              e momentos especiais.
            </p>
            
            <div 
              className="relative h-52 bg-white rounded-lg shadow-lg overflow-hidden mt-4 cursor-pointer" 
              onClick={() => setIsVideoOpen(true)}
              aria-label="Abrir vídeo de demonstração"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 via-pink-100 to-green-100 opacity-60"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src="https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/Captura-de-tela-2025-03-08-145931.png"
                  alt="Momento de emoção ao receber uma música personalizada"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white bg-opacity-75 flex items-center justify-center">
                  <div className="w-0 h-0 border-y-8 border-y-transparent border-l-12 border-l-pink-500 ml-1"></div>
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-gray-500">
              Vídeo: Momento da emoção ao receber sua música!
            </p>
            
            <div className="flex flex-col gap-3 mt-6">
              <Link to="/cadastro" className="w-full">
                <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                  Crie Sua Música <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/nossas-musicas" className="w-full">
                <Button variant="outline" className="w-full border-pink-300 text-pink-700">
                  Ouvir Exemplos
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500 italic mt-2">
              Mais de 1.000 clientes satisfeitos!
            </p>
          </div>
        </section>

        {/* Como Funciona */}
        <section className="py-8 px-4 bg-white">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Como Funciona
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {[
              {
                step: "1",
                title: "Cadastre-se",
                description: "Crie a sua conta gratuitamente.",
                icon: <Gift className="h-6 w-6 text-purple-500" />,
                color: "bg-purple-50 border-purple-500",
                textColor: "text-purple-500"
              },
              {
                step: "2",
                title: "Conte",
                description: "Conte sua história com o máximo de detalhes.",
                icon: <Music className="h-6 w-6 text-pink-500" />,
                color: "bg-pink-50 border-pink-500",
                textColor: "text-pink-500"
              },
              {
                step: "3",
                title: "Aguarde",
                description: "Aguarde enquanto produzimos sua música.",
                icon: <Headphones className="h-6 w-6 text-teal-500" />,
                color: "bg-teal-50 border-teal-500",
                textColor: "text-teal-500"
              },
              {
                step: "4",
                title: "Aprove",
                description: "Receba e aprove um trecho da música.",
                icon: <CheckCircle className="h-6 w-6 text-blue-500" />,
                color: "bg-blue-50 border-blue-500",
                textColor: "text-blue-500"
              },
              {
                step: "5",
                title: "Emocione",
                description: "Pague e emocione a pessoa homenageada.",
                icon: <Heart className="h-6 w-6 text-red-500" />,
                color: "bg-red-50 border-red-500",
                textColor: "text-red-500"
              }
            ].map((step, i) => (
              <div 
                key={i}
                className={`p-4 rounded-lg border-l-4 ${step.color} flex items-start`}
              >
                <div className={`${step.textColor} font-bold text-2xl mr-3`} style={{ fontFamily: 'cursive' }}>
                  {step.step}
                </div>
                <div>
                  <h3 className={`${step.textColor} font-bold text-lg`}>{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                <div className="ml-auto">{step.icon}</div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Por que escolher */}
        <section className="py-8 px-4 bg-gradient-to-br from-pink-50 to-purple-50">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Por que escolher a Musicaperfeita?
          </h2>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-start">
              <div className="bg-pink-500 rounded-full p-1 mr-3 mt-1">
                <Check className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Baixo custo, alta qualidade</h3>
                <p className="text-sm text-gray-700">Pague só após aprovar sua música!</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-start">
              <div className="bg-pink-500 rounded-full p-1 mr-3 mt-1">
                <Check className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Sem pagamento antecipado</h3>
                <p className="text-sm text-gray-700">Nem dados de cartão de crédito no cadastro.</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-start">
              <div className="bg-pink-500 rounded-full p-1 mr-3 mt-1">
                <Check className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Música pronta em poucos dias</h3>
                <p className="text-sm text-gray-700">Direto no seu WhatsApp!</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-10 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Sua história merece ser cantada!
            </h2>
            <p className="text-base mb-6 text-white/90">
              É grátis para começar – crie sua conta e transforme sentimentos em música.
            </p>
            <Link to="/cadastro" className="w-full block">
              <Button size="lg" variant="secondary" className="w-full text-pink-600 font-semibold">
                <Gift className="mr-2 h-5 w-5" /> Cadastre-se Agora
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Dialog para o vídeo */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="sm:max-w-[95%] p-0 bg-transparent border-none max-h-[80vh]">
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src="https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/React-VD-1-sem-marca-dagua.mp4"
              controls
              autoPlay
              className="w-full h-full object-contain"
              onEnded={() => setIsVideoOpen(false)}
              title="Demonstração de entrega de música personalizada"
            />
            <DialogClose className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white">
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar vídeo</span>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default HomeMobile;
