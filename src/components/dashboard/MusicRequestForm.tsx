
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
import { submitMusicRequest } from "./formUtils";
import { toast } from "@/hooks/use-toast";

interface MusicRequestFormProps {
  userProfile: UserProfile;
  onRequestSubmitted: (newRequest: any) => void;
  hasExistingRequest?: boolean;
}

const audioExplanationUrl = "https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/ElevenLabs_2025-03-04T15_03_46_ScheilaSMTy_pvc_s86_sb98_se25_b_m2.mp3";

const MusicRequestForm = ({ userProfile, onRequestSubmitted, hasExistingRequest = false }: MusicRequestFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [showForm, setShowForm] = useState(!hasExistingRequest);
  const submitAttemptRef = useRef(0);
  const hasSubmittedSuccessfully = useRef(false);
  
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

  // Limpar estado de submissão ao desmontar componente
  useEffect(() => {
    return () => {
      setIsSubmitting(false);
    };
  }, []);

  const handleImageSelected = (file: File) => {
    setCoverImage(file);
  };

  const onSubmit = async (values: MusicRequestFormValues) => {
    console.log("Formulário enviado, valores:", values);
    
    if (isSubmitting) {
      console.log("Já está submetendo, retornando");
      return; // Evitar múltiplos envios
    }
    
    if (hasSubmittedSuccessfully.current) {
      console.log("Já submetido com sucesso anteriormente, ignorando novo envio");
      toast({
        title: "Atenção",
        description: "Seu pedido já foi enviado com sucesso. Aguarde enquanto processamos.",
      });
      return;
    }
    
    submitAttemptRef.current += 1;
    const currentAttempt = submitAttemptRef.current;
    console.log(`Iniciando processo de submissão (tentativa ${currentAttempt})`);
    
    setIsSubmitting(true);
    
    try {
      console.log("Iniciando submissão do formulário", { values, userProfile });
      
      // Validar que o perfil do usuário tem os campos necessários
      if (!userProfile?.id) {
        throw new Error("Perfil de usuário inválido. Tente fazer login novamente.");
      }
      
      const data = await submitMusicRequest(values, userProfile, coverImage);
      console.log("Submissão do formulário concluída com sucesso", data);
      
      hasSubmittedSuccessfully.current = true;
      onRequestSubmitted(data);
      setShowForm(false); // Esconder formulário após envio bem-sucedido
      
      toast({
        title: "Sucesso!",
        description: "Seu pedido foi enviado com sucesso. Aguarde enquanto processamos sua solicitação.",
      });
    } catch (error: any) {
      console.error("Erro na submissão do formulário:", error);
      
      // Se não for o mesmo erro, mostrar toast diferente
      let errorMessage = "Ocorreu um erro ao processar seu pedido. Tente novamente mais tarde.";
      
      if (error.type === "network") {
        errorMessage = "Problema de conexão detectado. Verifique sua internet e tente novamente.";
      } else if (error.type === "timeout") {
        errorMessage = "A conexão com o servidor demorou muito. Tente novamente.";
      } else if (error.type === "permission") {
        errorMessage = "Você não tem permissão para enviar este pedido. Por favor, faça login novamente.";
      }
      
      toast({
        title: "Erro ao enviar pedido",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      // Importante: sempre garantir que o estado de submissão seja resetado
      // Apenas se esta ainda for a tentativa atual (evita race conditions)
      if (currentAttempt === submitAttemptRef.current) {
        console.log(`Finalizando tentativa de submissão ${currentAttempt}`);
        setIsSubmitting(false);
      }
    }
  };

  // Não mostrar o formulário se já existe um pedido
  if (hasExistingRequest) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <FormIntroduction />
      
      {showForm && (
        <>
          <ImageUpload onImageSelected={handleImageSelected} />
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <PersonInfoFields form={form} />
              <GenreSelector form={form} />
              <ToneAndVoiceFields form={form} />
              
              {/* ORDEM AJUSTADA: Citar nomes -> História -> Foco da música */}
              <IncludeNamesFields form={form} />
              <StoryField form={form} audioExplanationUrl={audioExplanationUrl} />
              <MusicFocusField form={form} />
              
              <HappyMemoryField form={form} />
              <SadMemoryField form={form} />
              <SubmitButton isSubmitting={isSubmitting} />
            </form>
          </Form>
        </>
      )}
    </div>
  );
};

export default MusicRequestForm;
