
import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Mostrar botão quando a página é rolada para baixo
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Função para rolar para o topo
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 p-3 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 transition-all transform ${
        isVisible 
          ? 'opacity-100 translate-y-0 hover:scale-110' 
          : 'opacity-0 translate-y-10 pointer-events-none'
      } duration-300 z-50 group`}
      aria-label="Voltar ao topo"
    >
      <ChevronUp className="h-6 w-6 animate-bounce group-hover:animate-none" />
      <span className="animate-pulse absolute -top-10 right-0 bg-purple-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        Voltar ao topo
      </span>
    </button>
  );
};

export default ScrollToTopButton;
