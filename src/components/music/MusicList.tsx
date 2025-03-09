
import { useState } from "react";
import { Music } from "@/types/music";
import MusicItem from "./MusicItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, HeartIcon, Music2 } from "lucide-react";

interface MusicListProps {
  musicList: Music[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onPlayMusic: (music: Music) => void;
  currentPlaying: Music | null;
}

const MusicList = ({ 
  musicList, 
  favorites, 
  onToggleFavorite, 
  onPlayMusic, 
  currentPlaying 
}: MusicListProps) => {
  const [viewMode, setViewMode] = useState<"compact" | "expanded">("expanded");
  const [filter, setFilter] = useState<"all" | "favorites">("all");
  
  const filteredMusic = filter === "favorites" 
    ? musicList.filter(music => favorites.includes(music.id))
    : musicList;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
            className="font-medium"
          >
            <Music2 className="h-4 w-4 mr-1 text-blue-500" />
            Todas
          </Button>
          <Button
            variant={filter === "favorites" ? "default" : "outline"}
            onClick={() => setFilter("favorites")}
            size="sm"
            className="font-medium"
          >
            <HeartIcon className="h-4 w-4 mr-1 text-pink-500" />
            Favoritas
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setViewMode(viewMode === "compact" ? "expanded" : "compact")}
          className="text-purple-600"
        >
          {viewMode === "compact" ? (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Expandir
            </>
          ) : (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Compactar
            </>
          )}
        </Button>
      </div>
      
      <ScrollArea className="h-[calc(100vh-20rem)] min-h-[400px]">
        {filteredMusic.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <HeartIcon className="h-12 w-12 mb-2 stroke-1 text-pink-500" />
            <p className="text-lg">Você ainda não tem favoritos</p>
            <p className="text-sm">Marque músicas como favoritas para vê-las aqui</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredMusic.map((music) => (
              <MusicItem 
                key={music.id}
                music={music}
                isFavorite={favorites.includes(music.id)}
                onToggleFavorite={onToggleFavorite}
                onPlay={onPlayMusic}
                isPlaying={currentPlaying?.id === music.id}
                viewMode={viewMode}
              />
            ))}
          </ul>
        )}
      </ScrollArea>
    </div>
  );
};

export default MusicList;
