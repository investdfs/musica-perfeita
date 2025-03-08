
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";

const WelcomeSection = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<number | null>(null);
  
  const highlightedWords = [
    "Perfeita",
    "Especial",
    "Única",
    "Incrível"
  ];

  useEffect(() => {
    // Iniciar a troca de palavras após 2 segundos da primeira renderização
    const timeout = setTimeout(() => {
      intervalRef.current = window.setInterval(() => {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentWordIndex((prevIndex) => (prevIndex + 1) % highlightedWords.length);
          setIsAnimating(false);
        }, 500); // Tempo para a animação de fade-out completar
      }, 3000); // Troca a cada 3 segundos
    }, 2000);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Fechar o vídeo automaticamente quando terminar
  useEffect(() => {
    const videoElement = videoRef.current;
    
    const handleVideoEnd = () => {
      setIsVideoOpen(false);
    };
    
    if (videoElement && isVideoOpen) {
      videoElement.addEventListener("ended", handleVideoEnd);
      
      // Garantir que o vídeo seja reproduzido na horizontal em dispositivos móveis
      if (window.innerWidth <= 768) {
        try {
          if (videoElement.requestFullscreen) {
            videoElement.requestFullscreen();
          } else if ((videoElement as any).webkitRequestFullscreen) {
            (videoElement as any).webkitRequestFullscreen();
          } else if ((videoElement as any).msRequestFullscreen) {
            (videoElement as any).msRequestFullscreen();
          }
        } catch (error) {
          console.error("Erro ao tentar abrir vídeo em tela cheia:", error);
        }
      }
    }
    
    return () => {
      if (videoElement) {
        videoElement.removeEventListener("ended", handleVideoEnd);
      }
    };
  }, [isVideoOpen]);

  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-yellow-50 via-pink-50 to-green-50">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 md:gap-10 items-center">
        <div className="space-y-4 sm:space-y-6 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-yellow-400 via-pink-500 to-green-400 bg-clip-text text-transparent">
            Transforme seu Amor em Música{" "}
            <span 
              className={`transition-opacity duration-500 ${
                isAnimating ? "opacity-0" : "opacity-100"
              }`}
            >
              {highlightedWords[currentWordIndex]}
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700">
            Crie uma música personalizada para a pessoa amada, com emoção e carinho, gastando pouco e recebendo rapidinho!
          </p>
          <Link to="/cadastro">
            <Button size="lg" className="text-md mt-4 bg-pink-500 hover:bg-pink-600 px-6 py-2.5 w-full sm:w-auto">
              Comece Agora <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="flex flex-col">
          <div className="relative h-64 sm:h-72 md:h-80 bg-white rounded-lg shadow-lg overflow-hidden mt-4 md:mt-0 cursor-pointer" onClick={() => setIsVideoOpen(true)}>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 via-pink-100 to-green-100 opacity-60"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src="https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/Captura-de-tela-2025-03-08-145931.png"
                alt="Momento da homenagem"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white bg-opacity-75 flex items-center justify-center">
                <div className="w-0 h-0 border-y-8 border-y-transparent border-l-12 border-l-pink-500 ml-1"></div>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">Vídeo: Momento da homenagem.</p>
        </div>
      </div>

      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="sm:max-w-[800px] p-0 bg-transparent border-none">
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src="https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/React-VD-1-sem-marca-dagua.mp4"
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
            <DialogClose className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70">
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default WelcomeSection;
