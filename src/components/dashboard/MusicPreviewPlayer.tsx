
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Music, PlayCircle, PauseCircle, ExternalLink, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface MusicPreviewPlayerProps {
  previewUrl: string;
  fullSongUrl: string | null;
  isCompleted: boolean;
  paymentStatus?: string;
  requestId?: string;
}

const MusicPreviewPlayer = ({ 
  previewUrl, 
  fullSongUrl, 
  isCompleted,
  paymentStatus = 'pending',
  requestId
}: MusicPreviewPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isSoundCloud, setIsSoundCloud] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Use refs para evitar loops de atualização
  const previewUrlRef = useRef<string>(previewUrl);
  const isDirectFileLinkRef = useRef<boolean>(false);
  const navigate = useNavigate();
  
  const isPaid = paymentStatus === 'completed';
  
  // Calcular isso uma vez e guardar em ref para evitar recálculos desnecessários
  useEffect(() => {
    // Atualizar a ref quando o previewUrl mudar
    previewUrlRef.current = previewUrl;
    
    isDirectFileLinkRef.current = previewUrl && (
      previewUrl.match(/\.(mp3|wav|ogg|m4a|flac)($|\?)/i) ||
      previewUrl.includes('wp.novaenergiamg.com.br') ||
      previewUrl.includes('drive.google.com')
    ) ? true : false;
  }, [previewUrl]);

  useEffect(() => {
    if (!previewUrl) return;
    
    // Limpar o efeito anterior
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current.removeEventListener('ended', () => setIsPlaying(false));
    }
    
    // Verificar tipo de URL apenas uma vez e não dentro do efeito
    if (previewUrl.includes('soundcloud.com') || previewUrl.includes('api.soundcloud.com')) {
      setIsSoundCloud(true);
    } else {
      setIsSoundCloud(false);
      
      const isDirectFile = isDirectFileLinkRef.current;
      
      if (previewUrl && !previewUrl.startsWith('temp:') && isDirectFile) {
        const audio = new Audio(previewUrl);
        audio.addEventListener('ended', () => setIsPlaying(false));
        setAudioElement(audio);
        audioRef.current = audio;
  
        return () => {
          audio.pause();
          audio.src = '';
          audio.removeEventListener('ended', () => setIsPlaying(false));
        };
      }
    }
  }, [previewUrl]); // Dependência simplificada

  const togglePlay = () => {
    if (!audioElement && !isSoundCloud && !isDirectFileLinkRef.current) return;
    
    if (isSoundCloud) {
      navigate("/music-player", { 
        state: { 
          musicUrl: previewUrlRef.current,
          requestId: requestId 
        } 
      });
    } else if (isDirectFileLinkRef.current) {
      navigate("/music-player", { 
        state: { 
          musicUrl: previewUrlRef.current,
          requestId: requestId
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
      if (isSoundCloud || isDirectFileLinkRef.current) {
        navigate("/music-player-full", { 
          state: { 
            musicUrl: fullSongUrl, 
            downloadUrl: isPaid ? fullSongUrl : undefined,
            paymentStatus: paymentStatus,
            requestId: requestId
          } 
        });
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
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Music className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <p className="font-medium">Música no SoundCloud</p>
                <p className="text-sm text-gray-500">
                  {isCompleted 
                    ? isPaid 
                      ? 'Música completa disponível' 
                      : 'Música pronta - Aguardando pagamento'
                    : 'Prévia de 40 segundos disponível'}
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
                  className={`flex items-center gap-1 ${isPaid ? 'bg-pink-500 hover:bg-pink-600' : 'bg-gray-400'}`}
                  onClick={handleAccessFullSong}
                  disabled={!isPaid}
                  title={isPaid ? 'Ouvir versão completa' : 'Aguardando pagamento para liberar'}
                >
                  {isPaid ? (
                    <ExternalLink className="h-4 w-4" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                  Versão Completa
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : isDirectFileLink ? (
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Music className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <p className="font-medium">Sua Música Personalizada</p>
                <p className="text-sm text-gray-500">
                  {isCompleted 
                    ? isPaid 
                      ? 'Música completa disponível' 
                      : 'Música pronta - Aguardando pagamento'
                    : 'Prévia de 40 segundos disponível'}
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
                  className={`flex items-center gap-1 ${isPaid ? 'bg-pink-500 hover:bg-pink-600' : 'bg-gray-400'}`}
                  onClick={handleAccessFullSong}
                  disabled={!isPaid}
                  title={isPaid ? 'Ouvir versão completa' : 'Aguardando pagamento para liberar'}
                >
                  {isPaid ? (
                    <ExternalLink className="h-4 w-4" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                  Versão Completa
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
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
                  {isCompleted 
                    ? isPaid 
                      ? 'Música completa disponível' 
                      : 'Música pronta - Aguardando pagamento para liberar música completa'
                    : 'Aguardando produção da música - Prévia de 40 segundos'}
                </p>
              </div>
            </div>
            
            {isCompleted && (
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={handleAccessFullSong}
                disabled={!isPaid}
              >
                {isPaid ? (
                  <Download className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
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
