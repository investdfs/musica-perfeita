
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SoundCloudPlayer from "@/components/music/SoundCloudPlayer";
import { Music, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const MusicPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [musicUrl, setMusicUrl] = useState<string>("");
  
  useEffect(() => {
    // Obter a URL da música dos parâmetros da URL ou do estado da rota
    const params = new URLSearchParams(location.search);
    const urlFromParams = params.get("url");
    
    if (urlFromParams) {
      setMusicUrl(urlFromParams);
    } else if (location.state?.musicUrl) {
      setMusicUrl(location.state.musicUrl);
    } else {
      // URL padrão atualizada para o arquivo .wav fornecido
      setMusicUrl("https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/Rivers-End-1.wav");
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow py-12 px-6 bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg">
                <Music className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-center text-indigo-900 mb-4 tracking-tight">
              Prévia da Sua Música
            </h1>
            
            <p className="text-center text-indigo-700 max-w-xl mx-auto mb-2">
              Ouça uma prévia de 60 segundos da sua música personalizada criada com base nas suas preferências.
            </p>
            
            <p className="text-center text-indigo-500 text-sm max-w-xl mx-auto">
              Para acessar a versão completa, faça o pagamento e desbloqueie todos os recursos.
            </p>
          </div>
          
          <div className="mb-12">
            <SoundCloudPlayer 
              musicUrl={musicUrl} 
              limitPlayTime={true} 
              playTimeLimit={60000} 
            />
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={() => navigate("/pagamento")}
              className="group relative bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all text-lg overflow-hidden animate-pulse"
            >
              <span className="flex items-center relative z-10">
                Liberar Música Completa
                <ChevronRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform animate-bounce" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MusicPlayer;
