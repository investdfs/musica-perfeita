
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const WelcomeSection = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<number | null>(null);
  
  const highlightedWords = [
    "Perfeita",
    "Especial",
    "Única",
    "Incrível",
    "Emocionante",
    "Personalizada"
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

  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-yellow-50 via-pink-50 to-green-50">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 md:gap-10 items-center">
        <div className="space-y-4 sm:space-y-6 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-green-400 bg-clip-text text-transparent whitespace-nowrap">
              Transforme seu Amor em Música{" "}
              <span 
                className="inline-block min-w-40 transition-opacity duration-500"
                style={{ 
                  opacity: isAnimating ? 0 : 1 
                }}
              >
                {highlightedWords[currentWordIndex]}
              </span>
              !
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
        <div className="relative h-64 sm:h-72 md:h-80 bg-white rounded-lg shadow-lg overflow-hidden mt-4 md:mt-0">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 via-pink-100 to-green-100 opacity-60"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src="https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/UniversalUpscaler_96cb2fe5-2944-44b2-b0ae-198f3f8f8237-1.jpg"
              alt="Casal romântico"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
