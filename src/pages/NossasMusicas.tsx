
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
