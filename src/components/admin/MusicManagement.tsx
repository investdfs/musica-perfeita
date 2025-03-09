
import { useState } from "react";
import { Music } from "@/types/music";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Music2, PlusCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  artist: z.string().min(1, "O artista é obrigatório"),
  genre: z.string().min(1, "O gênero é obrigatório"),
  duration: z.coerce.number().min(1, "A duração deve ser maior que 0"),
  coverUrl: z.string().url("URL da capa inválida"),
  audioUrl: z.string().url("URL do áudio inválida"),
  plays: z.coerce.number().min(0, "O número de reproduções não pode ser negativo"),
});

type MusicFormValues = z.infer<typeof formSchema>;

interface MusicManagementProps {
  onAddMusic?: (music: Music) => void;
}

const MusicManagement = ({ onAddMusic }: MusicManagementProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MusicFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      artist: "Música Perfeita",
      genre: "",
      duration: 180,
      coverUrl: "",
      audioUrl: "",
      plays: 0,
    },
  });

  const onSubmit = async (values: MusicFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simular id único
      const id = Date.now().toString();

      const newMusic: Music = {
        id,
        title: values.title,
        artist: values.artist,
        genre: values.genre,
        duration: values.duration,
        coverUrl: values.coverUrl,
        audioUrl: values.audioUrl,
        plays: values.plays,
      };

      // Aqui você adicionaria a lógica para salvar no banco de dados
      // Mas por enquanto apenas simulamos com um callback

      if (onAddMusic) {
        onAddMusic(newMusic);
      }

      toast({
        title: "Música adicionada",
        description: `A música "${values.title}" foi adicionada com sucesso!`,
      });

      form.reset();
    } catch (error) {
      console.error("Erro ao adicionar música:", error);
      toast({
        title: "Erro ao adicionar música",
        description: "Ocorreu um erro ao adicionar a música. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <Music2 className="h-5 w-5 mr-2 text-blue-500" />
        <h2 className="text-xl font-semibold">Gerenciar Músicas</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título da Música</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Declaração de Amor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="artist"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artista</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gênero</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Romântica" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duração (em segundos)</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Capa</FormLabel>
                  <FormControl>
                    <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="audioUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do Áudio</FormLabel>
                  <FormControl>
                    <Input placeholder="https://exemplo.com/musica.mp3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="plays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Reproduções Iniciais</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {isSubmitting ? "Adicionando..." : "Adicionar Música"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default MusicManagement;
