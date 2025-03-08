
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SoundCloudPlayer from "@/components/music/SoundCloudPlayer";
import { Music, ChevronRight, Clock, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

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
      <main className="flex-grow py-12 px-6 bg-gradient-to-b from-gray-900 to-indigo-950">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg">
                <Music className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-center text-gray-100 mb-4 tracking-tight">
              Prévia da Sua Música
            </h1>
            
            <p className="text-center text-gray-300 max-w-xl mx-auto mb-2">
              Ouça uma prévia de 60 segundos da sua música personalizada criada com base nas suas preferências.
            </p>
            
            <p className="text-center text-indigo-400 text-sm max-w-xl mx-auto">
              Para acessar a versão completa, faça o pagamento e desbloqueie todos os recursos.
            </p>
          </div>
          
          <div className="mb-8">
            <SoundCloudPlayer 
              musicUrl={musicUrl} 
              limitPlayTime={true} 
              playTimeLimit={60000} 
            />
          </div>
          
          {/* Novo Card de Detalhes da Música */}
          <Card className="bg-gray-800/95 shadow-lg rounded-xl border border-gray-700 mb-8">
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <Music className="h-5 w-5 text-indigo-400 mr-2" />
                <CardTitle className="text-xl font-semibold text-gray-200">Detalhes da Música</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-900/90 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 text-indigo-400 mr-2" />
                    <p className="text-sm text-gray-400">Duração</p>
                  </div>
                  <p className="text-gray-200 font-medium">Prévia de 60 segundos</p>
                </div>
                
                <div className="bg-gray-900/90 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center mb-2">
                    <Heart className="h-4 w-4 text-indigo-400 mr-2" />
                    <p className="text-sm text-gray-400">Criada para</p>
                  </div>
                  <p className="text-gray-200 font-medium">Você</p>
                </div>
                
                <div className="bg-gray-900/90 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center mb-2">
                    <Music className="h-4 w-4 text-indigo-400 mr-2" />
                    <p className="text-sm text-gray-400">Formato</p>
                  </div>
                  <p className="text-gray-200 font-medium">Prévia Limitada</p>
                </div>
              </div>
              
              <div className="bg-gray-900/90 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-medium text-gray-200 mb-3">Instruções</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>Esta é apenas uma prévia limitada a 60 segundos da sua música.</li>
                  <li>Para acessar a versão completa, faça o pagamento.</li>
                  <li>A música foi criada exclusivamente para você, com base nas informações que você forneceu.</li>
                  <li>Após o pagamento, você poderá baixar a música em alta qualidade.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
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
