import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";
import { UserProfile } from "@/types/database.types";
import ImageUpload from "./ImageUpload";
import { Play, Info } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const musicRequestSchema = z.object({
  honoree_name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  relationship_type: z.enum([
    "esposa", "noiva", "namorada", "amigo_especial", "partner", "friend", "family", 
    "colleague", "mentor", "child", "sibling", "parent", "other"
  ], {
    required_error: "Selecione o tipo de relacionamento",
  }),
  custom_relationship: z.string().nullable().optional(),
  music_genre: z.enum([
    "romantic", "mpb", "classical", "jazz", "hiphop", 
    "rock", "country", "reggae", "electronic", "samba", "folk", "pop"
  ], {
    required_error: "Selecione o gênero musical",
  }),
  include_names: z.boolean().default(false),
  names_to_include: z.string().nullable().optional(),
  story: z.string().min(50, { message: "Conte sua história com pelo menos 50 caracteres" }),
});

export type MusicRequestFormValues = z.infer<typeof musicRequestSchema>;

interface MusicRequestFormProps {
  userProfile: UserProfile;
  onRequestSubmitted: (newRequest: any) => void;
}

const audioExplanationUrl = "https://example.com/audio-explanation.mp3";

const MusicRequestForm = ({ userProfile, onRequestSubmitted }: MusicRequestFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audio] = useState(new Audio(audioExplanationUrl));

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

  const toggleAudio = () => {
    if (isAudioPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.error("Erro ao reproduzir áudio:", error);
        toast({
          title: "Erro ao reproduzir",
          description: "Não foi possível reproduzir o áudio explicativo.",
          variant: "destructive",
        });
      });
    }
    setIsAudioPlaying(!isAudioPlaying);
  };

  audio.onended = () => {
    setIsAudioPlaying(false);
  };

  const onSubmit = async (values: MusicRequestFormValues) => {
    setIsSubmitting(true);
    
    try {
      let coverUrl = null;
      if (coverImage) {
        const fileName = `covers/${userProfile.id}/${Date.now()}-${coverImage.name}`;
        const { data: imageData, error: imageError } = await supabase.storage
          .from('music-covers')
          .upload(fileName, coverImage);
          
        if (imageError) {
          throw imageError;
        }
        
        coverUrl = imageData?.path;
      }
      
      const newRequest = {
        user_id: userProfile.id,
        honoree_name: values.honoree_name,
        relationship_type: values.relationship_type,
        custom_relationship: values.relationship_type === 'other' ? values.custom_relationship : null,
        music_genre: values.music_genre,
        include_names: values.include_names,
        names_to_include: values.include_names ? values.names_to_include : null,
        story: values.story,
        cover_image_url: coverUrl,
        status: 'pending',
        preview_url: null,
        full_song_url: null,
        payment_status: 'pending'
      };
      
      const { data, error } = await supabase
        .from('music_requests')
        .insert([newRequest])
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Pedido enviado com sucesso!",
        description: "Seu pedido foi recebido e está sendo analisado.",
      });
      
      if (data) {
        onRequestSubmitted(data);
      }
      
    } catch (error) {
      console.error('Error submitting music request:', error);
      toast({
        title: "Erro ao enviar pedido",
        description: "Ocorreu um erro ao enviar seu pedido. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const relationshipType = form.watch("relationship_type");
  const includeNames = form.watch("include_names");

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-semibold mb-6 text-pink-600">Crie Sua Música Especial</h2>
      
      <div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-md border border-purple-100">
        <p className="text-sm text-gray-700 leading-relaxed">
          Transforme sua história em uma música única! Quanto mais detalhes emocionantes e fatos relevantes você compartilhar, 
          melhor será o resultado. A qualidade da música depende da sua narrativa!
        </p>
      </div>
      
      <ImageUpload onImageSelected={handleImageSelected} />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="honoree_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-700">Para quem é esta música?</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da pessoa homenageada" className="border-pink-200 focus-visible:ring-pink-400" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="relationship_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-purple-700">Tipo de relacionamento</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-pink-200 focus-visible:ring-pink-400">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="esposa">Esposa</SelectItem>
                        <SelectItem value="noiva">Noiva</SelectItem>
                        <SelectItem value="namorada">Namorada</SelectItem>
                        <SelectItem value="amigo_especial">Amigo(a) "Especial"</SelectItem>
                        <SelectItem value="partner">Parceiro(a)/Cônjuge</SelectItem>
                        <SelectItem value="friend">Amigo(a)</SelectItem>
                        <SelectItem value="family">Familiar (Geral)</SelectItem>
                        <SelectItem value="parent">Pai/Mãe</SelectItem>
                        <SelectItem value="sibling">Irmão/Irmã</SelectItem>
                        <SelectItem value="child">Filho(a)</SelectItem>
                        <SelectItem value="colleague">Colega de Trabalho</SelectItem>
                        <SelectItem value="mentor">Mentor(a)/Professor(a)</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {relationshipType === 'other' && (
                <FormField
                  control={form.control}
                  name="custom_relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-700">Especifique o relacionamento</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Chefe, vizinho, etc" 
                          className="border-pink-200 focus-visible:ring-pink-400"
                          {...field}
                          value={field.value || ''} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="music_genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-700">Gênero de referência da música</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border-pink-200 focus-visible:ring-pink-400">
                      <SelectValue placeholder="Selecione o gênero musical" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="romantic">Romântica</SelectItem>
                    <SelectItem value="mpb">MPB</SelectItem>
                    <SelectItem value="pop">Pop</SelectItem>
                    <SelectItem value="rock">Rock</SelectItem>
                    <SelectItem value="classical">Clássica</SelectItem>
                    <SelectItem value="jazz">Jazz</SelectItem>
                    <SelectItem value="hiphop">Hip-Hop</SelectItem>
                    <SelectItem value="electronic">Eletrônica</SelectItem>
                    <SelectItem value="country">Country</SelectItem>
                    <SelectItem value="folk">Folk</SelectItem>
                    <SelectItem value="reggae">Reggae</SelectItem>
                    <SelectItem value="samba">Samba</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  É uma referência; o resultado pode mesclar gêneros.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
                          className="h-8 w-8 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700"
                          onClick={toggleAudio}
                        >
                          <Play className={`h-4 w-4 ${isAudioPlaying ? 'text-purple-900' : 'text-purple-700'}`} />
                          <span className="sr-only">Ouvir explicação</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Ouça uma explicação sobre a importância deste campo</p>
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
                    placeholder="Escreva detalhes emocionantes, momentos especiais e sentimentos."
                    className="min-h-[200px] border-pink-200 focus-visible:ring-pink-400"
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
          
          <FormField
            control={form.control}
            name="include_names"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-pink-50 p-4 rounded-md">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                    className="border-pink-400 data-[state=checked]:bg-pink-500"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-gray-700">Citar até 4 nomes na música?</FormLabel>
                  <p className="text-xs text-gray-500">
                    Os nomes devem estar relacionados à história da pessoa homenageada.
                  </p>
                </div>
              </FormItem>
            )}
          />
          
          {includeNames && (
            <FormField
              control={form.control}
              name="names_to_include"
              render={({ field }) => (
                <FormItem className="bg-pink-50 p-4 rounded-md -mt-2">
                  <FormLabel className="text-gray-700">Quais os nomes a serem citados?</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Digite até 4 nomes separados por vírgula" 
                      className="border-pink-200 focus-visible:ring-pink-400"
                      {...field} 
                    />
                  </FormControl>
                  <p className="text-xs text-gray-500 mt-1">
                    Certifique-se de mencionar estes nomes na história também para melhor contextualização.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-6 text-lg" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar Pedido"}
          </Button>
        </form>
      </Form>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-pink-600">A Importância da Sua História</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-gray-700 leading-relaxed">
            Este campo da história é o coração pulsante da sua música – o lugar mais importante onde você vai ajudar nosso compositor a dar vida à alma perfeita para essa canção. Dedique alguns minutos especiais, desligue-se do mundo e mergulhe nos momentos mais emocionantes da vida da pessoa homenageada. Foque nos instantes que fizeram o coração dela vibrar – risadas inesquecíveis, lágrimas que ensinaram, ou gestos de amor que marcaram para sempre, mas lembre-se também dos momentos tristes, eles fazem parte da vida. Quanto mais detalhes e emoção você compartilhar aqui, mais única e tocante será a melodia que criaremos. Está pronto para transformar esses sentimentos em música? Escreva agora e deixe a magia acontecer!
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MusicRequestForm;
