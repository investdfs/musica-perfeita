
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";
import NativePlaylist from "@/components/music/NativePlaylist";

const NossasMusicas = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  const handleIframeLoad = () => {
    setIsLoading(false);
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
          
          <div className="w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg relative mb-8">
            {isLoading && (
              <div className="absolute inset-0 flex justify-center items-center bg-white/80 z-10">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            )}
            
            <div className="w-full">
              {/* Ajuste de altura conforme dispositivo para melhorar visualização */}
              <div className="aspect-[16/9] w-full">
                <iframe 
                  width="100%" 
                  height="100%" 
                  scrolling="no" 
                  frameBorder="no" 
                  allow="autoplay" 
                  src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1982385924&color=%23ff5500&auto_play=false&hide_related=true&show_comments=true&show_user=true&show_reposts=false&show_teaser=false&visual=true"
                  onLoad={handleIframeLoad}
                  className="w-full h-full"
                  title="Playlist Música Perfeita"
                ></iframe>
              </div>
            </div>
            
            <div className="bg-gray-100 p-3 text-xs text-gray-500 border-t border-gray-200">
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                <a 
                  href="https://soundcloud.com/musicaperfeita" 
                  title="Música Perfeita 🎶" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                >
                  Música Perfeita 🎶
                </a> · 
                <a 
                  href="https://soundcloud.com/musicaperfeita/sets/musica-perfeita" 
                  title="Música Perfeita" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-purple-600 transition-colors ml-1"
                >
                  Música Perfeita
                </a>
              </div>
            </div>
          </div>

          {/* Adicionar versão alternativa do player para dispositivos móveis */}
          <div className="w-full max-w-4xl mx-auto mt-6 rounded-lg overflow-hidden shadow-lg md:hidden">
            <h3 className="text-lg font-medium mb-2 text-center text-gray-700">Versão Alternativa para Dispositivos Móveis</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <a 
                href="https://soundcloud.com/musicaperfeita/sets/musica-perfeita" 
                target="_blank"
                rel="noopener noreferrer" 
                className="block w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-lg text-center hover:opacity-90 transition-opacity"
              >
                Ouvir Playlist no SoundCloud
              </a>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Se o player acima não mostrar todas as faixas corretamente, clique no botão para acessar a playlist completa diretamente no SoundCloud.
              </p>
            </div>
          </div>
          
          {/* Nova playlist nativa */}
          <div className="w-full max-w-4xl mx-auto mt-8">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
                Playlist Nativa
              </span>
            </h3>
            <p className="text-center text-gray-600 mb-4 max-w-3xl mx-auto">
              Experimente nosso player de música nativo com recursos avançados. 
              Uma experiência de reprodução mais fluida e rica diretamente no navegador.
            </p>
            <NativePlaylist className="mb-4" />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default NossasMusicas;
