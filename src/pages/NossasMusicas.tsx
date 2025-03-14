
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MusicList from "@/components/music/MusicList";
import { useState } from "react";
import { Music, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ScrollToTopButton from "@/components/ui/scroll-to-top";
import { Music as MusicType } from "@/types/music";
import VisitorCounter from "@/components/VisitorCounter";

const NossasMusicas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPlaying, setCurrentPlaying] = useState<MusicType | null>(null);
  
  // Lista de exemplo de músicas
  const musicList: MusicType[] = [
    {
      id: "1",
      title: "Amor Eterno",
      artist: "Maria e João",
      duration: 205, // 3:25
      coverUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=250&auto=format&fit=crop",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      genre: "Romântica",
      plays: 1254,
      created_at: "2023-11-15"
    },
    {
      id: "2",
      title: "Momentos Especiais",
      artist: "Carlos & Ana",
      duration: 182, // 3:02
      coverUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=250&auto=format&fit=crop",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      genre: "Pop",
      plays: 983,
      created_at: "2023-12-05"
    },
    {
      id: "3",
      title: "Aniversário de Amor",
      artist: "Dueto Perfeito",
      duration: 224, // 3:44
      coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=250&auto=format&fit=crop",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      genre: "Balada",
      plays: 1578,
      created_at: "2024-01-20"
    }
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

          {/* Seção Superior com informações sobre nossas composições */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center text-purple-800 mb-8">Sobre Nossas Composições</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-pink-50 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-pink-600 mb-3">Criação 100% Única</h3>
                <p className="text-gray-700">
                  Cada música é completamente original e criada especificamente para capturar a essência da sua história e sentimentos.
                </p>
              </div>
              
              <div className="bg-pink-50 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-pink-600 mb-3">Tecnologia Avançada</h3>
                <p className="text-gray-700">
                  Utilizamos inteligência artificial de última geração para compor melodias, harmonias e letras personalizadas.
                </p>
              </div>
              
              <div className="bg-pink-50 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-pink-600 mb-3">Variedade de Estilos</h3>
                <p className="text-gray-700">
                  Oferecemos diversos gêneros musicais, desde baladas românticas até músicas animadas e contemporâneas.
                </p>
              </div>
            </div>
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
