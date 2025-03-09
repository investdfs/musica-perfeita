
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MusicList from "@/components/music/MusicList";
import MusicPlayerMini from "@/components/music/MusicPlayerMini";
import { Music as MusicType } from "@/types/music";
import { Loader2 } from "lucide-react";

const NossasMusicas = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPlaying, setCurrentPlaying] = useState<MusicType | null>(null);
  const [musicList, setMusicList] = useState<MusicType[]>([]);
  
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
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao carregar músicas:", error);
        setIsLoading(false);
      }
    };
    
    fetchMusicList();
  }, []);
  
  const handlePlayMusic = (music: MusicType) => {
    setCurrentPlaying(music);
  };
  
  const handleStopMusic = () => {
    setCurrentPlaying(null);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-center sm:text-left">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
              Nossas Músicas
            </span>
          </h1>
          <div className="text-center sm:text-left text-gray-600 mb-8 max-w-3xl">
            <p className="text-lg mb-3">
              Aqui você encontra alguns exemplos das composições exclusivas criadas pela 
              equipe do Música Perfeita.
            </p>
            <p className="mb-3">
              Cada música foi cuidadosamente composta para atender a uma ocasião especial específica. 
              Estas são apenas algumas amostras do nosso trabalho - uma pequena demonstração 
              da nossa capacidade de criar músicas personalizadas.
            </p>
            <p className="font-medium text-purple-600">
              Para uma música personalizada para sua ocasião, 
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
