
import { useState, useEffect } from "react";
import { Star, User, Heart, Quote } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";
import { UserProfile, MusicRequest } from "@/types/database.types";

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  content: string;
  date: string;
  imageUrl?: string;
  relationship?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Carla Mendes",
    rating: 5,
    content: "Foi incrível! Meu marido ficou emocionado com a música, as palavras descreveram perfeitamente nossa história. Ele até chorou! Valeu cada centavo e a música ficará para sempre em nossas memórias.",
    date: "12/05/2024",
    imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    relationship: "Para o marido",
  },
  {
    id: 2,
    name: "Ricardo Alves",
    rating: 5,
    content: "Fiz uma surpresa para minha esposa em nosso aniversário de casamento. A música ficou perfeita e superou todas as minhas expectativas. Ver a expressão no rosto dela quando a música começou a tocar foi impagável.",
    date: "23/04/2024",
    imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    relationship: "Para a esposa",
  },
  {
    id: 3,
    name: "Amanda Costa",
    rating: 4,
    content: "A composição ficou linda! Presenteei minha mãe no dia das mães e ela adorou. A música capturou perfeitamente nossa relação e as memórias que compartilhamos juntas.",
    date: "10/05/2024",
    imageUrl: "https://randomuser.me/api/portraits/women/66.jpg",
    relationship: "Para a mãe",
  },
  {
    id: 4,
    name: "Lucas Santos",
    rating: 5,
    content: "Inacreditável como transformaram minha história em uma música tão especial. Minha noiva ficou sem palavras quando ouviu. Já estamos usando a música para o nosso casamento!",
    date: "17/03/2024",
    imageUrl: "https://randomuser.me/api/portraits/men/78.jpg",
    relationship: "Para a noiva",
  },
  {
    id: 5,
    name: "Beatriz Lima",
    rating: 5,
    content: "Fiz como presente para meu filho que está morando longe. A música expressou todo o amor e saudade que sinto. Ele me ligou chorando após ouvir. Um presente que aproxima mesmo à distância.",
    date: "05/04/2024",
    imageUrl: "https://randomuser.me/api/portraits/women/90.jpg",
    relationship: "Para o filho",
  },
  {
    id: 6,
    name: "Gabriel Moreira",
    rating: 4,
    content: "Surpreendi minha namorada em nosso aniversário de namoro. Ela não esperava algo tão pessoal e único. A música conseguiu transmitir todos os sentimentos que às vezes tenho dificuldade de expressar.",
    date: "28/02/2024",
    imageUrl: "https://randomuser.me/api/portraits/men/62.jpg",
    relationship: "Para a namorada",
  },
  {
    id: 7,
    name: "Marina Soares",
    rating: 5,
    content: "Dei de presente para meu pai no aniversário dele. Ele é um homem de poucas palavras, mas percebi o quanto ficou emocionado. Ver meu pai se emocionar assim foi um momento que jamais esquecerei.",
    date: "14/04/2024",
    imageUrl: "https://randomuser.me/api/portraits/women/29.jpg",
    relationship: "Para o pai",
  },
  {
    id: 8,
    name: "Rodrigo Pereira",
    rating: 5,
    content: "Fiz uma música para comemorar 25 anos de casamento. Minha esposa não conseguiu conter as lágrimas. A qualidade da produção é impressionante, parece uma música profissional de rádio.",
    date: "03/05/2024",
    imageUrl: "https://randomuser.me/api/portraits/men/42.jpg",
    relationship: "Para a esposa",
  },
  {
    id: 9,
    name: "Fernanda Oliveira",
    rating: 5,
    content: "Encomendei uma música para minha melhor amiga que está passando por um momento difícil. Ela me disse que ouve a música todos os dias e que a ajuda a seguir em frente. O poder da música é incrível!",
    date: "19/03/2024",
    imageUrl: "https://randomuser.me/api/portraits/women/56.jpg",
    relationship: "Para uma amiga",
  }
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={16} 
          className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
        />
      ))}
    </div>
  );
};

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 bg-gradient-to-r from-purple-400 to-pink-400">
            {testimonial.imageUrl ? (
              <img 
                src={testimonial.imageUrl} 
                alt={testimonial.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-full h-full p-2 text-white" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
            <div className="flex items-center">
              <StarRating rating={testimonial.rating} />
              <span className="ml-2 text-xs text-gray-500">{testimonial.date}</span>
            </div>
            {testimonial.relationship && (
              <span className="inline-block mt-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                {testimonial.relationship}
              </span>
            )}
          </div>
        </div>
        <div className="relative">
          <Quote className="absolute top-0 left-0 w-6 h-6 text-indigo-100 -translate-x-1 -translate-y-1" />
          <p className="text-gray-600 leading-relaxed pl-4 italic">
            "{testimonial.content}"
          </p>
        </div>
      </div>
    </div>
  );
};

const Depoimentos = () => {
  const [newTestimonial, setNewTestimonial] = useState({ content: "", name: "", rating: 5 });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [hasCompletedMusic, setHasCompletedMusic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and has a completed music
    const checkUserStatus = async () => {
      const storedUser = localStorage.getItem("musicaperfeita_user");
      
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserProfile(user);
        
        // Check if user has a completed music
        try {
          const { data, error } = await supabase
            .from('music_requests')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'completed')
            .eq('payment_status', 'completed')
            .limit(1);
            
          if (data && data.length > 0) {
            setHasCompletedMusic(true);
          }
        } catch (error) {
          console.error("Error checking music status:", error);
        }
      }
    };
    
    checkUserStatus();
  }, []);

  const handleSubmitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userProfile) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para enviar um depoimento.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (!hasCompletedMusic) {
      toast({
        title: "Não permitido",
        description: "Você precisa ter uma música finalizada para enviar um depoimento.",
        variant: "destructive",
      });
      return;
    }
    
    if (newTestimonial.content.length < 20) {
      toast({
        title: "Depoimento muito curto",
        description: "Por favor, escreva um depoimento com pelo menos 20 caracteres.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Here you would normally save the testimonial to the database
    // For now, we'll just simulate a successful submission
    
    setTimeout(() => {
      toast({
        title: "Depoimento enviado!",
        description: "Obrigado por compartilhar sua experiência.",
      });
      setNewTestimonial({ content: "", name: "", rating: 5 });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-purple-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Depoimentos dos Nossos Clientes
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubra como nossas músicas personalizadas têm emocionado pessoas e criado momentos inesquecíveis.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto mb-16 bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-purple-700 mb-2">
              Compartilhe Sua Experiência
            </h2>
            <p className="text-gray-600">
              Como foi receber ou presentear alguém com uma música personalizada?
            </p>
          </div>
          
          {hasCompletedMusic ? (
            <form onSubmit={handleSubmitTestimonial} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sua avaliação
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewTestimonial({...newTestimonial, rating: star})}
                      className="focus:outline-none"
                    >
                      <Star
                        size={24}
                        className={`${
                          star <= newTestimonial.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        } hover:fill-yellow-300 hover:text-yellow-300 transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seu nome (opcional)
                </label>
                <Input
                  type="text"
                  value={newTestimonial.name}
                  onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})}
                  placeholder={userProfile?.name || "Seu nome"}
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seu depoimento
                </label>
                <Textarea
                  value={newTestimonial.content}
                  onChange={(e) => setNewTestimonial({...newTestimonial, content: e.target.value})}
                  placeholder="Conte como foi sua experiência com a música personalizada..."
                  className="h-32 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium py-3 rounded-lg shadow-md"
                disabled={isSubmitting || newTestimonial.content.length < 20}
              >
                {isSubmitting ? "Enviando..." : "Enviar Depoimento"}
              </Button>
            </form>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Quer compartilhar seu depoimento?
              </h3>
              <p className="text-gray-600 mb-4">
                Para enviar um depoimento, você precisa ter recebido e pago por uma música personalizada.
              </p>
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Fazer meu pedido
              </Button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Depoimentos;
