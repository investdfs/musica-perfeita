
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { UserProfile, MusicRequest } from "@/types/database.types";
import ImageUpload from "./ImageUpload";
import FormIntroduction from "./FormIntroduction";
import PersonInfoFields from "./PersonInfoFields";
import GenreSelector from "./GenreSelector";
import ToneAndVoiceFields from "./ToneAndVoiceFields";
import IncludeNamesFields from "./IncludeNamesFields";
import StoryField from "./StoryField";
import SubmitButton from "./SubmitButton";
import MusicFocusField from "./MusicFocusField";
import HappyMemoryField from "./HappyMemoryField";
import SadMemoryField from "./SadMemoryField";
import { musicRequestSchema, MusicRequestFormValues } from "./formSchema";
import { submitMusicRequest } from "./utils/requestSubmission";
import type { EnhancedError } from "./utils/errorHandling";
import { toast } from "@/hooks/use-toast";
import { showErrorToast } from "./utils/errorHandling";
import { CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MusicRequestFormProps {
  userProfile: UserProfile;
  onRequestSubmitted: (newRequest: MusicRequest[]) => void;
  hasExistingRequest?: boolean;
  onCancel?: () => void;
}

const audioExplanationUrl = "https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/ElevenLabs_2025-03-04T15_03_46_ScheilaSMTy_pvc_s86_sb98_se25_b_m2.mp3";

const MusicRequestForm = ({ 
  userProfile, 
  onRequestSubmitted, 
  hasExistingRequest = false,
  onCancel 
}: MusicRequestFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const submitAttemptRef = useRef(0);
  
  const form = useForm<MusicRequestFormValues>({
    resolver: zodResolver(musicRequestSchema),
    defaultValues: {
      honoree_name: "",
      relationship_type: undefined,
      custom_relationship: null,
      music_genre: undefined,
      music_tone: undefined,
      voice_type: undefined,
      include_names: false,
      names_to_include: "",
      story: "",
      music_focus: "",
      happy_memory: "",
      sad_memory: ""
    },
  });

  // Limpar o estado de submissão ao desmontar
  useEffect(() => {
    return () => {
      setIsSubmitting(false);
    };
  }, []);

  const handleImageSelected = (file: File) => {
    setCoverImage(file);
  };

  const onSubmit = async (values: MusicRequestFormValues) => {
    console.log("[MusicRequestForm] Formulário enviado, valores:", values);
    
    // Verificar se já está em processo de submissão
    if (isSubmitting) {
      console.log("[MusicRequestForm] Já está submetendo, retornando");
      return;
    }
    
    submitAttemptRef.current += 1;
    const currentAttempt = submitAttemptRef.current;
    console.log(`[MusicRequestForm] Iniciando processo de submissão (tentativa ${currentAttempt})`);
    
    // Definir o estado de submissão imediatamente
    setIsSubmitting(true);
    
    try {
      console.log("[MusicRequestForm] Iniciando submissão do formulário", { values, userProfile });
      
      // Garantir que temos um userProfile válido
      if (!userProfile?.id) {
        throw new Error("Perfil de usuário inválido. Tente fazer login novamente.");
      }
      
      const data = await submitMusicRequest(values, userProfile, coverImage);
      console.log("[MusicRequestForm] Submissão do formulário concluída com sucesso", data);
      
      // Verificar se temos dados válidos
      if (Array.isArray(data) && data.length > 0) {
        // Notificar o componente pai sobre a submissão bem-sucedida
        onRequestSubmitted(data);
        
        // Mostrar toast de sucesso
        toast({
          title: "Sucesso!",
          description: "Seu pedido foi enviado com sucesso. Aguarde enquanto processamos sua solicitação.",
        });
        
        // Limpar o formulário após o envio bem-sucedido
        form.reset();
        setCoverImage(null);
      } else {
        console.error("[MusicRequestForm] Dados retornados inválidos:", data);
        throw new Error("Não foi possível processar seu pedido. Resposta inválida do servidor.");
      }
    } catch (error: any) {
      console.error("[MusicRequestForm] Erro na submissão do formulário:", error);
      
      // Usar a função de exibição de toast de erro especializada
      showErrorToast(error as EnhancedError);
    } finally {
      // Limpar o estado de submissão apenas se for a tentativa atual
      if (currentAttempt === submitAttemptRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  // Verificar quais campos foram preenchidos corretamente
  const completedFields = {
    personalInfo: Boolean(form.watch('honoree_name') && form.watch('relationship_type')),
    musicPreferences: Boolean(form.watch('music_genre') && form.watch('music_tone') && form.watch('voice_type')),
    story: form.watch('story')?.length >= 50,
    additionalInfo: Boolean(
      (form.watch('music_focus') && form.watch('music_focus').length >= 10) || 
      (form.watch('happy_memory') && form.watch('happy_memory').length >= 10) || 
      (form.watch('sad_memory') && form.watch('sad_memory').length >= 10)
    )
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-lg p-8 border border-purple-100 relative">
      {/* Botão de cancelar no canto superior direito */}
      {onCancel && (
        <Button 
          onClick={onCancel}
          variant="outline" 
          size="sm"
          className="absolute top-4 right-4 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 flex items-center shadow-sm"
        >
          <X className="h-4 w-4 mr-1" />
          Cancelar pedido
        </Button>
      )}
      
      <FormIntroduction />
      
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-purple-100">
        <ImageUpload onImageSelected={handleImageSelected} />
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100 transition-all hover:shadow-md">
            <div className="flex items-center mb-4">
              <h3 className="text-xl font-semibold text-purple-800">Informações Pessoais</h3>
              {completedFields.personalInfo && (
                <div className="ml-2 flex items-center text-green-500">
                  <CheckCircle className="h-5 w-5" />
                </div>
              )}
            </div>
            <PersonInfoFields form={form} />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100 transition-all hover:shadow-md">
            <div className="flex items-center mb-4">
              <h3 className="text-xl font-semibold text-purple-800">Preferências Musicais</h3>
              {completedFields.musicPreferences && (
                <div className="ml-2 flex items-center text-green-500">
                  <CheckCircle className="h-5 w-5" />
                </div>
              )}
            </div>
            <GenreSelector form={form} />
            <div className="mt-6">
              <ToneAndVoiceFields form={form} />
            </div>
            <div className="mt-6">
              <IncludeNamesFields form={form} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100 transition-all hover:shadow-md">
            <div className="flex items-center mb-4">
              <h3 className="text-xl font-semibold text-purple-800">Sua História</h3>
              {completedFields.story && (
                <div className="ml-2 flex items-center text-green-500">
                  <CheckCircle className="h-5 w-5" />
                </div>
              )}
            </div>
            <StoryField form={form} audioExplanationUrl={audioExplanationUrl} />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-100 transition-all hover:shadow-md">
            <div className="flex items-center mb-4">
              <h3 className="text-xl font-semibold text-purple-800">Detalhes Adicionais</h3>
              {completedFields.additionalInfo && (
                <div className="ml-2 flex items-center text-green-500">
                  <CheckCircle className="h-5 w-5" />
                </div>
              )}
            </div>
            <div className="space-y-6">
              <MusicFocusField form={form} />
              <HappyMemoryField form={form} />
              <SadMemoryField form={form} />
            </div>
          </div>
          
          <div className="pt-4">
            <SubmitButton isSubmitting={isSubmitting} />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MusicRequestForm;
