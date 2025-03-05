
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MusicRequest } from "@/types/database.types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Play, Pause, Music, Lock, Volume2, VolumeX } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const MusicPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const musicRequest = location.state?.musicRequest as MusicRequest | undefined;
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  
  // Limitar a reprodução a 60 segundos (preview)
  const maxPreviewDuration = 60;
  
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
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      // Parar a reprodução após 60 segundos
      if (audio.currentTime >= maxPreviewDuration) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
        toast({
          title: "Prévia finalizada",
          description: "Para ouvir a música completa, é necessário realizar o pagamento",
        });
      }
    };
    
    const setAudioData = () => {
      setDuration(Math.min(audio.duration, maxPreviewDuration));
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
  }, []);
  
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      // Se tentar reproduzir além do tempo máximo, reinicie
      if (audio.currentTime >= maxPreviewDuration) {
        audio.currentTime = 0;
      }
      audio.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const formatTime = (time: number) => {
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
  
  if (!musicRequest) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-700 text-white">
      <Header />
      <main className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Sua Música Perfeita</h1>
            <p className="text-lg text-indigo-200">
              Ouça uma prévia de {formatTime(maxPreviewDuration)} segundos da sua música personalizada.
            </p>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xl font-medium">{musicRequest.honoree_name}</p>
                <p className="text-sm text-indigo-200">
                  Música {musicRequest.music_genre} personalizada
                </p>
              </div>
              <div className="rounded-full bg-indigo-600 p-3">
                <Music className="h-6 w-6" />
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="h-1 w-full bg-gray-600 rounded-full overflow-hidden">
                <Progress value={(currentTime / maxPreviewDuration) * 100} className="h-full" />
              </div>
              
              <div className="flex justify-between text-sm">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              
              <div className="flex items-center justify-between">
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
                
                <div className="w-24"></div> {/* Spacer para centralizar o botão de play */}
              </div>
            </div>
            
            <div className="mt-10 flex flex-col items-center">
              <div className="px-6 py-4 rounded-lg bg-black/30 mb-6 text-center">
                <p className="flex items-center justify-center text-yellow-300 mb-2">
                  <Lock className="h-4 w-4 mr-1" />
                  <span>VERSÃO DE PRÉVIA</span>
                </p>
                <p className="text-indigo-200">
                  Esta é apenas uma prévia de {formatTime(maxPreviewDuration)} segundos da sua música personalizada.
                </p>
              </div>
              
              <Button
                onClick={() => navigate("/pagamento")}
                className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Liberar Música Completa
              </Button>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-indigo-200">
              Após o pagamento, você terá acesso à versão completa da música para download.
            </p>
          </div>
        </div>
      </main>
      
      {/* Audio element - hidden but functional */}
      <audio 
        ref={audioRef} 
        src={musicRequest.preview_url || ''} 
        preload="metadata" 
        className="hidden"
      />
      
      <Footer />
    </div>
  );
};

export default MusicPreview;
