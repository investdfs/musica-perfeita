
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Music, PlayCircle, PauseCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MusicPreviewPlayerProps {
  previewUrl: string;
  fullSongUrl: string | null;
  isCompleted: boolean;
}

const MusicPreviewPlayer = ({ previewUrl, fullSongUrl, isCompleted }: MusicPreviewPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isSoundCloud, setIsSoundCloud] = useState(false);

  useEffect(() => {
    // Check if it's a SoundCloud URL
    if (previewUrl && (previewUrl.includes('soundcloud.com') || previewUrl.includes('api.soundcloud.com'))) {
      setIsSoundCloud(true);
    } else {
      setIsSoundCloud(false);
      // If not SoundCloud, create audio element for regular audio files
      if (previewUrl && !previewUrl.startsWith('temp:')) {
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
  }, [previewUrl]);

  const togglePlay = () => {
    if (!audioElement && !isSoundCloud) return;
    
    if (isSoundCloud) {
      // For SoundCloud we can't control play/pause directly
      // This is just toggling the visual state
      setIsPlaying(!isPlaying);
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

  const handleDownloadClick = () => {
    if (fullSongUrl) {
      window.open(fullSongUrl, '_blank');
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
        // SoundCloud embed player
        <div className="aspect-video w-full">
          <iframe 
            width="100%" 
            height="100%" 
            scrolling="no" 
            frameBorder="no" 
            src={previewUrl}
            allow="autoplay"
          ></iframe>
        </div>
      ) : (
        // Custom audio player for regular audio files
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
                onClick={handleDownloadClick}
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
