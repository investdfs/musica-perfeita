
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface SoundCloudPlayerProps {
  musicUrl: string;
  downloadUrl?: string;
  limitPlayTime?: boolean;
  playTimeLimit?: number;
}

const SoundCloudPlayer = ({
  musicUrl,
  downloadUrl,
  limitPlayTime = false,
  playTimeLimit = 30000
}: SoundCloudPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  // Determinar se estamos usando SoundCloud ou arquivo direto
  const isDirectFile = musicUrl.includes('drive.google.com') || 
                       musicUrl.includes('.mp3') || 
                       musicUrl.includes('.wav');

  // Função para formatar o tempo (segundos para mm:ss)
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (!audio || audio.duration === 0) return;
      const currentProgress = (audio.currentTime / audio.duration) * 100;
      setProgress(currentProgress);
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      console.log(`Duração total: ${audio.duration} segundos`);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      if (audio) {
        audio.currentTime = 0;
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    // Se limitPlayTime for true, configure para pausar após o tempo definido
    if (limitPlayTime && isPlaying) {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = window.setTimeout(() => {
        if (audio) {
          audio.pause();
          setIsPlaying(false);
          console.log(`Música pausada após ${playTimeLimit/1000} segundos`);
        }
      }, playTimeLimit);
    }

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying, limitPlayTime, playTimeLimit]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } else {
      audio.play()
        .then(() => {
          // Se limitPlayTime for true, configurar para pausar após o tempo definido
          if (limitPlayTime) {
            if (timeoutRef.current) {
              window.clearTimeout(timeoutRef.current);
            }
            
            timeoutRef.current = window.setTimeout(() => {
              audio.pause();
              setIsPlaying(false);
              console.log(`Música pausada após ${playTimeLimit/1000} segundos`);
            }, playTimeLimit);
          }
        })
        .catch(error => {
          console.error('Erro ao reproduzir áudio:', error);
        });
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;
    
    const progressBar = progressRef.current;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newProgress = (offsetX / rect.width) * 100;
    
    if (newProgress >= 0 && newProgress <= 100) {
      const newTime = (newProgress / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(newProgress);
      setCurrentTime(newTime);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.volume = volume;
    } else {
      audioRef.current.volume = 0;
    }
    
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  // Se for um arquivo direto
  if (isDirectFile) {
    return (
      <div className="flex flex-col items-center space-y-4 max-w-2xl mx-auto">
        <div className="w-full bg-gradient-to-r from-indigo-900 to-purple-900 rounded-lg p-5 shadow-2xl">
          <div className="flex flex-col space-y-4">
            {/* Título e Artwork */}
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h3 className="font-bold">Música Personalizada</h3>
                {limitPlayTime && (
                  <p className="text-xs text-indigo-200">Prévia limitada a 30 segundos</p>
                )}
              </div>
              <div className="h-12 w-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <Play className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Player de Áudio */}
            <audio 
              ref={audioRef} 
              src={musicUrl} 
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="hidden"
            />

            {/* Barra de Progresso */}
            <div 
              ref={progressRef}
              className="w-full h-2 bg-gray-700 rounded-full cursor-pointer overflow-hidden"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Controles + Tempo */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-white">
                {formatTime(currentTime)} / {limitPlayTime ? "00:30" : formatTime(duration)}
              </div>

              <div className="flex items-center space-x-4">
                <button 
                  onClick={togglePlay}
                  className="bg-white rounded-full p-3 hover:bg-gray-200 transition-colors"
                >
                  {isPlaying ? 
                    <Pause className="h-5 w-5 text-purple-900" /> : 
                    <Play className="h-5 w-5 text-purple-900" />
                  }
                </button>

                <button
                  onClick={toggleMute}
                  className="text-white hover:text-pink-300 transition-colors"
                >
                  {isMuted ? 
                    <VolumeX className="h-5 w-5" /> : 
                    <Volume2 className="h-5 w-5" />
                  }
                </button>

                <div className="w-24">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-full accent-pink-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {limitPlayTime && (
          <div className="text-center text-indigo-600 bg-indigo-100 p-2 rounded-md w-full">
            <p>Esta é uma prévia limitada a 30 segundos.</p>
          </div>
        )}
        
        {downloadUrl && (
          <Button 
            onClick={() => window.open(downloadUrl, '_blank')}
            className="bg-pink-500 hover:bg-pink-600 flex items-center gap-2 px-6 py-2.5"
          >
            <Download className="h-5 w-5" />
            Baixar Música Completa
          </Button>
        )}
      </div>
    );
  } else {
    // Se for um link do SoundCloud
    const embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(musicUrl)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`;
    
    return (
      <div className="flex flex-col items-center space-y-4 max-w-2xl mx-auto">
        <div className="w-full border-4 border-pink-500 rounded-lg overflow-hidden shadow-lg">
          <iframe
            title="SoundCloud Player"
            width="100%"
            height="300"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={embedUrl}
            className="bg-white"
          ></iframe>
        </div>
        
        {limitPlayTime && (
          <div className="text-center text-indigo-600 bg-indigo-100 p-2 rounded-md w-full">
            <p>Esta é uma prévia limitada a 30 segundos.</p>
          </div>
        )}
        
        {downloadUrl && (
          <Button 
            onClick={() => window.open(downloadUrl, '_blank')}
            className="bg-pink-500 hover:bg-pink-600 flex items-center gap-2 px-6 py-2.5"
          >
            <Download className="h-5 w-5" />
            Baixar Música Completa
          </Button>
        )}
      </div>
    );
  }
};

export default SoundCloudPlayer;
