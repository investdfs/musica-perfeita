
import { useState } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";
import { UserProfile } from "@/types/database.types";
import StarRating from "./StarRating";

interface TestimonialFormProps {
  userProfile: UserProfile | null;
  hasCompletedMusic: boolean;
}

const TestimonialForm = ({ userProfile, hasCompletedMusic }: TestimonialFormProps) => {
  const [newTestimonial, setNewTestimonial] = useState({ content: "", name: "", rating: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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
    
    try {
      // Salvar o depoimento no banco de dados
      const { error } = await supabase
        .from('testimonials')
        .insert([
          {
            user_id: userProfile.id,
            name: newTestimonial.name || userProfile.name,
            content: newTestimonial.content,
            rating: newTestimonial.rating,
            approved: false // Depoimentos precisam ser aprovados pelo admin
          }
        ]);
        
      if (error) throw error;
      
      toast({
        title: "Depoimento enviado!",
        description: "Obrigado por compartilhar sua experiência. Seu depoimento será revisado em breve.",
      });
      
      setNewTestimonial({ content: "", name: "", rating: 5 });
    } catch (error) {
      console.error("Erro ao enviar depoimento:", error);
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar seu depoimento. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRedirectToLogin = () => {
    toast({
      title: "Acesso restrito",
      description: "Você precisa estar logado para enviar um depoimento ou fazer um pedido.",
      variant: "destructive",
    });
    navigate("/login");
  };

  if (userProfile && hasCompletedMusic) {
    return (
      <form onSubmit={handleSubmitTestimonial} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sua avaliação
          </label>
          <StarRating 
            rating={newTestimonial.rating} 
            size={24} 
            interactive 
            onChange={(rating) => setNewTestimonial({...newTestimonial, rating})}
          />
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
    );
  }

  return (
    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-800 mb-2">
        Quer compartilhar seu depoimento?
      </h3>
      <p className="text-gray-600 mb-4">
        Para enviar um depoimento, você precisa ter recebido e pago por uma música personalizada.
      </p>
      <Button
        onClick={userProfile ? () => navigate("/dashboard") : handleRedirectToLogin}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        {userProfile ? "Fazer meu pedido" : "Fazer login"}
      </Button>
    </div>
  );
};

export default TestimonialForm;
