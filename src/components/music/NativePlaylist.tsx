import { useState, useRef, useEffect } from "react";
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, Heart, Share, 
  VolumeX, ListMusic, ChevronDown, ChevronUp, Clock, Music, X
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
  },
  {
    id: "6",
    title: "Meu anjo se foi",
    artist: "Música Perfeita",
    url: "https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/Meu-anjo-se-foi.mp3"
  },
  {
    id: "7",
    title: "Entre Mundos",
    artist: "Música Perfeita",
    url: "https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/Entre-Mundos.mp3"
  },
  {
    id: "8",
    title: "Emerald Eyes",
    artist: "Música Instrumental",
    url: "https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/Emerald-Eyes.mp3"
  },
  {
    id: "9",
    title: "Meu filho meu anjo",
    artist: "Música Perfeita",
    url: "https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/Meu-filho-meu-anjo.mp3"
  }
];

export const audioPlayerEvents = {
  PLAY_SONG: "play-song",
  TOGGLE_PLAY: "toggle-play",
  UPDATE_PROGRESS: "update-progress",
  UPDATE_CURRENT_SONG: "update-current-song",
  SONG_ENDED: "song-ended"
};

let globalAudioRef: HTMLAudioElement | null = null;
let globalCurrentSong: Song | null = null;
let globalIsPlaying: boolean = false;
let globalShowFooterPlayer: boolean = false;

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
  const [showFooterPlayer, setShowFooterPlayer] = useState(false);

  useEffect(() => {
    const handleUpdateCurrentSong = (e: CustomEvent) => {
      setCurrentSong(e.detail);
    };

    const handleUpdatePlayState = (e: CustomEvent) => {
      setIsPlaying(e.detail);
    };

    const handleSongEnded = () => {
      setIsPlaying(false);
      globalIsPlaying = false;
      dispatchAudioEvent(audioPlayerEvents.SONG_ENDED, null);
      
      setShowFooterPlayer(false);
      globalShowFooterPlayer = false;
    };

    window.addEventListener(
      audioPlayerEvents.UPDATE_CURRENT_SONG, 
      handleUpdateCurrentSong as EventListener
    );
    
    window.addEventListener(
      audioPlayerEvents.TOGGLE_PLAY, 
      handleUpdatePlayState as EventListener
    );
    
    window.addEventListener(
      audioPlayerEvents.SONG_ENDED,
      handleSongEnded as EventListener
    );

    if (globalCurrentSong) {
      setCurrentSong(globalCurrentSong);
      setIsPlaying(globalIsPlaying);
      setShowFooterPlayer(globalShowFooterPlayer);
    }

    return () => {
      window.removeEventListener(
        audioPlayerEvents.UPDATE_CURRENT_SONG, 
        handleUpdateCurrentSong as EventListener
      );
      
      window.removeEventListener(
        audioPlayerEvents.TOGGLE_PLAY, 
        handleUpdatePlayState as EventListener
      );
      
      window.removeEventListener(
        audioPlayerEvents.SONG_ENDED,
        handleSongEnded as EventListener
      );
    };
  }, []);

  const togglePlay = (song?: Song, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    if (song) {
      if (!currentSong || song.id !== currentSong.id) {
        setCurrentSong(song);
        globalCurrentSong = song;
        dispatchAudioEvent(audioPlayerEvents.PLAY_SONG, song);
        setIsPlaying(true);
        globalIsPlaying = true;
        setShowFooterPlayer(true);
        globalShowFooterPlayer = true;
      } else {
        setIsPlaying(!isPlaying);
        globalIsPlaying = !isPlaying;
        dispatchAudioEvent(audioPlayerEvents.TOGGLE_PLAY, !isPlaying);
      }
    } else if (currentSong) {
      setIsPlaying(!isPlaying);
      globalIsPlaying = !isPlaying;
      dispatchAudioEvent(audioPlayerEvents.TOGGLE_PLAY, !isPlaying);
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
      navigator.clipboard.writeText(`${song.title} - ${song.artist}: ${window.location.href}`)
        .then(() => alert('Link copiado para a área de transferência!'))
        .catch(err => console.error('Erro ao copiar:', err));
    }
  };

  return (
    <div className={cn("rounded-xl overflow-hidden shadow-lg bg-white/80 backdrop-blur-sm border border-gray-100", className)}>
      <div className="p-4 sm:p-5">
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
                    "rounded-lg px-2 sm:px-3 py-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 cursor-pointer group",
                    isCurrent ? "bg-gradient-to-r from-purple-50 to-pink-50 border-l-2 border-purple-500" : "",
                    "transform transition-transform hover:scale-[1.01] active:scale-[0.99]"
                  )}
                  onClick={() => togglePlay(song)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 mr-2 sm:mr-3 flex items-center justify-center">
                        <button 
                          className={cn(
                            "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300",
                            isCurrent ? "bg-gradient-to-r from-purple-600 to-pink-500 shadow-md" : "bg-gray-100 group-hover:bg-gray-200"
                          )}
                          onClick={(e) => togglePlay(song, e)}
                        >
                          {isCurrent ? (
                            isPlaying ? (
                              <Pause className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                            ) : (
                              <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                            )
                          ) : (
                            <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={cn(
                          "font-medium truncate text-sm sm:text-base", 
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
                          "p-1 sm:p-1.5 rounded-full transition-colors",
                          isFavorite 
                            ? "text-pink-500 hover:text-pink-600" 
                            : "text-gray-400 hover:text-gray-600"
                        )}
                        aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                      >
                        <Heart className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill={isFavorite ? "currentColor" : "none"} />
                      </button>
                      
                      <button 
                        onClick={(e) => shareTrack(song, e)}
                        className="p-1 sm:p-1.5 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
                        aria-label="Compartilhar"
                      >
                        <Share className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      </button>
                      
                      {!expandedView && (
                        <button 
                          onClick={(e) => toggleExpand(song.id, e)}
                          className="p-1 sm:p-1.5 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
                          aria-label={isExpanded ? "Menos detalhes" : "Mais detalhes"}
                        >
                          {isExpanded ? 
                            <ChevronUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> : 
                            <ChevronDown className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
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

export const AudioFooterPlayer = () => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFooterPlayer, setShowFooterPlayer] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioElement = useRef<HTMLAudioElement | null>(null); 
  const progressInterval = useRef<number | null>(null);

  useEffect(() => {
    if (!audioElement.current) {
      audioElement.current = new Audio();
      audioElement.current.volume = volume;
    }
    
    audioRef.current = audioElement.current;
    globalAudioRef = audioElement.current;

    if (globalCurrentSong) {
      setCurrentSong(globalCurrentSong);
      setIsPlaying(globalIsPlaying);
      setShowFooterPlayer(globalShowFooterPlayer);
      
      if (globalIsPlaying) {
        audioElement.current.src = globalCurrentSong.url;
        audioElement.current.load();
        audioElement.current.play().catch(e => {
          console.error("Erro ao retomar reprodução:", e);
          setIsPlaying(false);
          globalIsPlaying = false;
        });
      }
    }

    const handleEnded = () => {
      setIsPlaying(false);
      globalIsPlaying = false;
      dispatchAudioEvent(audioPlayerEvents.SONG_ENDED, null);
      
      setShowFooterPlayer(false);
      globalShowFooterPlayer = false;
    };

    if (audioElement.current) {
      audioElement.current.addEventListener('ended', handleEnded);
    }

    const handlePlaySong = (e: CustomEvent) => {
      const song = e.detail as Song;
      playSong(song);
    };

    const handleTogglePlay = (e: CustomEvent) => {
      const shouldPlay = e.detail as boolean;
      togglePlayback(shouldPlay);
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

      if (audioElement.current) {
        audioElement.current.removeEventListener('ended', handleEnded);
        audioElement.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (currentSong) {
      setShowFooterPlayer(true);
      globalShowFooterPlayer = true;
    }
  }, [currentSong]);

  const playSong = (song: Song) => {
    if (!audioElement.current) return;
    
    setCurrentSong(song);
    globalCurrentSong = song;
    
    audioElement.current.src = song.url;
    audioElement.current.load();
    
    audioElement.current.play()
      .then(() => {
        setIsPlaying(true);
        globalIsPlaying = true;
        dispatchAudioEvent(audioPlayerEvents.UPDATE_CURRENT_SONG, song);
        dispatchAudioEvent(audioPlayerEvents.TOGGLE_PLAY, true);
        
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
        progressInterval.current = window.setInterval(updateProgress, 100);
      })
      .catch(error => {
        console.error("Erro ao reproduzir áudio:", error);
        setIsPlaying(false);
        globalIsPlaying = false;
      });
  };

  const togglePlayback = (shouldPlay?: boolean) => {
    if (!audioElement.current || !currentSong) return;
    
    const newPlayState = shouldPlay !== undefined ? shouldPlay : !isPlaying;
    
    if (newPlayState) {
      audioElement.current.play()
        .then(() => {
          setIsPlaying(true);
          globalIsPlaying = true;
          
          if (progressInterval.current) {
            clearInterval(progressInterval.current);
          }
          progressInterval.current = window.setInterval(updateProgress, 100);
        })
        .catch(error => {
          console.error("Erro ao reproduzir áudio:", error);
          setIsPlaying(false);
          globalIsPlaying = false;
        });
    } else {
      audioElement.current.pause();
      setIsPlaying(false);
      globalIsPlaying = false;
      
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }
  };

  const updateProgress = () => {
    if (!audioElement.current) return;
    
    setProgress(audioElement.current.currentTime);
    setDuration(audioElement.current.duration || 0);
    
    dispatchAudioEvent(audioPlayerEvents.UPDATE_PROGRESS, {
      currentTime: audioElement.current.currentTime,
      duration: audioElement.current.duration || 0
    });
  };

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
    togglePlayback();
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
      navigator.clipboard.writeText(`${song.title} - ${song.artist}: ${window.location.href}`)
        .then(() => alert('Link copiado para a área de transferência!'))
        .catch(err => console.error('Erro ao copiar:', err));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (audioElement.current) {
      audioElement.current.volume = newVolume;
    }
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    
    if (audioElement.current) {
      audioElement.current.volume = newMuteState ? 0 : volume;
    }
  };

  const skipToNext = () => {
    const nextSong = getNextSong(currentSong?.id);
    playSong(nextSong);
  };

  const skipToPrevious = () => {
    const prevSong = getPreviousSong(currentSong?.id);
    playSong(prevSong);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioElement.current || !duration) return;
    
    const newTime = parseFloat(e.target.value);
    audioElement.current.currentTime = newTime;
    setProgress(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const AudioVisualizer = () => {
    if (!isPlaying) return null;

    return (
      <span className="audio-visualizer flex items-end h-6 gap-[2px] w-16 mx-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <span 
            key={i} 
            className="audio-bar bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-sm"
            style={{ 
              width: '2px',
              height: `${15 + Math.random() * 80}%`,
              animation: `equalizer ${0.5 + Math.random() * 0.7}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </span>
    );
  };

  if (!currentSong || !showFooterPlayer) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white border-t border-gray-800 shadow-lg transition-transform duration-300 z-50 animate-fade-in">
      <div className="container mx-auto px-3 py-2 sm:px-4 sm:py-3">
        <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center">
          <div className="col-span-10 sm:col-span-6 md:col-span-4 flex items-center">
            <div className={cn(
              "w-10 h-10 sm:w-12 sm:h-12 rounded-lg mr-2 sm:mr-3 flex-shrink-0 bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-md",
              "animate-pulse-slow"
            )}>
              <Music className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0">
              <h4 className="font-medium text-sm sm:text-base text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 truncate">
                {currentSong?.title || "Selecione uma música"}
              </h4>
              <p className="text-xs text-gray-300 truncate flex items-center">
                {currentSong?.artist || "Artista"}
                <AudioVisualizer />
              </p>
            </div>
          </div>
          
          <div className="col-span-2 md:col-span-4 order-none flex items-center justify-end md:justify-center">
            <button 
              onClick={togglePlay}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-2 sm:p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
              aria-label={isPlaying ? "Pausar" : "Reproduzir"}
            >
              {isPlaying ? 
                <Pause className="h-5 w-5 sm:h-6 sm:w-6" /> : 
                <Play className="h-5 w-5 sm:h-6 sm:w-6" />
              }
            </button>
          </div>
          
          <div className="col-span-12 order-last">
            <div className="flex items-center gap-1 sm:gap-2 px-1">
              <span className="text-xs text-gray-400 font-mono">{formatTime(progress)}</span>
              <div className="relative flex-1 h-1.5 rounded-full overflow-hidden">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={progress}
                  onChange={handleProgressChange}
                  className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                />
                <Progress value={(progress / (duration || 1)) * 100} className="h-1.5 bg-gray-700" />
              </div>
              <span className="text-xs text-gray-400 font-mono">{formatTime(duration)}</span>
            </div>
          </div>
          
          <div className="col-span-12 sm:col-span-12 md:col-span-4 hidden md:flex items-center justify-end">
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleMute} 
                className="text-gray-300 hover:text-white p-1.5 rounded-full hover:bg-gray-800 transition-colors"
                aria-label={isMuted ? "Ativar som" : "Silenciar"}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <div className="relative w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
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
                onClick={(e) => toggleFavorite(currentSong?.id || "", e)}
                className={cn(
                  "p-1.5 rounded-full transition-colors",
                  currentSong && favorites.includes(currentSong.id) 
                    ? "text-pink-500 hover:text-pink-400" 
                    : "text-gray-400 hover:text-gray-200"
                )}
                aria-label={currentSong && favorites.includes(currentSong.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                disabled={!currentSong}
              >
                <Heart 
                  className="h-4 w-4" 
                  fill={currentSong && favorites.includes(currentSong.id) ? "currentColor" : "none"} 
                />
              </button>
              
              <button 
                onClick={(e) => currentSong && shareTrack(currentSong, e)}
                className="p-1.5 text-gray-400 hover:text-gray-200 rounded-full transition-colors"
                aria-label="Compartilhar"
                disabled={!currentSong}
              >
                <Share className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <button 
            onClick={() => {
              setShowFooterPlayer(false);
              globalShowFooterPlayer = false;
            }}
            className="absolute top-1 right-1 md:top-3 md:right-4 p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
            aria-label="Fechar player"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <style>
        {`
          @keyframes equalizer {
            0% { height: 20%; }
            100% { height: 80%; }
          }
          
          .audio-bar {
            width: 2px;
            background-color: #d1d5db;
            animation: equalizer 0.8s ease-in-out infinite alternate;
          }
          
          .animate-pulse-slow {
            animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
          
          .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default NativePlaylist;
