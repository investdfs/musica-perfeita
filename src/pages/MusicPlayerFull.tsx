
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SoundCloudPlayer from "@/components/music/SoundCloudPlayer";
import { ArrowLeft, CheckCircle, Download, Clock, Music, Heart } from "lucide-react";
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
      // URL padrão atualizada para o arquivo .wav fornecido
      setMusicUrl("https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/Rivers-End-1.wav");
    }
    
    if (downloadFromParams) {
      setDownloadUrl(downloadFromParams);
    } else if (location.state?.downloadUrl) {
      setDownloadUrl(location.state.downloadUrl);
    } else {
      // URL de download padrão (a mesma da música)
      setDownloadUrl("https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/Rivers-End-1.wav");
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex flex-col">
      <Header />
      <main className="flex-grow py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 mb-8"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          
          <div className="mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-center text-white mb-4 tracking-tight">
              Sua Música Completa
            </h1>
            
            <p className="text-center text-indigo-200 max-w-xl mx-auto mb-2">
              Parabéns! Você agora tem acesso à versão completa da sua música personalizada.
            </p>
            
            <p className="text-center text-indigo-300 text-sm max-w-xl mx-auto">
              Ouça quantas vezes quiser e faça o download para guardar com você.
            </p>
          </div>
          
          <div className="mb-12">
            <SoundCloudPlayer 
              musicUrl={musicUrl} 
              downloadUrl={downloadUrl} 
              limitPlayTime={false} 
            />
          </div>
          
          <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-800/30 rounded-xl p-6 mb-8">
            <div className="flex items-center mb-4">
              <Music className="h-5 w-5 text-indigo-300 mr-2" />
              <h2 className="text-xl font-semibold text-white">Detalhes da Música</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-800/20">
                <div className="flex items-center mb-2">
                  <Clock className="h-4 w-4 text-indigo-400 mr-2" />
                  <p className="text-sm text-indigo-300">Duração</p>
                </div>
                <p className="text-white">Versão Completa</p>
              </div>
              
              <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-800/20">
                <div className="flex items-center mb-2">
                  <Download className="h-4 w-4 text-indigo-400 mr-2" />
                  <p className="text-sm text-indigo-300">Download</p>
                </div>
                <p className="text-white">Disponível</p>
              </div>
              
              <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-800/20">
                <div className="flex items-center mb-2">
                  <Heart className="h-4 w-4 text-indigo-400 mr-2" />
                  <p className="text-sm text-indigo-300">Criada para</p>
                </div>
                <p className="text-white">Você</p>
              </div>
            </div>
            
            <div className="bg-indigo-900/40 p-4 rounded-lg border border-indigo-800/20">
              <h3 className="text-lg font-medium text-white mb-2">Instruções</h3>
              <ul className="list-disc pl-5 space-y-2 text-indigo-200">
                <li>Você pode ouvir esta música quantas vezes quiser.</li>
                <li>Clique no botão "Baixar Música Completa" para salvar em seu dispositivo.</li>
                <li>A música foi criada exclusivamente para você, com base nas informações que você forneceu.</li>
                <li>Se precisar de ajuda ou tiver dúvidas, entre em contato conosco.</li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={() => window.open(downloadUrl, '_blank')}
              className="group relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all text-lg overflow-hidden"
            >
              <span className="flex items-center relative z-10">
                <Download className="mr-2 h-5 w-5" />
                Baixar Música Completa
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MusicPlayerFull;
