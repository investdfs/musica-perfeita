
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MusicList from "@/components/music/MusicList";
import MusicPlayerMini from "@/components/music/MusicPlayerMini";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Music as MusicType } from "@/types/music";
import { Loader2 } from "lucide-react";

const NossasMusicas = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPlaying, setCurrentPlaying] = useState<MusicType | null>(null);
  const [musicList, setMusicList] = useState<MusicType[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { theme } = useTheme();
  
  // Carregar lista de músicas (simulado)
  useEffect(() => {
    const fetchMusicList = async () => {
      try {
        // Simulando carregamento de dados
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dados de exemplo
        const demoMusicList: MusicType[] = [
          {
            id: "1",
            title: "Declaração de Amor",
            artist: "Música Perfeita",
            duration: 210, // em segundos
            coverUrl: "https://picsum.photos/id/64/200",
            audioUrl: "https://wp.novaenergiamg.com.br/wp-content/uploads/2021/01/beethoven-moonlight-sonata.wav",
            genre: "Romântica",
            plays: 1250,
          },
          {
            id: "2",
            title: "Aniversário Especial",
            artist: "Música Perfeita",
            duration: 180,
            coverUrl: "https://picsum.photos/id/65/200",
            audioUrl: "https://wp.novaenergiamg.com.br/wp-content/uploads/2021/01/beethoven-moonlight-sonata.wav",
            genre: "Celebração",
            plays: 980,
          },
          {
            id: "3",
            title: "Pedido de Casamento",
            artist: "Música Perfeita",
            duration: 240,
            coverUrl: "https://picsum.photos/id/68/200",
            audioUrl: "https://wp.novaenergiamg.com.br/wp-content/uploads/2021/01/beethoven-moonlight-sonata.wav",
            genre: "Romântica",
            plays: 1870,
          },
          {
            id: "4",
            title: "Homenagem aos Pais",
            artist: "Música Perfeita",
            duration: 190,
            coverUrl: "https://picsum.photos/id/42/200",
            audioUrl: "https://wp.novaenergiamg.com.br/wp-content/uploads/2021/01/beethoven-moonlight-sonata.wav",
            genre: "Família",
            plays: 750,
          },
          {
            id: "5",
            title: "Notas de Gratidão",
            artist: "Música Perfeita",
            duration: 205,
            coverUrl: "https://picsum.photos/id/41/200",
            audioUrl: "https://wp.novaenergiamg.com.br/wp-content/uploads/2021/01/beethoven-moonlight-sonata.wav",
            genre: "Gratidão",
            plays: 625,
          },
          {
            id: "6",
            title: "Homenagem a Amigos",
            artist: "Música Perfeita",
            duration: 195,
            coverUrl: "https://picsum.photos/id/82/200",
            audioUrl: "https://wp.novaenergiamg.com.br/wp-content/uploads/2021/01/beethoven-moonlight-sonata.wav",
            genre: "Amizade",
            plays: 530,
          },
          {
            id: "7",
            title: "Pedido de Desculpas",
            artist: "Música Perfeita",
            duration: 215,
            coverUrl: "https://picsum.photos/id/26/200",
            audioUrl: "https://wp.novaenergiamg.com.br/wp-content/uploads/2021/01/beethoven-moonlight-sonata.wav",
            genre: "Reconciliação",
            plays: 480,
          },
        ];
        
        setMusicList(demoMusicList);
        
        // Carregar favoritos do localStorage
        const savedFavorites = localStorage.getItem('musicaperfeita_favorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao carregar músicas:", error);
        setIsLoading(false);
      }
    };
    
    fetchMusicList();
  }, []);
  
  // Salvar favoritos no localStorage quando mudar
  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem('musicaperfeita_favorites', JSON.stringify(favorites));
    }
  }, [favorites]);
  
  const toggleFavorite = (musicId: string) => {
    setFavorites(prev => {
      if (prev.includes(musicId)) {
        return prev.filter(id => id !== musicId);
      } else {
        return [...prev, musicId];
      }
    });
  };
  
  const handlePlayMusic = (music: MusicType) => {
    setCurrentPlaying(music);
  };
  
  const handleStopMusic = () => {
    setCurrentPlaying(null);
  };
  
  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-center sm:text-left">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
              Nossas Músicas
            </span>
          </h1>
          <p className="text-center sm:text-left text-gray-500 dark:text-gray-400 mb-6">
            Ouça nossas composições exclusivas e personalizadas
          </p>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : (
            <MusicList 
              musicList={musicList} 
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onPlayMusic={handlePlayMusic}
              currentPlaying={currentPlaying}
            />
          )}
        </section>
      </main>
      
      {currentPlaying && (
        <MusicPlayerMini 
          music={currentPlaying}
          onClose={handleStopMusic}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default NossasMusicas;
