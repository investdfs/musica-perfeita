
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SoundCloudPlayer from "@/components/music/SoundCloudPlayer";
import { ArrowLeft } from "lucide-react";
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
      // URL padrão para demonstração se nenhuma for fornecida
      setMusicUrl("https://soundcloud.com/musicaperfeita/raploversp");
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-800 flex flex-col">
      <Header />
      <main className="flex-grow py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Prévia da Sua Música
            </h1>
            <p className="text-indigo-200 max-w-xl mx-auto">
              Ouça uma prévia de 30 segundos da sua música personalizada. Para acessar a versão completa, faça o pagamento.
            </p>
          </div>
          
          <SoundCloudPlayer 
            musicUrl={musicUrl} 
            limitPlayTime={true} 
            playTimeLimit={30000} 
          />
          
          <div className="text-center mt-10">
            <Button 
              onClick={() => navigate("/pagamento")}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Liberar Música Completa
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MusicPlayer;
