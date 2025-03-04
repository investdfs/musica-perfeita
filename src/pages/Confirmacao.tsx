
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const Confirmacao = () => {
  const [showTerms, setShowTerms] = useState(true);
  const [countdown, setCountdown] = useState(15);
  const [canAgree, setCanAgree] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Countdown timer
    if (countdown > 0 && showTerms) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanAgree(true);
    }
  }, [countdown, showTerms]);

  const handleAgree = () => {
    setAgreed(true);
    setShowTerms(false);
    toast({
      title: "Termos aceitos",
      description: "Você agora pode baixar e compartilhar sua música!",
    });
  };

  const handleDownload = () => {
    // In a real application, this would download the file
    toast({
      title: "Download iniciado",
      description: "Sua música está sendo baixada...",
    });
  };

  const handleShare = () => {
    // In a real application, this would open share options
    toast({
      title: "Compartilhamento",
      description: "Opções de compartilhamento abertas",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Header />
      <main className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 bg-gradient-to-r from-yellow-400 via-pink-500 to-green-400 bg-clip-text text-transparent">
            Pagamento Confirmado! Aproveite sua música!
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold mb-6">Sua música está pronta!</h2>
            
            <div className="mb-8">
              <audio controls className="w-full mb-4">
                <source src="#" type="audio/mpeg" />
                Seu navegador não suporta áudio HTML5.
              </audio>
            </div>
            
            <div className="flex justify-center gap-4 mb-10">
              <Button>Ouvir</Button>
              <Button 
                onClick={handleDownload} 
                disabled={!agreed}
                className={!agreed ? "opacity-50 cursor-not-allowed" : ""}
              >
                Download
              </Button>
              <Button 
                onClick={handleShare}
                disabled={!agreed}
                className={!agreed ? "opacity-50 cursor-not-allowed" : ""}
              >
                Compartilhar
              </Button>
            </div>
            
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-4">Como usar sua música?</h3>
              <ul className="text-left space-y-2">
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span>Entregue em um convite especial para um evento.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span>Grave em canecas ou brindes personalizados.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span>Toque em um jantar romântico ou festa familiar.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="max-w-md bg-white p-6 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600">Aviso Importante</DialogTitle>
            <DialogDescription className="text-base">
              Esta música é uma criação personalizada para uso individual, entre amigos e familiares. 
              Não possui direitos autorais, sendo estritamente proibida sua comercialização, 
              monetização ou distribuição em plataformas públicas. Respeite os termos para 
              preservar a essência pessoal desta obra.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 space-y-4">
            <div className="p-3 bg-red-50 border border-red-200 rounded text-center">
              <span className="font-medium">Aguarde {countdown} segundos</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                disabled={!canAgree} 
                checked={canAgree && agreed}
                onCheckedChange={() => setAgreed(!agreed)}
              />
              <label 
                htmlFor="terms" 
                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                  !canAgree ? 'text-gray-400' : ''
                }`}
              >
                Concordo com os termos
              </label>
            </div>
            
            <Button 
              className="w-full" 
              disabled={!canAgree || !agreed}
              onClick={handleAgree}
            >
              Concordo com os Termos
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <footer className="bg-gray-800 text-white py-8 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <p>&copy; {new Date().getFullYear()} Musicaperfeita. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Confirmacao;
