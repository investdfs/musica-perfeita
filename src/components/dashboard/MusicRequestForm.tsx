
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
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MusicRequestFormProps {
  userProfile: UserProfile;
  onRequestSubmitted: (newRequest: any) => void;
  hasExistingRequest?: boolean;
}

const audioExplanationUrl = "https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/ElevenLabs_2025-03-04T15_03_46_ScheilaSMTy_pvc_s86_sb98_se25_b_m2.mp3";

const MusicRequestForm = ({ userProfile, onRequestSubmitted, hasExistingRequest = false }: MusicRequestFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isFormExpanded, setIsFormExpanded] = useState(!hasExistingRequest);

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
    setIsSubmitting(true);
    
    try {
      const data = await submitMusicRequest(values, userProfile, coverImage);
      onRequestSubmitted(data);
      setIsFormExpanded(false); // Collapse form after submission
    } catch (error) {
      // Error is already handled in submitMusicRequest
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleForm = () => {
    if (!hasExistingRequest) {
      setIsFormExpanded(!isFormExpanded);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8 relative">
      <FormIntroduction 
        isExpanded={isFormExpanded} 
        toggleForm={toggleForm} 
        canToggle={!hasExistingRequest}
      />
      
      {isFormExpanded && (
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
