
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, Share2, Lock, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface MusicPreviewPlayerProps {
  previewUrl: string;
  fullSongUrl: string | null;
  isCompleted: boolean;
}

const MusicPreviewPlayer = ({ previewUrl, fullSongUrl, isCompleted }: MusicPreviewPlayerProps) => {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  
  // Limitar a reprodução a 1/3 da música (preview)
  const previewPercent = 33.3; // Percentagem da música a ser tocada como preview
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      
      // Calcular o ponto de corte para preview (1/3 da música)
      const previewDuration = audio.duration * (previewPercent / 100);
      
      // Se atingir o limite da prévia, para a reprodução
      if (audio.currentTime >= previewDuration) {
        audio.pause();
        setIsPlaying(false);
        audio.currentTime = 0;
        toast({
          title: "Prévia finalizada",
          description: "Para ouvir a música completa, é necessário realizar o pagamento",
        });
      }
    };
    
    const setAudioData = () => {
      setDuration(audio.duration);
    };
    
    const resetPlayer = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("ended", resetPlayer);
    
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("ended", resetPlayer);
    };
  }, [previewPercent]);
  
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      // Reinicia a reprodução se tentar reproduzir após o limite
      const previewDuration = audio.duration * (previewPercent / 100);
      if (audio.currentTime >= previewDuration) {
        audio.currentTime = 0;
      }
      audio.play().catch(error => {
        console.error("Erro ao reproduzir áudio:", error);
        toast({
          title: "Erro ao reproduzir",
          description: "Não foi possível reproduzir a prévia. Tente novamente.",
          variant: "destructive",
        });
      });
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isMuted) {
      audio.volume = volume;
    } else {
      audio.volume = 0;
    }
    
    setIsMuted(!isMuted);
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.volume = newVolume;
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };
  
  const handleDownload = () => {
    toast({
      title: "Acesso restrito",
      description: "Para baixar a música completa, é necessário realizar o pagamento.",
      variant: "destructive",
    });
    navigate("/pagamento");
  };

  const handleShare = () => {
    toast({
      title: "Acesso restrito",
      description: "Para compartilhar a música completa, é necessário realizar o pagamento.",
      variant: "destructive",
    });
    navigate("/pagamento");
  };

  // Calcular a duração da prévia
  const previewDuration = duration * (previewPercent / 100);
  
  // Calcular a porcentagem atual de progresso da prévia
  const progressPercentage = duration > 0 
    ? (currentTime / previewDuration) * 100 
    : 0;

  return (
    <div className="bg-black/20 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Ouça a prévia da sua música!</h2>
      
      {isCompleted && previewUrl ? (
        <div className="space-y-6">
          {/* Hidden audio element */}
          <audio 
            ref={audioRef} 
            src={previewUrl} 
            preload="metadata" 
            className="hidden"
          />
          
          {/* Custom player UI */}
          <div className="flex items-center justify-center mb-4">
            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8 ml-1" />
              )}
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
              <Progress 
                value={progressPercentage > 100 ? 100 : progressPercentage} 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500" 
              />
            </div>
            
            <div className="flex justify-between text-sm">
              <span>{formatTime(currentTime)}</span>
              <span>
                {formatTime(previewDuration)} <span className="text-yellow-300">(Preview)</span>
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-2 rounded-full hover:bg-white/10"
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 accent-indigo-400"
            />
          </div>
          
          <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4 text-yellow-200 flex items-start">
            <Lock className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              Esta é apenas uma prévia de 1/3 da música. Para ouvir a música completa 
              e fazer o download, realize o pagamento.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button 
              className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold"
              onClick={() => navigate("/pagamento")}
            >
              Pagar Agora
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1 border-purple-500 text-purple-200 hover:bg-purple-900/30"
              onClick={handleDownload}
              disabled={!isCompleted}
            >
              <Download className="mr-2 h-4 w-4" />
              Download (Bloqueado)
            </Button>
            
            <Button 
              variant="outline"
              className="flex-1 border-indigo-500 text-indigo-200 hover:bg-indigo-900/30"
              onClick={handleShare}
              disabled={!isCompleted}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar (Bloqueado)
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full bg-black/30 rounded-md p-8 text-center text-gray-400 flex flex-col items-center space-y-4">
          <svg
            className="animate-spin h-8 w-8 text-indigo-400 mb-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p>Sua música está sendo produzida.</p>
          <p>O player de áudio estará disponível quando a música estiver pronta.</p>
        </div>
      )}
    </div>
  );
};

export default MusicPreviewPlayer;
