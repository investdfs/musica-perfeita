
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigateFunction } from "react-router-dom";
import { MusicRequest } from "@/types/database.types";
import { toast } from "@/hooks/use-toast";

interface ActionButtonProps {
  navigate: NavigateFunction;
  musicRequest?: MusicRequest;
}

const ActionButton = ({ navigate, musicRequest }: ActionButtonProps) => {
  // Funções auxiliares para validar que os valores correspondem aos tipos enumerados esperados
  const validateRelationshipType = (value: string): MusicRequest['relationship_type'] => {
    const validTypes = ['esposa', 'noiva', 'namorada', 'amigo_especial', 'partner', 'friend', 'family', 'colleague', 'mentor', 'child', 'sibling', 'parent', 'other'];
    return validTypes.includes(value) ? value as MusicRequest['relationship_type'] : 'other';
  };
  
  const validateMusicGenre = (value: string): MusicRequest['music_genre'] => {
    const validGenres = ['romantic', 'mpb', 'classical', 'jazz', 'hiphop', 'rock', 'country', 'reggae', 'electronic', 'samba', 'folk', 'pop'];
    return validGenres.includes(value) ? value as MusicRequest['music_genre'] : 'pop';
  };
  
  const validateMusicTone = (value?: string): MusicRequest['music_tone'] | undefined => {
    if (!value) return undefined;
    const validTones = ['happy', 'romantic', 'nostalgic', 'fun', 'melancholic', 'energetic', 'peaceful', 'inspirational', 'dramatic', 'uplifting', 'reflective', 'mysterious'];
    return validTones.includes(value) ? value as MusicRequest['music_tone'] : 'happy';
  };
  
  const validateVoiceType = (value?: string): MusicRequest['voice_type'] | undefined => {
    if (!value) return undefined;
    const validVoices = ['male', 'female', 'male_romantic', 'female_romantic', 'male_folk', 'female_folk', 'male_deep', 'female_powerful', 'male_soft', 'female_sweet', 'male_jazzy', 'female_jazzy', 'male_rock', 'female_rock', 'male_country', 'female_country'];
    return validVoices.includes(value) ? value as MusicRequest['voice_type'] : 'male';
  };
  
  const validateStatus = (value: string): MusicRequest['status'] => {
    const validStatuses = ['pending', 'in_production', 'completed'];
    return validStatuses.includes(value) ? value as MusicRequest['status'] : 'pending';
  };
  
  const validatePaymentStatus = (value?: string | null): 'pending' | 'completed' | null => {
    if (!value) return null;
    return value === 'completed' ? 'completed' : 'pending';
  };

  const handleNavigation = () => {
    if (!musicRequest) {
      toast({
        title: "Erro",
        description: "Não foi possível obter os detalhes da música",
        variant: "destructive",
      });
      return;
    }
    
    // Validar os tipos enumerados antes de armazenar/navegar
    const validatedRequest: MusicRequest = {
      ...musicRequest,
      relationship_type: validateRelationshipType(musicRequest.relationship_type),
      music_genre: validateMusicGenre(musicRequest.music_genre),
      music_tone: validateMusicTone(musicRequest.music_tone),
      voice_type: validateVoiceType(musicRequest.voice_type),
      status: validateStatus(musicRequest.status),
      payment_status: validatePaymentStatus(musicRequest.payment_status)
    };
    
    // Armazenar os dados do pedido no localStorage para recuperação em caso de perda durante a navegação
    try {
      localStorage.setItem("current_music_request", JSON.stringify(validatedRequest));
      console.log("Navegando para pagamento com dados:", validatedRequest);
      
      // Usar navigate com replace para evitar problemas de histórico de navegação
      navigate("/pagamento", { 
        state: { musicRequest: validatedRequest },
        replace: true 
      });
    } catch (error) {
      console.error("Erro ao processar navegação:", error);
      toast({
        title: "Erro de navegação",
        description: "Houve um problema ao redirecionar. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center mb-8">
      <Button 
        onClick={handleNavigation} 
        className="group relative bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all text-lg overflow-hidden"
      >
        <span className="flex items-center relative z-10">
          Liberar Música Completa
          <ChevronRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
        </span>
        <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
      </Button>
    </div>
  );
};

export default ActionButton;
