
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MusicRequest } from "@/types/database.types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MusicPreviewPlayer from "@/components/dashboard/MusicPreviewPlayer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Music, Headphones } from "lucide-react";
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
            <h1 className="text-4xl font-bold mb-4">Sua Música Perfeita</h1>
            <p className="text-lg text-indigo-200">
              Ouça um trecho da sua música personalizada para {musicRequest.honoree_name}
            </p>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-white/10 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xl font-medium">{musicRequest.honoree_name}</p>
                <p className="text-sm text-indigo-200">
                  Música {getGenreText(musicRequest.music_genre)} personalizada
                </p>
              </div>
              <div className="rounded-full bg-indigo-600 p-3">
                <Music className="h-6 w-6" />
              </div>
            </div>
            
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-black/20 p-4 rounded-lg">
                  <p className="text-sm text-indigo-300 mb-1">Data do Pedido</p>
                  <p>{formatDate(musicRequest.created_at)}</p>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                  <p className="text-sm text-indigo-300 mb-1">Status</p>
                  <p className="flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      musicRequest.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></span>
                    {musicRequest.status === 'completed' ? 'Concluído' : 'Em produção'}
                  </p>
                </div>
              </div>
            </div>
            
            <MusicPreviewPlayer 
              previewUrl={musicRequest.preview_url || ''} 
              fullSongUrl={musicRequest.full_song_url} 
              isCompleted={musicRequest.status === 'completed'} 
            />
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-white/10 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Headphones className="mr-2 h-5 w-5" />
              Sobre Sua Música
            </h2>
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
              <p>
                Você está ouvindo apenas uma prévia da música. Para ter acesso à versão completa, realize o pagamento.
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <Button
              onClick={() => navigate("/pagamento", { state: { musicRequest } })}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Realizar Pagamento para Liberar Música Completa
            </Button>
            <p className="mt-4 text-indigo-200 text-sm">
              Após o pagamento, você terá acesso à versão completa da música para download.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MusicPreview;
