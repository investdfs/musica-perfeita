
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Play, Pause, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import FormInfoDialog from "./FormInfoDialog";
import { UseFormReturn } from "react-hook-form";
import { MusicRequestFormValues } from "./formSchema";

interface StoryFieldProps {
  form: UseFormReturn<MusicRequestFormValues>;
  audioExplanationUrl: string;
}

const StoryField = ({ form, audioExplanationUrl }: StoryFieldProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audio] = useState(new Audio(audioExplanationUrl));
  const [isFocused, setIsFocused] = useState(false);

  const toggleAudio = () => {
    if (isAudioPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.error("Erro ao reproduzir áudio:", error);
      });
    }
    setIsAudioPlaying(!isAudioPlaying);
  };

  audio.onended = () => {
    setIsAudioPlaying(false);
  };

  return (
    <>
      <FormField
        control={form.control}
        name="story"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormLabel className="text-purple-700">Conte sua história aqui</FormLabel>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className={`h-8 w-8 rounded-full transition-all duration-300 
                        ${isAudioPlaying 
                          ? "bg-purple-200 hover:bg-purple-300 text-purple-900 scale-110" 
                          : "bg-purple-100 hover:bg-purple-200 text-purple-700"}`}
                      onClick={toggleAudio}
                    >
                      {isAudioPlaying ? (
                        <Pause className="h-4 w-4 animate-pulse" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {isAudioPlaying ? "Pausar explicação" : "Ouvir explicação"}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isAudioPlaying ? "Pausar explicação" : "Ouça uma explicação sobre a importância deste campo"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700"
                onClick={() => setIsDialogOpen(true)}
              >
                <Info className="h-4 w-4" />
                <span className="sr-only">Informações</span>
              </Button>
            </div>
            
            <FormControl>
              <Textarea
                placeholder={!isFocused ? "EXEMPLO: Minha mãe sempre foi meu porto seguro, mesmo quando perdemos tudo na enchente de 2015 e ela manteve a fé, cantando para mim todas as noites. Seu sorriso iluminava até os dias mais escuros." : ""}
                className="min-h-[250px] border-pink-200 focus-visible:ring-pink-400 text-gray-900 bg-white"
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  if (!field.value) {
                    setIsFocused(false);
                  }
                }}
                {...field}
              />
            </FormControl>
            <p className="text-xs italic text-gray-600 mt-2 bg-gray-50 p-3 rounded-md border border-gray-100">
              A música não será exatamente o texto cantado; o texto serve como inspiração para o desenvolvimento.
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormInfoDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
};

export default StoryField;
