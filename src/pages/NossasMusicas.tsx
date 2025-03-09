
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MusicList from "@/components/music/MusicList";
import MusicPlayerMini from "@/components/music/MusicPlayerMini";
import { Music as MusicType } from "@/types/music";
import { Loader2 } from "lucide-react";
import supabase from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

const NossasMusicas = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPlaying, setCurrentPlaying] = useState<MusicType | null>(null);
  const [musicList, setMusicList] = useState<MusicType[]>([]);
  
  // Carregar lista de músicas do Supabase
  useEffect(() => {
    const fetchMusicList = async () => {
      setIsLoading(true);
      try {
        // Buscar músicas do banco de dados
        const { data, error } = await supabase
          .from('music_catalog')
          .select('*')
          .order('plays', { ascending: false });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setMusicList(data as MusicType[]);
        } else {
          // Fallback para dados de demonstração caso não haja músicas no banco
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
            // ... demais músicas de demonstração
          ];
          
          setMusicList(demoMusicList);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao carregar músicas:", error);
        toast({
          title: "Erro ao carregar músicas",
          description: "Não foi possível carregar a lista de músicas. Usando músicas de demonstração.",
          variant: "destructive",
        });
        
        // Usar músicas de demonstração em caso de erro
        const demoMusicList: MusicType[] = [
          {
            id: "1",
            title: "Declaração de Amor",
            artist: "Música Perfeita",
            duration: 210,
            coverUrl: "https://picsum.photos/id/64/200",
            audioUrl: "https://wp.novaenergiamg.com.br/wp-content/uploads/2021/01/beethoven-moonlight-sonata.wav",
            genre: "Romântica",
            plays: 1250,
          },
          // ... outras músicas de demonstração
        ];
        
        setMusicList(demoMusicList);
        setIsLoading(false);
      }
    };
    
    fetchMusicList();
    
    // Inscrever para atualizações em tempo real
    const musicChannel = supabase
      .channel('music_catalog_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'music_catalog' 
      }, () => {
        console.log('Music catalog changed, refreshing data...');
        fetchMusicList();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(musicChannel);
    };
  }, []);
  
  const handlePlayMusic = (music: MusicType) => {
    setCurrentPlaying(music);
    
    // Incrementar contagem de plays
    const updatePlays = async () => {
      try {
        await supabase
          .from('music_catalog')
          .update({ plays: music.plays + 1 })
          .eq('id', music.id);
      } catch (error) {
        console.error("Erro ao atualizar contagem de plays:", error);
      }
    };
    
    updatePlays();
  };
  
  const handleStopMusic = () => {
    setCurrentPlaying(null);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
              Nossas Músicas
            </span>
          </h1>
          <div className="text-center mb-8 max-w-3xl mx-auto">
            <p className="text-lg mb-6 px-4">
              Aqui você encontra alguns exemplos das composições exclusivas criadas pela 
              equipe do Música Perfeita. Cada música foi cuidadosamente composta para atender a uma ocasião especial específica. 
              Estas são apenas algumas amostras do nosso trabalho - uma pequena demonstração 
              da nossa capacidade de criar músicas personalizadas. Para uma música personalizada para sua ocasião, 
              não hesite em solicitar sua própria composição!
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : (
            <MusicList 
              musicList={musicList} 
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
