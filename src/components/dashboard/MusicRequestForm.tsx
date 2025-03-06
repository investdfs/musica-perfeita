
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { UserProfile, MusicRequest } from "@/types/database.types";
import ImageUpload from "./ImageUpload";
import FormIntroduction from "./FormIntroduction";
import PersonInfoFields from "./PersonInfoFields";
import GenreSelector from "./GenreSelector";
import StoryField from "./StoryField";
import IncludeNamesFields from "./IncludeNamesFields";
import SubmitButton from "./SubmitButton";
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
  const [submitAttempts, setSubmitAttempts] = useState(0);

  const form = useForm<MusicRequestFormValues>({
    resolver: zodResolver(musicRequestSchema),
    defaultValues: {
      honoree_name: "",
      relationship_type: undefined,
      custom_relationship: null,
      music_genre: undefined,
      include_names: false,
      names_to_include: "",
      story: "",
    },
  });

  const handleImageSelected = (file: File) => {
    setCoverImage(file);
  };

  const onSubmit = async (values: MusicRequestFormValues) => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    setIsSubmitting(true);
    setSubmitAttempts(prev => prev + 1);
    
    try {
      console.log("Form submission started", { values, userProfile });
      
      // Validate that user profile has required fields
      if (!userProfile?.id) {
        throw new Error("Perfil de usuário inválido. Tente fazer login novamente.");
      }
      
      const data = await submitMusicRequest(values, userProfile, coverImage);
      console.log("Form submission completed successfully", data);
      
      onRequestSubmitted(data);
      setShowForm(false); // Hide form after successful submission
      
      toast({
        title: "Sucesso!",
        description: "Seu pedido foi enviado com sucesso. Aguarde enquanto processamos sua solicitação.",
      });
    } catch (error) {
      console.error("Form submission error:", error);
      
      // Special handling for network errors
      if (error.message?.includes("Failed to fetch")) {
        toast({
          title: "Erro de conexão",
          description: "Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.",
          variant: "destructive",
        });
      }
      
      // If this is the third attempt, give more detailed help
      if (submitAttempts >= 2) {
        toast({
          title: "Persistência de erro",
          description: "Estamos tendo dificuldades para processar seu pedido. Tente novamente mais tarde ou entre em contato com o suporte.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't show the form at all if there's an existing request
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
              <StoryField form={form} audioExplanationUrl={audioExplanationUrl} />
              <IncludeNamesFields form={form} />
              <SubmitButton isSubmitting={isSubmitting} />
            </form>
          </Form>
        </>
      )}
    </div>
  );
};

export default MusicRequestForm;
