
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { MusicRequest } from "@/types/database.types";
import MusicPlayerHeader from "@/components/music/MusicPlayerHeader";
import MusicPlayerMain from "@/components/music/MusicPlayerMain";
import ScrollToTopButton from "@/components/ui/scroll-to-top-button";
import { validateMusicRequest } from "@/utils/validationUtils";

const MusicPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [musicUrl, setMusicUrl] = useState<string>("");
  const [requestData, setRequestData] = useState<MusicRequest | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Obter a URL da música dos parâmetros da URL ou do estado da rota
    const params = new URLSearchParams(location.search);
    const urlFromParams = params.get("url");
    const requestIdFromParams = params.get("requestId");
    
    if (urlFromParams) {
      setMusicUrl(urlFromParams);
    } else if (location.state?.musicUrl) {
      setMusicUrl(location.state.musicUrl);
    } else {
      // URL padrão para caso não haja nenhuma música especificada
      setMusicUrl("https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/Rivers-End-1.wav");
    }
    
    // Buscar dados do pedido se tiver o ID
    if (requestIdFromParams || location.state?.requestId) {
      fetchRequestData(requestIdFromParams || location.state?.requestId);
    } else {
      setLoading(false);
    }
  }, [location]);
  
  const fetchRequestData = async (requestId: string) => {
    try {
      const { data, error } = await supabase
        .from('music_requests')
        .select('*')
        .eq('id', requestId)
        .single();
        
      if (error) {
        console.error("Erro ao buscar dados do pedido:", error);
      } else if (data) {
        // Usar a função utilitária para validar os tipos enumerados
        const validatedRequest = validateMusicRequest(data);
        setRequestData(validatedRequest);
      }
    } catch (err) {
      console.error("Erro ao buscar dados do pedido:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <MusicPlayerMain 
        musicUrl={musicUrl} 
        requestData={requestData} 
        loading={loading}
        navigate={navigate}
      />
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default MusicPlayer;
