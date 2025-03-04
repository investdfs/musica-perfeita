
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

const musicRequestSchema = z.object({
  honoree_name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  relationship_type: z.enum(["partner", "friend", "family", "other"], {
    required_error: "Selecione o tipo de relacionamento",
  }),
  music_genre: z.enum(["romantic", "mpb", "classical", "jazz", "hiphop"], {
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

const MusicRequestForm = ({ userProfile, onRequestSubmitted }: MusicRequestFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Configure the form
  const form = useForm<MusicRequestFormValues>({
    resolver: zodResolver(musicRequestSchema),
    defaultValues: {
      honoree_name: "",
      relationship_type: undefined,
      music_genre: undefined,
      include_names: false,
      names_to_include: "",
      story: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: MusicRequestFormValues) => {
    setIsSubmitting(true);
    
    try {
      const newRequest = {
        user_id: userProfile.id,
        honoree_name: values.honoree_name,
        relationship_type: values.relationship_type,
        music_genre: values.music_genre,
        include_names: values.include_names,
        names_to_include: values.include_names ? values.names_to_include : null,
        story: values.story,
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
      
      // Notify parent component about the new request
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

  // Handle names field visibility
  const includeNames = form.watch("include_names");

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Novo Pedido de Música</h2>
      
      <div className="mb-6 bg-yellow-50 p-4 rounded-md border border-yellow-200">
        <p className="text-sm">
          Aqui você transforma sua história em música! Quanto mais detalhes emocionantes e fatos relevantes você compartilhar, melhor será o resultado. A qualidade da música depende da sua narrativa!
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="honoree_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quem é a pessoa homenageada?</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da pessoa homenageada" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="relationship_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qual seu tipo de relacionamento com essa pessoa?</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de relacionamento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="partner">Parceiro(a)</SelectItem>
                    <SelectItem value="friend">Amigo(a)</SelectItem>
                    <SelectItem value="family">Familiar</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="music_genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gênero de referência da música</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o gênero musical" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="romantic">Romântica</SelectItem>
                    <SelectItem value="mpb">MPB</SelectItem>
                    <SelectItem value="classical">Clássica</SelectItem>
                    <SelectItem value="jazz">Jazz</SelectItem>
                    <SelectItem value="hiphop">Hip-Hop</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  É uma referência; o resultado pode mesclar gêneros.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <p className="text-sm italic text-gray-600">
            A música não será exatamente o texto cantado; o texto serve como inspiração para o desenvolvimento.
          </p>
          
          <FormField
            control={form.control}
            name="include_names"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Citar até 3 nomes na música?</FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          {includeNames && (
            <FormField
              control={form.control}
              name="names_to_include"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quais os nomes?</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Separe os nomes por vírgula" 
                      {...field} 
                    />
                  </FormControl>
                  <p className="text-xs text-gray-500 mt-1">
                    Cite os nomes na história também.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="story"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conte sua história aqui</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Escreva detalhes emocionantes, momentos especiais e sentimentos."
                    className="min-h-[200px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-pink-500 hover:bg-pink-600" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar Pedido"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default MusicRequestForm;
