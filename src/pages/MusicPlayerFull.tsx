
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SoundCloudPlayer from "@/components/music/SoundCloudPlayer";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const MusicPlayerFull = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [musicUrl, setMusicUrl] = useState<string>("");
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  
  useEffect(() => {
    // Obter as URLs da música e do download dos parâmetros da URL ou do estado da rota
    const params = new URLSearchParams(location.search);
    const urlFromParams = params.get("url");
    const downloadFromParams = params.get("download");
    
    if (urlFromParams) {
      setMusicUrl(urlFromParams);
    } else if (location.state?.musicUrl) {
      setMusicUrl(location.state.musicUrl);
    } else {
      // URL padrão para demonstração se nenhuma for fornecida
      setMusicUrl("https://soundcloud.com/musicaperfeita/raploversp");
    }
    
    if (downloadFromParams) {
      setDownloadUrl(downloadFromParams);
    } else if (location.state?.downloadUrl) {
      setDownloadUrl(location.state.downloadUrl);
    } else {
      // URL de download padrão (pode ser a mesma da música se não houver separada)
      setDownloadUrl("https://soundcloud.com/musicaperfeita/raploversp/download");
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-indigo-900 flex flex-col">
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
            <div className="inline-flex items-center bg-green-600/20 text-green-400 px-4 py-2 rounded-full mb-4">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Música Liberada</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Sua Música Completa
            </h1>
            <p className="text-indigo-200 max-w-xl mx-auto">
              Parabéns! Você agora tem acesso à versão completa da sua música personalizada.
              Ouça quantas vezes quiser e faça o download para guardar com você.
            </p>
          </div>
          
          <SoundCloudPlayer 
            musicUrl={musicUrl} 
            downloadUrl={downloadUrl} 
            limitPlayTime={false} 
          />
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mt-10 text-white">
            <h2 className="text-xl font-semibold mb-3">Instruções:</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Você pode ouvir esta música quantas vezes quiser.</li>
              <li>Clique no botão "Baixar Música Completa" para salvar em seu dispositivo.</li>
              <li>A música foi criada exclusivamente para você, com base nas informações que você forneceu.</li>
              <li>Se precisar de ajuda ou tiver dúvidas, entre em contato conosco.</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MusicPlayerFull;
