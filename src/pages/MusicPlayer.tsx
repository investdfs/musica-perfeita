
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
import { toast } from "@/hooks/use-toast";

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
      console.log("URL da música obtida dos parâmetros:", urlFromParams);
      setMusicUrl(urlFromParams);
    } else if (location.state?.musicUrl) {
      console.log("URL da música obtida do estado:", location.state.musicUrl);
      setMusicUrl(location.state.musicUrl);
    } else {
      // URL padrão para caso não haja nenhuma música especificada
      console.log("Usando URL padrão da música");
      setMusicUrl("https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/Rivers-End-1.wav");
    }
    
    // Buscar dados do pedido se tiver o ID
    if (requestIdFromParams || location.state?.requestId) {
      const requestId = requestIdFromParams || location.state?.requestId;
      console.log("Buscando dados do pedido com ID:", requestId);
      fetchRequestData(requestId);
    } else {
      console.log("Nenhum ID de pedido fornecido, carregando player sem dados do pedido");
      setLoading(false);
    }
  }, [location]);
  
  const fetchRequestData = async (requestId: string) => {
    try {
      console.log("Iniciando busca de dados do pedido...");
      
      const { data, error } = await supabase
        .from('music_requests')
        .select('*')
        .eq('id', requestId)
        .single();
        
      if (error) {
        console.error("Erro ao buscar dados do pedido:", error);
        toast({
          title: "Erro ao carregar",
          description: "Não foi possível obter os detalhes completos da música, mas você ainda pode ouvi-la.",
          variant: "destructive",
        });
        
        // Permitir que o player continue mesmo sem os dados do pedido
        setLoading(false);
        return;
      }
      
      if (data) {
        console.log("Dados do pedido obtidos com sucesso:", data);
        try {
          // Usar a função utilitária para validar os tipos enumerados
          const validatedRequest = validateMusicRequest(data);
          setRequestData(validatedRequest);
        } catch (validationError) {
          console.error("Erro ao validar dados do pedido:", validationError);
          toast({
            title: "Aviso",
            description: "Alguns detalhes da música podem não estar disponíveis.",
            variant: "default",
          });
          
          // Tentar uma nova abordagem: validar campos individualmente
          // para evitar erros de tipo que possam impedir o funcionamento
          setRequestData(null); // Limpar dados atuais
          
          // Aplicar tratamento de dados diretamente aqui
          setTimeout(() => {
            try {
              // Usar validação individual de campos para garantir compatibilidade
              const safeData = {
                ...data,
                relationship_type: validateMusicRequest(data).relationship_type,
                music_genre: validateMusicRequest(data).music_genre,
                status: validateMusicRequest(data).status,
                payment_status: validateMusicRequest(data).payment_status
              } as MusicRequest;
              
              setRequestData(safeData);
            } catch (e) {
              console.error("Falha na validação final:", e);
              // Em último caso, definir como null para não bloquear o player
              setRequestData(null);
            }
          }, 0);
        }
      } else {
        console.log("Nenhum dado encontrado para o pedido");
        toast({
          title: "Informação não encontrada",
          description: "Os detalhes desta música não estão disponíveis, mas você ainda pode ouvi-la.",
          variant: "default",
        });
      }
    } catch (err) {
      console.error("Erro geral ao buscar dados do pedido:", err);
      toast({
        title: "Erro",
        description: "Ocorreu um problema ao carregar os detalhes. Você ainda pode ouvir a prévia.",
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
