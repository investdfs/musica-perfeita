
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { MusicRequest } from "@/types/database.types";
import MusicPlayerHeader from "@/components/music/MusicPlayerHeader";
import MusicPlayerMain from "@/components/music/MusicPlayerMain";
import ScrollToTopButton from "@/components/ui/scroll-to-top-button";

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
        // Garantir que relationship_type seja um dos valores permitidos
        const validRelationshipTypes = [
          'esposa', 'noiva', 'namorada', 'amigo_especial', 'partner', 
          'friend', 'family', 'colleague', 'mentor', 'child', 
          'sibling', 'parent', 'other'
        ] as const;
        
        // Garantir que music_genre seja um dos valores permitidos
        const validMusicGenres = [
          'romantic', 'mpb', 'classical', 'jazz', 'hiphop', 
          'rock', 'country', 'reggae', 'electronic', 'samba', 'folk', 'pop'
        ] as const;
        
        // Garantir que music_tone seja um dos valores permitidos
        const validMusicTones = [
          'happy', 'romantic', 'nostalgic', 'fun', 'melancholic', 'energetic', 
          'peaceful', 'inspirational', 'dramatic', 'uplifting', 'reflective', 'mysterious'
        ] as const;
        
        // Garantir que voice_type seja um dos valores permitidos
        const validVoiceTypes = [
          'male', 'female', 'male_romantic', 'female_romantic', 
          'male_folk', 'female_folk', 'male_deep', 'female_powerful', 
          'male_soft', 'female_sweet', 'male_jazzy', 'female_jazzy', 
          'male_rock', 'female_rock', 'male_country', 'female_country'
        ] as const;
        
        // Garantir que status seja um dos valores permitidos
        const validStatusTypes = [
          'pending', 'in_production', 'completed'
        ] as const;
        
        // Verificar se os valores recebidos são válidos
        const relationshipType = validRelationshipTypes.includes(data.relationship_type as any) 
          ? data.relationship_type as MusicRequest['relationship_type']
          : 'other';
          
        const musicGenre = validMusicGenres.includes(data.music_genre as any) 
          ? data.music_genre as MusicRequest['music_genre']
          : 'pop';
          
        const musicTone = data.music_tone && validMusicTones.includes(data.music_tone as any)
          ? data.music_tone as MusicRequest['music_tone']
          : undefined;
          
        const voiceType = data.voice_type && validVoiceTypes.includes(data.voice_type as any)
          ? data.voice_type as MusicRequest['voice_type']
          : undefined;
          
        const status = validStatusTypes.includes(data.status as any)
          ? data.status as MusicRequest['status']
          : 'pending';
        
        // Criar objeto tipado corretamente
        const typedRequest: MusicRequest = {
          ...data,
          relationship_type: relationshipType,
          music_genre: musicGenre,
          music_tone: musicTone,
          voice_type: voiceType,
          status: status
        };
        
        setRequestData(typedRequest);
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
