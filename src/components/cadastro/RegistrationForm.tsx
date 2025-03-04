
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import supabase from "@/lib/supabase";
import { UserProfile } from "@/types/database.types";

const formSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  whatsapp: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, { 
    message: "WhatsApp deve estar no formato (XX) XXXXX-XXXX" 
  }),
});

const RegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Insert user into Supabase
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([values])
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Store in localStorage with proper typing
        const userProfile: UserProfile = data[0];
        localStorage.setItem("musicaperfeita_user", JSON.stringify(userProfile));
        
        toast({
          title: "Conta criada com sucesso!",
          description: "Bem-vindo ao Musicaperfeita!",
        });
        
        navigate("/dashboard");
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Erro ao criar conta",
        description: "Ocorreu um erro ao criar sua conta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format WhatsApp input with mask
  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      if (value.length > 2) {
        value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
      }
      if (value.length > 10) {
        value = `${value.substring(0, 10)}-${value.substring(10)}`;
      }
      form.setValue("whatsapp", value);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Crie sua conta</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="seu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="(XX) XXXXX-XXXX" 
                    {...field}
                    onChange={handleWhatsAppChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600" disabled={isSubmitting}>
            {isSubmitting ? "Criando conta..." : "Criar Minha Conta"}
          </Button>
        </form>
      </Form>
      
      <p className="mt-6 text-center text-sm text-gray-600">
        Não pedimos cartão de crédito. Cadastre-se grátis e comece agora!
      </p>
    </div>
  );
};

export default RegistrationForm;
