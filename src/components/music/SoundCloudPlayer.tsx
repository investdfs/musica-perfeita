
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
  playTimeLimit = 60000
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
  const [error, setError] = useState<string | null>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);

  const isDirectFile = musicUrl.includes('drive.google.com') || 
                       musicUrl.includes('.mp3') || 
                       musicUrl.includes('.wav') ||
                       musicUrl.includes('wp.novaenergiamg.com.br');

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.muted = isMuted;

    if (audio.src !== musicUrl && musicUrl) {
      console.log("Carregando URL de áudio:", musicUrl);
      audio.src = musicUrl;
      audio.load();
    }

    const updateProgress = () => {
      if (!audio || audio.duration === 0) return;
      const currentProgress = (audio.currentTime / audio.duration) * 100;
      setProgress(currentProgress);
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setAudioLoaded(true);
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

    const handleError = (e: Event) => {
      console.error("Erro ao carregar o áudio:", e);
      setError("Não foi possível carregar o áudio. Verifique a URL ou o formato.");
      setIsPlaying(false);
      setAudioLoaded(false);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [musicUrl, volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (limitPlayTime && isPlaying) {
      console.log(`Configurando limite de tempo: ${playTimeLimit/1000} segundos`);
      
      timeoutRef.current = window.setTimeout(() => {
        if (audio) {
          console.log(`Tempo limite atingido (${playTimeLimit/1000} segundos). Pausando...`);
          audio.pause();
          setIsPlaying(false);
        }
      }, playTimeLimit);
    }

    return () => {
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
      setIsPlaying(false);
    } else {
      setError(null);

      if (!audio.src || audio.src !== musicUrl) {
        audio.src = musicUrl;
        audio.load();
      }
      
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error('Erro ao reproduzir áudio:', error);
          setError("Não foi possível reproduzir o áudio. Verifique a URL ou o formato.");
          setIsPlaying(false);
        });
    }
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

    const newMutedState = !isMuted;
    audioRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      audioRef.current.muted = newVolume === 0;
    }
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const restart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setProgress(0);
    setCurrentTime(0);
  };

  const forward = () => {
    if (!audioRef.current) return;
    const newTime = Math.min(audioRef.current.currentTime + 10, audioRef.current.duration);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleDownload = (downloadUrl: string) => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'musica-personalizada.wav';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isDirectFile) {
    return (
      <div className="flex flex-col items-center space-y-6 max-w-2xl mx-auto">
        <div className="w-full bg-white rounded-xl p-6 shadow-lg border border-indigo-100">
          <div className="relative h-24 mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex space-x-1 h-full items-center">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="bg-gradient-to-t from-indigo-400 to-purple-400 rounded-full"
                    style={{
                      height: `${isPlaying ? (Math.sin(i / 2) * 40 + 40) : (Math.random() * 60 + 10)}%`,
                      width: '4px',
                      opacity: isPlaying ? 0.8 : 0.3
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-r from-indigo-100/80 to-transparent">
              <h3 className="text-gray-700 text-sm font-medium">Música Personalizada</h3>
              {limitPlayTime && (
                <p className="text-xs text-indigo-500">Prévia limitada a 60 segundos</p>
              )}
            </div>
          </div>

          <audio 
            ref={audioRef} 
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="hidden"
          />

          {error && (
            <div className="bg-red-100 border border-red-200 text-red-700 p-3 mb-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div 
            ref={progressRef}
            className="w-full h-2 bg-gray-200 rounded-full cursor-pointer overflow-hidden mb-2"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-gray-500 mb-4">
            <div>{formatTime(currentTime)}</div>
            <div>{limitPlayTime ? "01:00" : formatTime(duration)}</div>
          </div>

          <div className="flex items-center justify-center space-x-4 mb-6">
            <button 
              onClick={restart}
              className="text-gray-600 hover:text-indigo-700 transition-colors p-2"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            
            <button 
              onClick={togglePlay}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full p-4 hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              disabled={!audioLoaded && !error}
            >
              {isPlaying ? 
                <Pause className="h-6 w-6 text-white" /> : 
                <Play className="h-6 w-6 text-white ml-0.5" />
              }
            </button>
            
            <button 
              onClick={forward}
              className="text-gray-600 hover:text-indigo-700 transition-colors p-2"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="text-gray-600 hover:text-indigo-700 transition-colors"
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
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>
            
            {limitPlayTime && (
              <div className="text-xs text-indigo-500 animate-pulse">
                Prévia de 60 segundos
              </div>
            )}
            
            {downloadUrl && (
              <Button 
                onClick={() => handleDownload(downloadUrl)}
                className="bg-gradient-to-r from-green-600 to-teal-700 hover:from-green-700 hover:to-teal-800 text-white flex items-center gap-2 px-4 py-2 rounded-lg shadow-md relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-white/20 transform translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000 ease-in-out"></span>
                <span className="absolute inset-0 bg-white/10 transform translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1500 delay-100 ease-in-out"></span>
                <Download className="h-4 w-4 relative z-10 animate-bounce" />
                <span className="text-sm relative z-10">Baixar</span>
              </Button>
            )}
          </div>
        </div>
        
        {limitPlayTime && (
          <div className="text-center text-sm bg-indigo-50 p-3 rounded-lg border border-indigo-100 text-gray-700 w-full max-w-md">
            <p>Esta é uma prévia limitada a 60 segundos. Adquira a versão completa para ouvir a música inteira.</p>
          </div>
        )}
      </div>
    );
  } else {
    const embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(musicUrl)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`;
    
    return (
      <div className="flex flex-col items-center space-y-4 max-w-2xl mx-auto">
        <div className="w-full border-4 border-purple-600 rounded-lg overflow-hidden shadow-lg">
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
          <div className="text-center text-sm bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-3 rounded-lg backdrop-blur-sm border border-purple-800/30 text-indigo-200 w-full max-w-md">
            <p>Esta é uma prévia limitada a 30 segundos. Adquira a versão completa para ouvir a música inteira.</p>
          </div>
        )}
        
        {downloadUrl && (
          <Button 
            onClick={() => handleDownload(downloadUrl)}
            className="bg-gradient-to-r from-green-600 to-teal-700 hover:from-green-700 hover:to-teal-800 text-white flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-white/20 transform translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000 ease-in-out"></span>
            <span className="absolute inset-0 bg-white/10 transform translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1500 delay-100 ease-in-out"></span>
            <Download className="h-5 w-5 relative z-10 animate-bounce" />
            <span className="relative z-10">Baixar Música Completa</span>
          </Button>
        )}
      </div>
    );
  }
};

export default SoundCloudPlayer;
