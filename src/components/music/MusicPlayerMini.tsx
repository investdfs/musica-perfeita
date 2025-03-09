import { useState, useRef, useEffect } from "react";
import { Music } from "@/types/music";
import { formatTime } from "@/lib/formatTime";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Play, Pause, Volume2, VolumeX, 
  Maximize2, ChevronUp, ChevronDown, X
} from "lucide-react";

interface MusicPlayerMiniProps {
  music: Music;
  onClose: () => void;
}

const MusicPlayerMini = ({ music, onClose }: MusicPlayerMiniProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.volume = volume;
    
    audio.play().catch(err => {
      console.error("Erro ao reproduzir áudio:", err);
      setIsPlaying(false);
    });
    
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [music.audioUrl, volume]);
  
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => {
        console.error("Erro ao reproduzir áudio:", err);
      });
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newMuteState = !isMuted;
    audio.muted = newMuteState;
    setIsMuted(newMuteState);
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressBarRef.current;
    if (!audio || !progressBar) return;
    
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = offsetX / rect.width;
    const newTime = percentage * audio.duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  const openFullPlayer = () => {
    window.open(`/music-player-full?id=${music.id}`, '_blank');
  };
  
  return (
    <div className={`
      fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-700 to-pink-600 shadow-lg 
      border-t border-gray-200 z-50 transition-all duration-300 text-white
      ${isExpanded ? 'h-32 sm:h-40' : 'h-16 sm:h-20'}
    `}>
      <audio 
        ref={audioRef} 
        src={music.audioUrl} 
        preload="metadata"
      />
      
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="rounded-t-lg rounded-b-none border border-gray-200 bg-purple-600 text-white h-6 px-3 hover:bg-purple-700"
        >
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="h-full container mx-auto px-4 flex flex-col">
        <div className="flex items-center h-16 sm:h-20">
          <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-md overflow-hidden mr-3 border-2 border-white">
            <img 
              src={music.coverUrl} 
              alt={music.title} 
              className="h-full w-full object-cover"
            />
            {isPlaying && (
              <div className="absolute inset-0 flex items-end justify-center pb-1 bg-black/30">
                <div className="flex space-x-0.5">
                  {[0.3, 0.5, 0.8, 1, 0.6, 0.4, 0.7, 0.9].map((height, i) => (
                    <div 
                      key={i}
                      className="w-0.5 bg-white"
                      style={{ 
                        height: `${height * 60}%`,
                        animation: `equalizer 1s ${i * 0.1}s ease-in-out infinite alternate`
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0 mr-3">
            <h4 className="font-medium text-sm sm:text-base truncate text-white">{music.title}</h4>
            <p className="text-xs text-gray-100 truncate">{music.artist}</p>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="h-9 w-9 text-white hover:bg-white/20"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={openFullPlayer}
              className="h-9 w-9 text-white hover:bg-white/20"
            >
              <Maximize2 className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-9 w-9 text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {isExpanded && (
          <div className="pb-4">
            <div 
              ref={progressBarRef}
              className="relative w-full h-2 bg-white/30 rounded-full overflow-hidden cursor-pointer mb-2 progress-bar-animated"
              onClick={handleProgressClick}
            >
              <div 
                className="absolute top-0 left-0 h-full bg-white rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-100">
              <span>{formatTime(currentTime)}</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="h-7 w-7 text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-white"
                />
              </div>
              <span>-{formatTime(duration - currentTime)}</span>
            </div>
          </div>
        )}
        
        {!isExpanded && (
          <Progress 
            value={(currentTime / duration) * 100} 
            className="absolute bottom-0 left-0 w-full h-1 bg-white/30"
          />
        )}
      </div>
      
      <style>
        {`
        @keyframes equalizer {
          0% { height: 20%; }
          100% { height: 60%; }
        }
        .progress-bar-animated::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: translateX(-100%);
          animation: shimmer 2s infinite;
        }
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        `}
      </style>
    </div>
  );
};

export default MusicPlayerMini;
