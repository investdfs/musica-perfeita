
import { useState } from "react";
import { Music } from "@/types/music";
import { formatTime } from "@/lib/formatTime";
import { Button } from "@/components/ui/button";
import { Play, Pause, Share2, Clock, BarChart2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MusicItemProps {
  music: Music;
  onPlay: (music: Music) => void;
  isPlaying: boolean;
  viewMode: "compact" | "expanded";
}

const MusicItem = ({ 
  music, 
  onPlay, 
  isPlaying,
  viewMode
}: MusicItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${music.title} - ${music.artist}`,
        text: `Escute "${music.title}" por ${music.artist} na Música Perfeita!`,
        url: window.location.href,
      }).catch((error) => {
        console.error('Erro ao compartilhar:', error);
      });
    } else {
      // Fallback para navegadores que não suportam a API Web Share
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({ 
          title: "Link copiado", 
          description: "URL copiada para a área de transferência" 
        });
      });
    }
  };

  return (
    <li 
      className={`
        ${isPlaying ? 'bg-purple-50' : 'hover:bg-gray-50'} 
        transition-colors relative
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center p-3 sm:p-4 gap-3">
        {/* Capa do álbum - Visível apenas no modo expandido */}
        {viewMode === "expanded" && (
          <div className="relative h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-md">
            <img 
              src={music.coverUrl} 
              alt={music.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            {(isHovered || isPlaying) && (
              <div 
                className="absolute inset-0 bg-black/30 flex items-center justify-center" 
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay(music);
                }}
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white h-8 w-8 rounded-full"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
              </div>
            )}
          </div>
        )}
        
        <div className="flex-grow min-w-0">
          <div className="flex items-center">
            {/* Botão Play/Pause para modo compacto */}
            {viewMode === "compact" && (
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-8 w-8 mr-2 ${isPlaying ? 'text-purple-600' : 'text-blue-500'}`}
                onClick={() => onPlay(music)}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
            )}
            
            <div className="truncate">
              <h3 className="font-medium text-sm sm:text-base truncate">{music.title}</h3>
              {viewMode === "expanded" && (
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {music.artist} • {music.genre}
                </p>
              )}
            </div>
          </div>
          
          {/* Informações adicionais visíveis apenas no modo expandido */}
          {viewMode === "expanded" && (
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <span className="flex items-center mr-3">
                <Clock className="h-3 w-3 mr-1 text-teal-500" />
                {formatTime(music.duration)}
              </span>
              <span className="flex items-center">
                <BarChart2 className="h-3 w-3 mr-1 text-indigo-500" />
                {music.plays.toLocaleString()} reproduções
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          {/* Duração para modo compacto */}
          {viewMode === "compact" && (
            <span className="text-xs text-gray-500 mr-2">
              {formatTime(music.duration)}
            </span>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-green-500 hover:text-green-600"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </li>
  );
};

export default MusicItem;
