
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SoundCloudPlayer from "@/components/music/SoundCloudPlayer";
import { CheckCircle, Clock, Music, Heart, Calendar, ExternalLink, Share2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MusicPlayerFull = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [musicUrl, setMusicUrl] = useState<string>("");
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Música Perfeita - Minha música personalizada",
        text: "Ouça a música personalizada que foi criada para mim!",
        url: window.location.href,
      }).catch((error) => console.log('Erro ao compartilhar:', error));
    } else {
      setIsShareMenuOpen(!isShareMenuOpen);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow py-12 px-6 bg-gradient-to-b from-gray-900 to-indigo-950">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-center text-gray-100 mb-4 tracking-tight">
              Sua Música Completa
            </h1>
            
            <p className="text-center text-gray-300 max-w-xl mx-auto mb-2">
              Parabéns! Você agora tem acesso à versão completa da sua música personalizada.
            </p>
            
            <p className="text-center text-green-400 text-sm max-w-xl mx-auto">
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
          
          <div className="bg-gray-800 shadow-lg rounded-xl p-6 mb-8 border border-gray-700">
            <div className="flex items-center mb-4">
              <Music className="h-5 w-5 text-indigo-400 mr-2" />
              <h2 className="text-xl font-semibold text-gray-200">Detalhes da Música</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center mb-2">
                  <Clock className="h-4 w-4 text-indigo-400 mr-2" />
                  <p className="text-sm text-gray-400">Duração</p>
                </div>
                <p className="text-gray-200 font-medium">Versão Completa</p>
              </div>
              
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center mb-2">
                  <Heart className="h-4 w-4 text-indigo-400 mr-2" />
                  <p className="text-sm text-gray-400">Criada para</p>
                </div>
                <p className="text-gray-200 font-medium">Você</p>
              </div>
              
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center mb-2">
                  <Music className="h-4 w-4 text-indigo-400 mr-2" />
                  <p className="text-sm text-gray-400">Formato</p>
                </div>
                <p className="text-gray-200 font-medium">Alta Qualidade</p>
              </div>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-medium text-gray-200 mb-2">Instruções</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                <li>Você pode ouvir esta música quantas vezes quiser.</li>
                <li>Clique no botão "Baixar" verde para salvar a música em seu dispositivo.</li>
                <li>A música foi criada exclusivamente para você, com base nas informações que você forneceu.</li>
                <li>Se precisar de ajuda ou tiver dúvidas, entre em contato conosco.</li>
              </ul>
            </div>
          </div>
          
          <Card className="bg-gray-800 shadow-lg rounded-xl p-6 mb-8 border border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-indigo-400 mr-2" />
                <CardTitle className="text-xl font-semibold text-gray-200">Compartilhe sua Música</CardTitle>
              </div>
              <CardDescription className="text-gray-300">
                Aproveite para compartilhar esta experiência com seus amigos e familiares
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Share2 className="h-4 w-4 text-indigo-400 mr-2" />
                      <p className="text-gray-200 font-medium">Compartilhar Link</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-indigo-900 hover:bg-indigo-800 border-indigo-700 text-gray-200"
                      onClick={handleShare}
                    >
                      Compartilhar
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ExternalLink className="h-4 w-4 text-indigo-400 mr-2" />
                      <p className="text-gray-200 font-medium">Download e Compartilhe</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-green-700 hover:bg-green-800 border-green-600 text-white"
                      onClick={() => {
                        if (downloadUrl) {
                          window.open(downloadUrl, '_blank');
                        }
                      }}
                    >
                      Baixar
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400 mb-2">Dica Rápida:</p>
                <p className="text-gray-300">
                  Compartilhe esta música em suas redes sociais ou envie diretamente para a pessoa 
                  homenageada. Você também pode baixar o arquivo para reproduzir offline ou criar um momento especial.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MusicPlayerFull;
