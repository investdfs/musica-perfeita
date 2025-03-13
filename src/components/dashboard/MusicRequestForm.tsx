
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

interface MusicRequestFormProps {
  userProfile: UserProfile;
  onRequestSubmitted: (newRequest: MusicRequest[]) => void;
  hasExistingRequest?: boolean;
}

const audioExplanationUrl = "https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/ElevenLabs_2025-03-04T15_03_46_ScheilaSMTy_pvc_s86_sb98_se25_b_m2.mp3";

const MusicRequestForm = ({ userProfile, onRequestSubmitted, hasExistingRequest = false }: MusicRequestFormProps) => {
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

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <FormIntroduction />
      
      <ImageUpload onImageSelected={handleImageSelected} />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <PersonInfoFields form={form} />
          <GenreSelector form={form} />
          <ToneAndVoiceFields form={form} />
          
          <IncludeNamesFields form={form} />
          <StoryField form={form} audioExplanationUrl={audioExplanationUrl} />
          <MusicFocusField form={form} />
          
          <HappyMemoryField form={form} />
          <SadMemoryField form={form} />
          <SubmitButton isSubmitting={isSubmitting} />
        </form>
      </Form>
    </div>
  );
};

export default MusicRequestForm;
