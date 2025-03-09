
import { useState, useEffect } from "react";
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
import { Music2, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatTime } from "@/lib/formatTime";

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
  const [musicList, setMusicList] = useState<Music[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Carregar músicas do Supabase
  useEffect(() => {
    const fetchMusic = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('music_catalog')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          setMusicList(data as Music[]);
        }
      } catch (error) {
        console.error('Erro ao carregar músicas:', error);
        toast({
          title: "Erro ao carregar músicas",
          description: "Não foi possível carregar a lista de músicas",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMusic();
    
    // Inscrever para atualizações em tempo real
    const musicChannel = supabase
      .channel('music_catalog_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'music_catalog' 
      }, () => {
        console.log('Music catalog changed, refreshing data...');
        fetchMusic();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(musicChannel);
    };
  }, []);

  const onSubmit = async (values: MusicFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Preparar dados para inserção
      const newMusic: Omit<Music, 'id'> = {
        title: values.title,
        artist: values.artist,
        genre: values.genre,
        duration: values.duration,
        coverUrl: values.coverUrl,
        audioUrl: values.audioUrl,
        plays: values.plays,
      };

      // Inserir no Supabase
      const { data, error } = await supabase
        .from('music_catalog')
        .insert([newMusic])
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const insertedMusic = data[0] as Music;
        
        // Callback para o componente pai (se existir)
        if (onAddMusic) {
          onAddMusic(insertedMusic);
        }

        toast({
          title: "Música adicionada",
          description: `A música "${values.title}" foi adicionada com sucesso!`,
        });

        form.reset();
      }
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

  const handleDeleteMusic = async (id: string) => {
    try {
      const { error } = await supabase
        .from('music_catalog')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Música removida",
        description: "A música foi removida com sucesso!"
      });
      
    } catch (error) {
      console.error("Erro ao remover música:", error);
      toast({
        title: "Erro ao remover música",
        description: "Ocorreu um erro ao remover a música. Tente novamente.",
        variant: "destructive",
      });
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

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Histórico de Músicas</h3>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Artista</TableHead>
                  <TableHead>Gênero</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Plays</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {musicList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                      Nenhuma música adicionada ainda
                    </TableCell>
                  </TableRow>
                ) : (
                  musicList.map((music) => (
                    <TableRow key={music.id}>
                      <TableCell className="font-medium">{music.title}</TableCell>
                      <TableCell>{music.artist}</TableCell>
                      <TableCell>{music.genre}</TableCell>
                      <TableCell>{formatTime(music.duration)}</TableCell>
                      <TableCell>{music.plays}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteMusic(music.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default MusicManagement;
