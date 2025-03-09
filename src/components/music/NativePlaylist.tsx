
import { useState, useRef, useEffect } from "react";
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, Heart, Share, 
  VolumeX, ListMusic, ChevronDown, ChevronUp, Clock, Music
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

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

// Criamos um evento customizado para comunicação entre componentes
export const audioPlayerEvents = {
  PLAY_SONG: "play-song",
  TOGGLE_PLAY: "toggle-play",
  UPDATE_PROGRESS: "update-progress",
  UPDATE_CURRENT_SONG: "update-current-song"
};

// Estado global para compartilhar entre componentes
let globalAudioRef: HTMLAudioElement | null = null;
let globalCurrentSong: Song | null = null;
let globalIsPlaying: boolean = false;

// Esta função permite disparar eventos customizados
export const dispatchAudioEvent = (eventName: string, detail: any) => {
  const event = new CustomEvent(eventName, { detail });
  window.dispatchEvent(event);
};

export const NativePlaylist = ({ className }: NativePlaylistProps) => {
  const [expandedView, setExpandedView] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Escuta eventos de atualização do player global
  useEffect(() => {
    const handleUpdateCurrentSong = (e: CustomEvent) => {
      setCurrentSong(e.detail);
    };

    const handleUpdatePlayState = (e: CustomEvent) => {
      setIsPlaying(e.detail);
    };

    window.addEventListener(
      audioPlayerEvents.UPDATE_CURRENT_SONG, 
      handleUpdateCurrentSong as EventListener
    );
    
    window.addEventListener(
      audioPlayerEvents.TOGGLE_PLAY, 
      handleUpdatePlayState as EventListener
    );

    return () => {
      window.removeEventListener(
        audioPlayerEvents.UPDATE_CURRENT_SONG, 
        handleUpdateCurrentSong as EventListener
      );
      
      window.removeEventListener(
        audioPlayerEvents.TOGGLE_PLAY, 
        handleUpdatePlayState as EventListener
      );
    };
  }, []);

  const togglePlay = (song?: Song) => {
    if (song) {
      // Se clicou em uma música específica
      if (!currentSong || song.id !== currentSong.id) {
        // Se é uma música diferente, atualiza a música atual
        setCurrentSong(song);
        globalCurrentSong = song;
        dispatchAudioEvent(audioPlayerEvents.PLAY_SONG, song);
        setIsPlaying(true);
        globalIsPlaying = true;
      } else {
        // Se é a mesma música, só alterna play/pause
        setIsPlaying(!isPlaying);
        globalIsPlaying = !isPlaying;
        dispatchAudioEvent(audioPlayerEvents.TOGGLE_PLAY, !isPlaying);
      }
    }
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

  return (
    <div className={cn("rounded-xl overflow-hidden shadow-lg bg-white/80 backdrop-blur-sm border border-gray-100", className)}>
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
            <ListMusic className="h-5 w-5 text-purple-600" />
            Lista de Reprodução
          </h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setExpandedView(!expandedView)}
              className="text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={expandedView ? "Modo compacto" : "Modo expandido"}
            >
              {expandedView ? 
                <ChevronUp className="h-5 w-5" /> : 
                <ChevronDown className="h-5 w-5" />
              }
            </button>
          </div>
        </div>

        {/* Lista de músicas */}
        <div className="overflow-hidden">
          <ul className={cn(
            "space-y-0.5 transition-all duration-300",
            expandedView ? "max-h-[600px]" : "max-h-[400px]",
            "overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2"
          )}>
            {songs.map(song => {
              const isCurrentlyPlaying = currentSong?.id === song.id && isPlaying;
              const isCurrent = currentSong?.id === song.id;
              const isFavorite = favorites.includes(song.id);
              const isExpanded = expandedItems.includes(song.id) || expandedView;
              
              return (
                <li 
                  key={song.id}
                  className={cn(
                    "rounded-lg px-3 py-2.5 transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 cursor-pointer group",
                    isCurrent ? "bg-gradient-to-r from-purple-50 to-pink-50 border-l-2 border-purple-500" : "",
                    "transform transition-transform hover:scale-[1.01] active:scale-[0.99]"
                  )}
                  onClick={() => togglePlay(song)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="w-9 h-9 flex-shrink-0 mr-3 flex items-center justify-center">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                          isCurrent ? "bg-gradient-to-r from-purple-600 to-pink-500 shadow-md" : "bg-gray-100 group-hover:bg-gray-200"
                        )}>
                          {isCurrent ? (
                            isPlaying ? (
                              <Pause className="h-4 w-4 text-white" />
                            ) : (
                              <Play className="h-4 w-4 text-white" />
                            )
                          ) : (
                            <Music className="h-4 w-4 text-gray-500" />
                          )}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={cn(
                          "font-medium truncate", 
                          isCurrentlyPlaying ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500" : "text-gray-800"
                        )}>
                          {song.title}
                        </p>
                        {isExpanded && (
                          <p className="text-xs text-gray-500 truncate">{song.artist}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <button 
                        onClick={(e) => toggleFavorite(song.id, e)}
                        className={cn(
                          "p-1.5 rounded-full transition-colors",
                          isFavorite 
                            ? "text-pink-500 hover:text-pink-600" 
                            : "text-gray-400 hover:text-gray-600"
                        )}
                        aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                      >
                        <Heart className="h-3.5 w-3.5" fill={isFavorite ? "currentColor" : "none"} />
                      </button>
                      
                      <button 
                        onClick={(e) => shareTrack(song, e)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
                        aria-label="Compartilhar"
                      >
                        <Share className="h-3.5 w-3.5" />
                      </button>
                      
                      {!expandedView && (
                        <button 
                          onClick={(e) => toggleExpand(song.id, e)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
                          aria-label={isExpanded ? "Menos detalhes" : "Mais detalhes"}
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
      </div>
    </div>
  );
};

// Componente separado para o player de áudio global para o rodapé
export const AudioFooterPlayer = () => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<number | null>(null);

  // Inicializa o player
  useEffect(() => {
    if (!audioRef.current) return;
    
    globalAudioRef = audioRef.current;

    // Restaurar o estado se já existir
    if (globalCurrentSong) {
      setCurrentSong(globalCurrentSong);
      setIsPlaying(globalIsPlaying);
      
      if (globalIsPlaying) {
        audioRef.current.src = globalCurrentSong.url;
        audioRef.current.load();
        audioRef.current.play().catch(e => {
          console.error("Erro ao retomar reprodução:", e);
          setIsPlaying(false);
          globalIsPlaying = false;
        });
      }
    }

    // Configurar ouvintes de eventos
    const handlePlaySong = (e: CustomEvent) => {
      const song = e.detail as Song;
      setCurrentSong(song);
      globalCurrentSong = song;
      setIsPlaying(true);
      globalIsPlaying = true;
    };

    const handleTogglePlay = (e: CustomEvent) => {
      const shouldPlay = e.detail as boolean;
      setIsPlaying(shouldPlay);
      globalIsPlaying = shouldPlay;
    };

    window.addEventListener(
      audioPlayerEvents.PLAY_SONG, 
      handlePlaySong as EventListener
    );
    
    window.addEventListener(
      audioPlayerEvents.TOGGLE_PLAY, 
      handleTogglePlay as EventListener
    );

    return () => {
      window.removeEventListener(
        audioPlayerEvents.PLAY_SONG, 
        handlePlaySong as EventListener
      );
      
      window.removeEventListener(
        audioPlayerEvents.TOGGLE_PLAY, 
        handleTogglePlay as EventListener
      );

      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  // Sugere a próxima música baseada na atual
  const getNextSong = (currentId?: string): Song => {
    if (!currentId) return songs[0];
    const currentIndex = songs.findIndex(song => song.id === currentId);
    const nextIndex = (currentIndex + 1) % songs.length;
    return songs[nextIndex];
  };

  const getPreviousSong = (currentId?: string): Song => {
    if (!currentId) return songs[songs.length - 1];
    const currentIndex = songs.findIndex(song => song.id === currentId);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    return songs[prevIndex];
  };

  const togglePlay = () => {
    const newPlayState = !isPlaying;
    setIsPlaying(newPlayState);
    globalIsPlaying = newPlayState;
    
    // Notifica outros componentes
    dispatchAudioEvent(audioPlayerEvents.TOGGLE_PLAY, newPlayState);
  };

  const toggleFavorite = (songId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setFavorites(prev => 
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
    globalCurrentSong = nextSong;
    setIsPlaying(true);
    globalIsPlaying = true;
    
    // Notifica outros componentes
    dispatchAudioEvent(audioPlayerEvents.UPDATE_CURRENT_SONG, nextSong);
    dispatchAudioEvent(audioPlayerEvents.TOGGLE_PLAY, true);
  };

  const skipToPrevious = () => {
    const prevSong = getPreviousSong(currentSong?.id);
    setCurrentSong(prevSong);
    globalCurrentSong = prevSong;
    setIsPlaying(true);
    globalIsPlaying = true;
    
    // Notifica outros componentes
    dispatchAudioEvent(audioPlayerEvents.UPDATE_CURRENT_SONG, prevSong);
    dispatchAudioEvent(audioPlayerEvents.TOGGLE_PLAY, true);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current || !duration) return;
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
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
        globalIsPlaying = false;
        dispatchAudioEvent(audioPlayerEvents.TOGGLE_PLAY, false);
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
          globalIsPlaying = false;
          dispatchAudioEvent(audioPlayerEvents.TOGGLE_PLAY, false);
        });
      }
    }
  }, [currentSong]);

  // Manipula o fim da reprodução
  useEffect(() => {
    const handleEnded = () => {
      const nextSong = getNextSong(currentSong?.id);
      setCurrentSong(nextSong);
      globalCurrentSong = nextSong;
      dispatchAudioEvent(audioPlayerEvents.UPDATE_CURRENT_SONG, nextSong);
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
      <div className={cn(
        "audio-visualizer flex items-end h-6 gap-[2px] w-16 mx-2",
        !isPlaying && "invisible"
      )}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i} 
            className="audio-bar bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-sm"
            style={{ 
              height: `${15 + Math.random() * 80}%`,
              animation: isPlaying ? `equalizer ${0.5 + Math.random() * 0.7}s ease-in-out infinite alternate` : 'none'
            }}
          />
        ))}
      </div>
    );
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg transition-transform duration-300 z-50 animate-fade-in">
      <div className="container mx-auto px-4 py-3">
        <div className="grid grid-cols-12 gap-4 items-center">
          {/* Controles esquerda (música info) */}
          <div className="col-span-12 sm:col-span-6 md:col-span-4 flex items-center">
            <div className={cn(
              "w-12 h-12 rounded-lg mr-3 flex-shrink-0 bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-md",
              "animate-pulse-slow"
            )}>
              <Music className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0">
              <h4 className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 truncate">
                {currentSong.title}
              </h4>
              <p className="text-xs text-gray-500 truncate flex items-center">
                {currentSong.artist}
                <AudioVisualizer />
              </p>
            </div>
          </div>
          
          {/* Controles centro (reprodução) */}
          <div className="col-span-12 sm:col-span-6 md:col-span-4 order-first sm:order-none">
            <div className="flex items-center justify-center gap-3 mb-2">
              <button 
                onClick={skipToPrevious}
                className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Música anterior"
              >
                <SkipBack className="h-5 w-5" />
              </button>
              
              <button 
                onClick={togglePlay}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                aria-label={isPlaying ? "Pausar" : "Reproduzir"}
              >
                {isPlaying ? 
                  <Pause className="h-6 w-6" /> : 
                  <Play className="h-6 w-6" />
                }
              </button>
              
              <button 
                onClick={skipToNext}
                className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Próxima música"
              >
                <SkipForward className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-2 px-1">
              <span className="text-xs text-gray-500 font-mono">{formatTime(progress)}</span>
              <div className="relative flex-1 h-1.5 rounded-full overflow-hidden">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={progress}
                  onChange={handleProgressChange}
                  className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                />
                <Progress value={(progress / (duration || 1)) * 100} className="h-1.5" />
              </div>
              <span className="text-xs text-gray-500 font-mono">{formatTime(duration)}</span>
            </div>
          </div>
          
          {/* Controles direita (volume, etc) */}
          <div className="col-span-12 md:col-span-4 hidden md:flex items-center justify-end">
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleMute} 
                className="text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label={isMuted ? "Ativar som" : "Silenciar"}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <div className="relative w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"
                  style={{ width: `${volume * 100}%` }}
                ></div>
              </div>
              
              <button 
                onClick={(e) => toggleFavorite(currentSong.id, e)}
                className={cn(
                  "p-1.5 rounded-full transition-colors",
                  favorites.includes(currentSong.id) 
                    ? "text-pink-500 hover:text-pink-600" 
                    : "text-gray-400 hover:text-gray-600"
                )}
                aria-label={favorites.includes(currentSong.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                <Heart 
                  className="h-4 w-4" 
                  fill={favorites.includes(currentSong.id) ? "currentColor" : "none"} 
                />
              </button>
              
              <button 
                onClick={(e) => shareTrack(currentSong, e)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
                aria-label="Compartilhar"
              >
                <Share className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Elemento de áudio escondido */}
      <audio ref={audioRef} preload="metadata" />
    </div>
  );
};

export default NativePlaylist;
