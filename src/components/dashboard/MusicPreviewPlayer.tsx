
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Music, PlayCircle, PauseCircle, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface MusicPreviewPlayerProps {
  previewUrl: string;
  fullSongUrl: string | null;
  isCompleted: boolean;
}

const MusicPreviewPlayer = ({ previewUrl, fullSongUrl, isCompleted }: MusicPreviewPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isSoundCloud, setIsSoundCloud] = useState(false);
  const navigate = useNavigate();
  
  const isDirectFileLink = previewUrl && (
    previewUrl.match(/\.(mp3|wav|ogg|m4a|flac)($|\?)/i) ||
    previewUrl.includes('wp.novaenergiamg.com.br') ||
    previewUrl.includes('drive.google.com')
  );

  useEffect(() => {
    // Verifica se é um link do SoundCloud
    if (previewUrl && (previewUrl.includes('soundcloud.com') || previewUrl.includes('api.soundcloud.com'))) {
      setIsSoundCloud(true);
    } else {
      setIsSoundCloud(false);
      // Se não for SoundCloud, cria elemento de áudio para arquivos regulares
      if (previewUrl && !previewUrl.startsWith('temp:') && isDirectFileLink) {
        const audio = new Audio(previewUrl);
        audio.addEventListener('ended', () => setIsPlaying(false));
        setAudioElement(audio);
  
        return () => {
          audio.pause();
          audio.src = '';
          audio.removeEventListener('ended', () => setIsPlaying(false));
        };
      }
    }
  }, [previewUrl, isDirectFileLink]);

  const togglePlay = () => {
    if (!audioElement && !isSoundCloud && !isDirectFileLink) return;
    
    if (isSoundCloud) {
      // Se for SoundCloud, abrir no player dedicado
      navigate("/music-player", { state: { musicUrl: previewUrl } });
    } else if (isDirectFileLink) {
      // Se for link direto, abrir no player completo
      const playerUrl = isCompleted ? "/music-player-full" : "/music-player";
      navigate(playerUrl, { 
        state: { 
          musicUrl: previewUrl,
          downloadUrl: isCompleted ? fullSongUrl : undefined
        } 
      });
    } else if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play().catch(error => {
          console.error('Error playing audio:', error);
          toast({
            title: "Erro ao reproduzir",
            description: "Não foi possível reproduzir o áudio. Tente novamente.",
            variant: "destructive",
          });
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAccessFullSong = () => {
    if (fullSongUrl) {
      if (isSoundCloud) {
        navigate("/music-player-full", { state: { musicUrl: fullSongUrl, downloadUrl: fullSongUrl } });
      } else if (isDirectFileLink) {
        navigate("/music-player-full", { state: { musicUrl: fullSongUrl, downloadUrl: fullSongUrl } });
      } else {
        window.open(fullSongUrl, '_blank');
      }
    } else {
      toast({
        title: "Link não disponível",
        description: "O link para download não está disponível",
        variant: "destructive",
      });
    }
  };

  if (!previewUrl) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg text-center">
        <Music className="h-12 w-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">
          Prévia da música ainda não disponível
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {isSoundCloud ? (
        // Para URLs do SoundCloud, oferecemos botões de ação em vez de embutir o player aqui
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Music className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <p className="font-medium">Música no SoundCloud</p>
                <p className="text-sm text-gray-500">
                  {isCompleted ? 'Música completa disponível' : 'Prévia de 30 segundos disponível'}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={togglePlay}
              >
                <PlayCircle className="h-4 w-4" />
                Ouvir Prévia
              </Button>
              
              {isCompleted && (
                <Button 
                  className="flex items-center gap-1 bg-pink-500 hover:bg-pink-600"
                  onClick={handleAccessFullSong}
                >
                  <ExternalLink className="h-4 w-4" />
                  Ouvir Completa
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : isDirectFileLink ? (
        // Para links diretos de arquivo
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Music className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <p className="font-medium">Sua Música Personalizada</p>
                <p className="text-sm text-gray-500">
                  {isCompleted ? 'Música completa disponível' : 'Prévia disponível'}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={togglePlay}
              >
                <PlayCircle className="h-4 w-4" />
                Ouvir no Player
              </Button>
              
              {isCompleted && (
                <Button 
                  className="flex items-center gap-1 bg-pink-500 hover:bg-pink-600"
                  onClick={handleAccessFullSong}
                >
                  <ExternalLink className="h-4 w-4" />
                  Versão Completa
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Player customizado para arquivos de áudio regulares
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={togglePlay}
                className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
              >
                {isPlaying ? 
                  <PauseCircle className="h-8 w-8" /> : 
                  <PlayCircle className="h-8 w-8" />
                }
              </button>
              <div className="ml-3">
                <p className="font-medium">Prévia da Música</p>
                <p className="text-sm text-gray-500">
                  {isCompleted ? 'Música completa disponível' : 'Aguardando pagamento para liberar música completa'}
                </p>
              </div>
            </div>
            
            {isCompleted && (
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={handleAccessFullSong}
              >
                <Download className="h-4 w-4" />
                Acessar
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPreviewPlayer;
