
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SoundCloudPlayer from "@/components/music/SoundCloudPlayer";
import { CheckCircle, Clock, Music, Heart, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { MusicRequest } from "@/types/database.types";
import MusicSelectorDialog from "@/components/music/MusicSelectorDialog";
import supabase from "@/lib/supabase";
import { useUserAuth } from "@/hooks/useUserAuth";

const MusicPlayerFull = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile } = useUserAuth();
  const [musicUrl, setMusicUrl] = useState<string>("");
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [paidRequests, setPaidRequests] = useState<MusicRequest[]>([]);
  const [showMusicSelector, setShowMusicSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!userProfile?.id) return;
    
    // Buscar todas as músicas pagas do usuário
    const fetchUserPaidRequests = async () => {
      try {
        const { data, error } = await supabase
          .from('music_requests')
          .select('*')
          .eq('user_id', userProfile.id)
          .eq('status', 'completed')
          .eq('payment_status', 'completed');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          console.log("[MusicPlayerFull] Músicas pagas encontradas:", data.length);
          setPaidRequests(data);
          
          // Se vier da tela de confirmação de pagamento ou se tiver apenas uma música,
          // não precisamos mostrar o seletor
          const hasLocationState = location.state?.musicUrl;
          
          if (!hasLocationState && data.length > 1) {
            setShowMusicSelector(true);
          } else if (!hasLocationState && data.length === 1) {
            // Se tiver apenas uma música e não vier de outra página, usar a única música disponível
            setMusicUrl(data[0].full_song_url || "");
            setDownloadUrl(data[0].full_song_url || "");
          }
        } else {
          console.log("[MusicPlayerFull] Nenhuma música paga encontrada");
          // Redirecionar para dashboard se usuário não tem músicas pagas
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("[MusicPlayerFull] Erro ao buscar músicas pagas:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserPaidRequests();
  }, [userProfile, navigate]);
  
  useEffect(() => {
    // Obter as URLs da música e do download dos parâmetros da URL ou do estado da rota
    const params = new URLSearchParams(location.search);
    const urlFromParams = params.get("url");
    const downloadFromParams = params.get("download");
    
    if (urlFromParams) {
      setMusicUrl(urlFromParams);
    } else if (location.state?.musicUrl) {
      setMusicUrl(location.state.musicUrl);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center py-12 px-6 bg-gradient-to-b from-gray-900 to-indigo-950">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white text-xl">Carregando sua música...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
                  <p className="text-gray-200 font-medium">Versão Completa</p>
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
                  <p className="text-gray-200 font-medium">Alta Qualidade</p>
                </div>
              </div>
              
              <div className="bg-gray-900/90 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-medium text-gray-200 mb-3">Instruções</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>Você pode ouvir esta música quantas vezes quiser.</li>
                  <li>Clique no botão "Baixar" verde para salvar a música em seu dispositivo.</li>
                  <li>A música foi criada exclusivamente para você, com base nas informações que você forneceu.</li>
                  <li>Se precisar de ajuda ou tiver dúvidas, entre em contato conosco.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
      
      {/* Diálogo seletor de músicas */}
      <MusicSelectorDialog 
        open={showMusicSelector} 
        onOpenChange={setShowMusicSelector}
        musicRequests={paidRequests}
      />
    </div>
  );
};

export default MusicPlayerFull;
