
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SoundCloudPlayer from "@/components/music/SoundCloudPlayer";
import { CheckCircle, Clock, Music, Heart } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const MusicPlayerFull = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [musicUrl, setMusicUrl] = useState<string>("");
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const { t } = useTranslation();
  
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
      // URL padrão para caso não haja nenhuma música especificada
      setMusicUrl("https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/Rivers-End-1.wav");
    }
    
    if (downloadFromParams) {
      setDownloadUrl(downloadFromParams);
    } else if (location.state?.downloadUrl) {
      setDownloadUrl(location.state.downloadUrl);
    } else {
      // URL de download padrão (a mesma da música)
      setDownloadUrl(musicUrl);
    }
  }, [location, musicUrl]);

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
              {t("player_full.title")}
            </h1>
            
            <p className="text-center text-gray-300 max-w-xl mx-auto mb-2">
              {t("player_full.congrats")}
            </p>
            
            <p className="text-center text-green-400 text-sm max-w-xl mx-auto">
              {t("player_full.info")}
            </p>
          </div>
          
          <div className="mb-8">
            <SoundCloudPlayer 
              musicUrl={musicUrl} 
              downloadUrl={downloadUrl} 
              limitPlayTime={false} 
            />
          </div>
          
          {/* Card de Detalhes da Música */}
          <Card className="bg-gray-800/95 shadow-lg rounded-xl border border-gray-700 mb-8">
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <Music className="h-5 w-5 text-indigo-400 mr-2" />
                <CardTitle className="text-xl font-semibold text-gray-200">{t("player_full.details")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-900/90 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 text-indigo-400 mr-2" />
                    <p className="text-sm text-gray-400">{t("player_full.duration")}</p>
                  </div>
                  <p className="text-gray-200 font-medium">{t("player_full.duration_value")}</p>
                </div>
                
                <div className="bg-gray-900/90 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center mb-2">
                    <Heart className="h-4 w-4 text-indigo-400 mr-2" />
                    <p className="text-sm text-gray-400">{t("player.created_for")}</p>
                  </div>
                  <p className="text-gray-200 font-medium">{t("player.you")}</p>
                </div>
                
                <div className="bg-gray-900/90 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center mb-2">
                    <Music className="h-4 w-4 text-indigo-400 mr-2" />
                    <p className="text-sm text-gray-400">{t("player.format")}</p>
                  </div>
                  <p className="text-gray-200 font-medium">{t("player_full.format")}</p>
                </div>
              </div>
              
              <div className="bg-gray-900/90 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-medium text-gray-200 mb-3">{t("player_full.instructions")}</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>{t("player_full.instruction1")}</li>
                  <li>{t("player_full.instruction2")}</li>
                  <li>{t("player_full.instruction3")}</li>
                  <li>{t("player_full.instruction4")}</li>
                </ul>
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
