
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NativePlaylist from "@/components/music/NativePlaylist";

const NossasMusicas = () => {
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
          
          {/* Nova playlist nativa */}
          <div className="w-full max-w-4xl mx-auto mt-8">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
                Playlist Nativa
              </span>
            </h3>
            <p className="text-center text-gray-600 mb-4 max-w-3xl mx-auto">
              Ouça nossa seleção de músicas criadas especialmente para diversas ocasiões.
              Uma experiência de reprodução fluida e rica diretamente no navegador.
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
