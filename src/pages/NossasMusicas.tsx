
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NativePlaylist, { AudioFooterPlayer } from "@/components/music/NativePlaylist";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const NossasMusicas = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />
      
      <main className="flex-grow container mx-auto px-3 sm:px-4 py-6 sm:py-8 pb-24">
        <section className="mb-10 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-center text-purple-800">{t("music.title")}</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-purple-50 p-5 rounded-lg">
              <h3 className="font-medium text-lg mb-2 text-purple-700">{t("music.creation")}</h3>
              <p className="text-gray-700">
                {t("music.creation_desc")}
              </p>
            </div>
            <div className="bg-pink-50 p-5 rounded-lg">
              <h3 className="font-medium text-lg mb-2 text-pink-700">{t("music.technology")}</h3>
              <p className="text-gray-700">
                {t("music.technology_desc")}
              </p>
            </div>
            <div className="bg-yellow-50 p-5 rounded-lg">
              <h3 className="font-medium text-lg mb-2 text-yellow-700">{t("music.variety")}</h3>
              <p className="text-gray-700">
                {t("music.variety_desc")}
              </p>
            </div>
          </div>
        </section>
        
        <section className="mb-6 sm:mb-8">
          <div className="w-full max-w-4xl mx-auto mt-4 sm:mt-8">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center text-gray-800">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
                {t("music.playlist_title")}
              </span>
            </h3>
            <p className="text-center text-sm sm:text-base text-gray-600 mb-4 max-w-3xl mx-auto px-4">
              {t("music.playlist_desc")}
            </p>
            <NativePlaylist className="mb-4" />
          </div>
        </section>
        
        <section className="max-w-4xl mx-auto mt-12 text-center">
          <h3 className="text-2xl font-semibold mb-4 text-purple-800">
            {t("music.ready")}
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            {t("music.ready_desc")}
          </p>
          <Link to="/cadastro">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              {t("music.create_button")} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </section>
      </main>
      
      {/* Player global de áudio no rodapé da página com tema escuro */}
      <AudioFooterPlayer />
      
      <Footer />
    </div>
  );
};

export default NossasMusicas;
