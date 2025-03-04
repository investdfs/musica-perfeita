
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";
import { MusicRequest, UserProfile } from "@/types/database.types";

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

type MusicRequestFormValues = z.infer<typeof musicRequestSchema>;

const Dashboard = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRequests, setUserRequests] = useState<MusicRequest[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const navigate = useNavigate();

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

  // Get the user info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("musicaperfeita_user");
    if (!storedUser) {
      navigate("/cadastro");
      return;
    }
    
    const userInfo = JSON.parse(storedUser);
    setUserProfile(userInfo);
    
    // Fetch user's music requests
    const fetchUserRequests = async () => {
      try {
        // In a real implementation, we'd use the user's ID from auth
        // For now, we'll use the email to identify the user
        const { data, error } = await supabase
          .from('music_requests')
          .select('*')
          .eq('user_id', userInfo.id);
          
        if (error) throw error;
        
        if (data) {
          setUserRequests(data);
          
          // Set progress based on latest request status
          if (data.length > 0) {
            const latestRequest = data[0];
            switch (latestRequest.status) {
              case 'pending':
                setCurrentProgress(33);
                break;
              case 'in_production':
                setCurrentProgress(66);
                break;
              case 'completed':
                setCurrentProgress(100);
                break;
              default:
                setCurrentProgress(0);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching music requests:', error);
      }
    };
    
    fetchUserRequests();
  }, [navigate]);

  // Handle form submission
  const onSubmit = async (values: MusicRequestFormValues) => {
    if (!userProfile) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, we'd get the user ID from auth
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
      
      // Update the requests list
      if (data) {
        setUserRequests([...data, ...userRequests]);
        setCurrentProgress(33); // Set to first stage
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
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Header />
      <main className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {userProfile && (
            <h1 className="text-3xl font-bold mb-8">
              Olá, <span className="text-pink-500">{userProfile.name}</span>! Crie sua música perfeita!
            </h1>
          )}
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Status do seu pedido</h2>
            <Progress value={currentProgress} className="h-3 mb-4" />
            <div className="flex justify-between text-sm">
              <span className={currentProgress >= 33 ? "text-pink-500 font-medium" : ""}>Pedido Enviado</span>
              <span className={currentProgress >= 66 ? "text-pink-500 font-medium" : ""}>Em Produção</span>
              <span className={currentProgress >= 100 ? "text-pink-500 font-medium" : ""}>Música Pronta</span>
            </div>
          </div>
          
          {userRequests.length > 0 && userRequests[0].preview_url && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Ouça 1/3 da sua música!</h2>
              <audio controls className="w-full mb-4">
                <source src={userRequests[0].preview_url} type="audio/mpeg" />
                Seu navegador não suporta áudio HTML5.
              </audio>
              <p className="mb-4">Gostou? Finalize o pagamento para receber a versão completa!</p>
              <Button className="w-full bg-pink-500 hover:bg-pink-600" onClick={() => navigate("/pagamento")}>
                Pagar Agora
              </Button>
            </div>
          )}
          
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
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-8 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <p>&copy; {new Date().getFullYear()} Musicaperfeita. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
