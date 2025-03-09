
import { useState, useRef, useEffect } from "react";
import { 
  Play, Pause, SkipForward, Volume2, Heart, Share, 
  VolumeX, ListMusic, ChevronDown, ChevronUp 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
}

interface NativePlaylistProps {
  className?: string;
}

const songs: Song[] = [
  {
    id: "1",
    title: "Eternidade Sagrada",
    artist: "Música Perfeita",
    url: "https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/Eternidade-Sagrada.mp3"
  },
  {
    id: "2",
    title: "Na Beira do Rio: Saudades",
    artist: "Música Perfeita",
    url: "https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/Na-Beira-do-Rio-Saudades.mp3"
  },
  {
    id: "3",
    title: "Entrada da Noiva: Juliana e Rafael",
    artist: "Música Perfeita",
    url: "https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/Entrada-da-Noiva-Juliana-e-Rafael.mp3"
  },
  {
    id: "4",
    title: "Rap Lover",
    artist: "João Gabriel SP",
    url: "https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/Joao-Gabriel-SP-Rap-Lover.mp3"
  },
  {
    id: "5",
    title: "Juntos há muitos anos",
    artist: "Música Perfeita",
    url: "https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/Juntos-ha-muitos-anos-1.mp3"
  }
];

export const NativePlaylist = ({ className }: NativePlaylistProps) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [expandedView, setExpandedView] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<number | null>(null);

  // Sugere a próxima música baseada na atual
  const getNextSong = (currentId?: string): Song => {
    if (!currentId) return songs[0];
    const currentIndex = songs.findIndex(song => song.id === currentId);
    const nextIndex = (currentIndex + 1) % songs.length;
    return songs[nextIndex];
  };

  const togglePlay = (song?: Song) => {
    if (song && (!currentSong || song.id !== currentSong.id)) {
      setCurrentSong(song);
      setIsPlaying(true);
      return;
    }

    setIsPlaying(!isPlaying);
  };

  const toggleFavorite = (songId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setFavorites(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId) 
        : [...prev, songId]
    );
  };

  const toggleExpand = (songId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedItems(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId) 
        : [...prev, songId]
    );
  };

  const shareTrack = (song: Song, event: React.MouseEvent) => {
    event.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `${song.title} - ${song.artist}`,
        text: `Ouça ${song.title} de ${song.artist} na Música Perfeita!`,
        url: window.location.href
      }).catch(error => console.log('Erro ao compartilhar:', error));
    } else {
      // Fallback para navegadores que não suportam a API Web Share
      navigator.clipboard.writeText(`${song.title} - ${song.artist}: ${window.location.href}`)
        .then(() => alert('Link copiado para a área de transferência!'))
        .catch(err => console.error('Erro ao copiar:', err));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const skipToNext = () => {
    const nextSong = getNextSong(currentSong?.id);
    setCurrentSong(nextSong);
    setIsPlaying(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Gerencia o progresso de reprodução
  useEffect(() => {
    if (!audioRef.current) return;

    const updateProgress = () => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime);
        setDuration(audioRef.current.duration || 0);
      }
    };

    if (isPlaying) {
      progressInterval.current = window.setInterval(updateProgress, 100);
    } else if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying]);

  // Manipula a reprodução de áudio
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.play().catch(error => {
        console.error("Erro ao reproduzir:", error);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  // Atualiza o volume e o mute
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Configura o novo áudio quando a música muda
  useEffect(() => {
    if (!currentSong) return;
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = currentSong.url;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Erro ao carregar nova música:", e);
          setIsPlaying(false);
        });
      }
    }
  }, [currentSong]);

  // Manipula o fim da reprodução
  useEffect(() => {
    const handleEnded = () => {
      const nextSong = getNextSong(currentSong?.id);
      setCurrentSong(nextSong);
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleEnded);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [currentSong]);

  // Elementos visuais de áudio (ondas sonoras)
  const AudioVisualizer = () => {
    return (
      <div className="audio-visualizer flex items-end h-6 gap-[2px] w-16 mx-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i} 
            className="audio-bar bg-gradient-to-t from-purple-600 to-pink-500"
            style={{ 
              height: `${15 + Math.random() * 80}%`,
              animation: isPlaying ? `equalizer ${0.5 + Math.random() * 0.7}s ease-in-out infinite alternate` : 'none'
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={cn("rounded-lg overflow-hidden shadow-lg bg-white", className)}>
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
            <ListMusic className="h-5 w-5 text-purple-600" />
            Playlist Nativa
          </h3>
          <button 
            onClick={() => setExpandedView(!expandedView)}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            {expandedView ? 
              <ChevronUp className="h-5 w-5" /> : 
              <ChevronDown className="h-5 w-5" />
            }
          </button>
        </div>

        {/* Player fixo para música atual */}
        {currentSong && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 mb-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center flex-1 min-w-0">
                <button 
                  onClick={() => togglePlay()}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-2 rounded-full shadow-sm hover:opacity-90 transition-opacity mr-3 flex-shrink-0"
                >
                  {isPlaying ? 
                    <Pause className="h-5 w-5" /> : 
                    <Play className="h-5 w-5" />
                  }
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <div className="truncate">
                      <p className="font-medium text-gray-900 truncate">{currentSong.title}</p>
                      <p className="text-xs text-gray-500 truncate">{currentSong.artist}</p>
                    </div>
                    {isPlaying && <AudioVisualizer />}
                  </div>
                  
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-gray-500">{formatTime(progress)}</span>
                    <div className="relative flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-pink-500 progress-bar-animated"
                        style={{ width: `${(progress / duration) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{formatTime(duration)}</span>
                  </div>
                </div>
                
                <div className="flex items-center ml-3 space-x-2 flex-shrink-0">
                  {expandedView && (
                    <div className="hidden sm:flex items-center mr-2">
                      <button onClick={toggleMute} className="text-gray-500 hover:text-gray-700 p-1">
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </button>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01" 
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-16 h-1 mx-2"
                      />
                    </div>
                  )}
                  <button 
                    onClick={skipToNext}
                    className="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <SkipForward className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de músicas */}
        <ul className="space-y-1.5">
          {songs.map(song => {
            const isCurrentlyPlaying = currentSong?.id === song.id && isPlaying;
            const isFavorite = favorites.includes(song.id);
            const isExpanded = expandedItems.includes(song.id) || expandedView;
            
            return (
              <li 
                key={song.id}
                className={cn(
                  "rounded-md px-3 py-2 transition-colors hover:bg-gray-50 cursor-pointer",
                  isCurrentlyPlaying ? "bg-gray-50 border-l-2 border-purple-500" : ""
                )}
                onClick={() => togglePlay(song)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="w-8 h-8 flex-shrink-0 mr-3 flex items-center justify-center">
                      {currentSong?.id === song.id ? (
                        isPlaying ? (
                          <Pause className="h-4 w-4 text-purple-600" />
                        ) : (
                          <Play className="h-4 w-4 text-gray-500" />
                        )
                      ) : (
                        <Play className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={cn(
                        "font-medium truncate", 
                        isCurrentlyPlaying ? "text-purple-600" : "text-gray-800"
                      )}>
                        {song.title}
                      </p>
                      {isExpanded && (
                        <p className="text-xs text-gray-500 truncate">{song.artist}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button 
                      onClick={(e) => toggleFavorite(song.id, e)}
                      className={cn(
                        "p-1.5 rounded-full transition-colors",
                        isFavorite 
                          ? "text-pink-500 hover:text-pink-600" 
                          : "text-gray-400 hover:text-gray-600"
                      )}
                    >
                      <Heart className="h-3.5 w-3.5" fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                    
                    <button 
                      onClick={(e) => shareTrack(song, e)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
                    >
                      <Share className="h-3.5 w-3.5" />
                    </button>
                    
                    {!expandedView && (
                      <button 
                        onClick={(e) => toggleExpand(song.id, e)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
                      >
                        {isExpanded ? 
                          <ChevronUp className="h-3.5 w-3.5" /> : 
                          <ChevronDown className="h-3.5 w-3.5" />
                        }
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      
      {/* Elemento de áudio escondido */}
      <audio ref={audioRef} preload="metadata" />
    </div>
  );
};

export default NativePlaylist;
