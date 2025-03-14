
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
    // Verificar se temos dados no estado ou localStorage
    const checkStoredData = () => {
      const storedRequest = localStorage.getItem("current_music_request");
      if (location.state?.musicRequest) {
        console.log("Usando dados do state para o pedido:", location.state.musicRequest);
        setRequestData(validateMusicRequest(location.state.musicRequest));
        return true;
      } else if (storedRequest) {
        try {
          const parsedRequest = JSON.parse(storedRequest);
          console.log("Recuperando dados do localStorage:", parsedRequest);
          setRequestData(validateMusicRequest(parsedRequest));
          return true;
        } catch (e) {
          console.error("Erro ao processar dados armazenados:", e);
          localStorage.removeItem("current_music_request");
        }
      }
      return false;
    };
    
    // Obter a URL da música dos parâmetros da URL ou do estado da rota
    const params = new URLSearchParams(location.search);
    const urlFromParams = params.get("url");
    const requestIdFromParams = params.get("requestId");
    
    if (urlFromParams) {
      console.log("URL da música obtida dos parâmetros:", urlFromParams);
      setMusicUrl(urlFromParams);
    } else if (location.state?.musicUrl) {
      console.log("URL da música obtida do state:", location.state.musicUrl);
      setMusicUrl(location.state.musicUrl);
    } else {
      // URL padrão para caso não haja nenhuma música especificada
      console.log("Usando URL padrão da música");
      setMusicUrl("https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/Rivers-End-1.wav");
    }
    
    // Primeiro tenta usar dados armazenados
    const hasStoredData = checkStoredData();
    
    // Se não tiver dados armazenados e tiver ID do pedido, busca do banco
    if (!hasStoredData && (requestIdFromParams || location.state?.requestId)) {
      fetchRequestData(requestIdFromParams || location.state?.requestId);
    } else if (!hasStoredData) {
      console.log("Nenhum dado disponível para o pedido, definindo loading como false");
      setLoading(false);
    } else {
      console.log("Dados obtidos do armazenamento, definindo loading como false");
      setLoading(false);
    }
  }, [location]);
  
  const fetchRequestData = async (requestId: string) => {
    try {
      console.log("Buscando dados do pedido ID:", requestId);
      
      const { data, error } = await supabase
        .from('music_requests')
        .select('*')
        .eq('id', requestId)
        .single();
        
      if (error) {
        console.error("Erro ao buscar dados do pedido:", error);
        setLoading(false);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os detalhes da música",
          variant: "destructive",
        });
      } else if (data) {
        console.log("Dados do pedido recuperados:", data);
        try {
          // Usar a função utilitária para validar os tipos enumerados
          const validatedRequest = validateMusicRequest(data);
          setRequestData(validatedRequest);
          
          // Armazenar também no localStorage para recuperação em caso de recarregamento
          localStorage.setItem("current_music_request", JSON.stringify(validatedRequest));
        } catch (err) {
          console.error("Erro ao validar dados do pedido:", err);
          toast({
            title: "Erro nos dados",
            description: "Os dados da música estão em formato incorreto",
            variant: "destructive",
          });
        }
      } else {
        console.log("Nenhum dado encontrado para o ID do pedido:", requestId);
        toast({
          title: "Música não encontrada",
          description: "Não foi possível encontrar a música solicitada",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Erro ao buscar dados do pedido:", err);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor",
        variant: "destructive",
      });
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
