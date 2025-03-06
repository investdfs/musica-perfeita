
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MusicRequest } from "@/types/database.types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Music } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const MusicPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const musicRequest = location.state?.musicRequest as MusicRequest | undefined;
  
  useEffect(() => {
    if (!musicRequest) {
      navigate("/dashboard");
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes da música",
        variant: "destructive",
      });
    }
  }, [musicRequest, navigate]);
  
  if (!musicRequest) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getGenreText = (genre: string) => {
    const genreMap: Record<string, string> = {
      'romantic': 'Romântica',
      'mpb': 'MPB',
      'classical': 'Clássica',
      'jazz': 'Jazz',
      'hiphop': 'Hip Hop',
      'rock': 'Rock',
      'country': 'Country',
      'reggae': 'Reggae',
      'electronic': 'Eletrônica',
      'samba': 'Samba',
      'folk': 'Folk',
      'pop': 'Pop'
    };
    return genreMap[genre] || genre;
  };

  const handleDownload = () => {
    if (musicRequest.full_song_url) {
      window.open(musicRequest.full_song_url, '_blank');
    } else {
      toast({
        title: "Arquivo não disponível",
        description: "O arquivo para download ainda não está disponível",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-700 text-white">
      <Header />
      <main className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 mb-6"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Sua Música Personalizada</h1>
            <p className="text-lg text-indigo-200">
              Música criada especialmente para {musicRequest.honoree_name}
            </p>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-white/10 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xl font-medium">{musicRequest.honoree_name}</p>
                <p className="text-sm text-indigo-200">
                  Música {getGenreText(musicRequest.music_genre)} personalizada
                </p>
                <p className="text-sm text-indigo-200 mt-1">
                  Criada em: {formatDate(musicRequest.created_at)}
                </p>
              </div>
              <div className="rounded-full bg-indigo-600 p-3">
                <Music className="h-6 w-6" />
              </div>
            </div>
            
            {/* Player de vídeo */}
            <div className="mb-6 bg-black rounded-lg overflow-hidden">
              {musicRequest.preview_url ? (
                <div className="aspect-video w-full">
                  {musicRequest.preview_url.includes('soundcloud.com') ? (
                    // Player SoundCloud
                    <iframe 
                      width="100%" 
                      height="100%" 
                      scrolling="no" 
                      frameBorder="no" 
                      src={musicRequest.preview_url}
                      className="w-full h-full"
                      allow="autoplay"
                    ></iframe>
                  ) : (
                    // Player de Vídeo padrão
                    <video 
                      controls 
                      className="w-full h-full"
                      poster={musicRequest.cover_image_url || undefined}
                    >
                      <source src={musicRequest.preview_url} type="video/mp4" />
                      Seu navegador não suporta a reprodução de vídeos.
                    </video>
                  )}
                </div>
              ) : (
                <div className="aspect-video w-full flex items-center justify-center bg-gray-900">
                  <p className="text-gray-400">
                    Prévia não disponível no momento
                  </p>
                </div>
              )}
            </div>
            
            {/* Botão de download */}
            <div className="text-center mt-8">
              <Button
                onClick={handleDownload}
                disabled={!musicRequest.full_song_url || musicRequest.payment_status !== 'completed'}
                className={`px-6 py-3 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 w-full ${
                  musicRequest.full_song_url && musicRequest.payment_status === 'completed'
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                    : "bg-gray-600 text-gray-300 cursor-not-allowed"
                }`}
              >
                <Download className="h-5 w-5" />
                {musicRequest.payment_status === 'completed' 
                  ? "Baixar Música Completa" 
                  : "Faça o pagamento para baixar a música completa"}
              </Button>
              
              {musicRequest.payment_status !== 'completed' && (
                <Button
                  onClick={() => navigate("/pagamento", { state: { musicRequest } })}
                  className="mt-4 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Realizar Pagamento
                </Button>
              )}
            </div>
          </div>
          
          {/* Informações sobre a música */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Sobre Esta Música</h2>
            <div className="space-y-4">
              <p>
                Esta música foi criada especialmente para <strong>{musicRequest.honoree_name}</strong>.
              </p>
              {musicRequest.story && (
                <div>
                  <p className="text-sm text-indigo-300 mb-1">História Compartilhada</p>
                  <p className="italic bg-black/20 p-4 rounded-lg">"{musicRequest.story}"</p>
                </div>
              )}
              
              {musicRequest.payment_status !== 'completed' && (
                <p className="mt-4 text-yellow-300">
                  Para ter acesso à versão completa e baixar a música, realize o pagamento.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MusicPreview;
