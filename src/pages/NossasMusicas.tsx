
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MusicList from "@/components/music/MusicList";
import { useState } from "react";
import { Music, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ScrollToTopButton from "@/components/ui/scroll-to-top";
import { Music as MusicType } from "@/types/music";

const NossasMusicas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPlaying, setCurrentPlaying] = useState<MusicType | null>(null);
  
  // Lista de exemplo de músicas
  const musicList: MusicType[] = [
    // Como exemplo, deixamos a lista vazia para ser preenchida posteriormente
    // Quando o sistema tiver músicas reais, elas serão carregadas aqui
  ];

  const handlePlayMusic = (music: MusicType) => {
    setCurrentPlaying(music);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      <Header />
      <main className="flex-grow py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-full mb-4">
              <Music className="h-8 w-8 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Nossas Músicas</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore exemplos do nosso trabalho. Cada música foi criada com cuidado para capturar 
              os sentimentos e histórias únicas de nossos clientes.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por gênero, título ou artista..."
                className="pl-10 py-6 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <MusicList 
            musicList={musicList} 
            onPlayMusic={handlePlayMusic} 
            currentPlaying={currentPlaying} 
          />
        </div>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default NossasMusicas;
