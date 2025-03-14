import { useState, useCallback } from "react";
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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { sendEmail, emailTemplates } from "@/lib/email";

interface RegistrationFormProps {
  onRegister: (user: UserProfile) => void;
}

const formSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  whatsapp: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, { 
    message: "WhatsApp deve estar no formato (XX) XXXXX-XXXX" 
  }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
});

const RegistrationForm = ({ onRegister }: RegistrationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      password: "",
    },
  });

  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    if (isSubmitting) return; // Previne múltiplos cliques
    
    setIsSubmitting(true);
    console.log('Iniciando cadastro para:', values.email);
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
            whatsapp: values.whatsapp,
          }
        }
      });
      
      if (authError) {
        console.error('Erro ao criar usuário na autenticação:', authError);
        throw authError;
      }
      
      if (!authData.user) {
        throw new Error('Erro: Usuário não criado no sistema de autenticação');
      }
      
      console.log('Usuário criado com sucesso na autenticação', authData.user.id);
      
      // Modified this part to store the actual password in the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          id: authData.user.id,
          name: values.name,
          email: values.email,
          whatsapp: values.whatsapp,
          password: values.password // Store the actual password instead of empty string
        }])
        .select();
        
      if (profileError) {
        console.error('Erro ao criar perfil de usuário:', profileError);
      } else {
        console.log('Perfil de usuário criado com sucesso');
      }
      
      const userProfile: UserProfile = profileData?.[0] || {
        id: authData.user.id,
        created_at: new Date().toISOString(),
        name: values.name,
        email: values.email,
        whatsapp: values.whatsapp,
        password: values.password // Update this field as well
      };
      
      localStorage.setItem("musicaperfeita_user", JSON.stringify(userProfile));
      console.log('Perfil salvo no localStorage');
      
      // Tentar enviar email de boas-vindas, mas não bloquear a interface por isso
      try {
        const emailTemplate = emailTemplates.welcome(values.name);
        await sendEmail({
          to: values.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html
        });
        console.log('Email de boas-vindas enviado com sucesso');
      } catch (emailError) {
        console.error('Erro ao enviar email de boas-vindas:', emailError);
        // Não mostramos esse erro para o usuário, pois o cadastro já foi concluído
      }
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo ao Musicaperfeita!",
      });
      
      navigate("/dashboard");
      
      // Adicione a chamada para a função onRegister ao final do bloco try
      onRegister(userProfile);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      let errorMessage = "Ocorreu um erro ao criar sua conta. Tente novamente.";
      
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const supabaseError = error as { message: string };
        if (supabaseError.message.includes('already registered')) {
          errorMessage = "Este email já está cadastrado. Tente fazer login ou use outro email.";
        }
      }
      
      toast({
        title: "Erro ao criar conta",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, navigate, onRegister]);

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full">
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
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Senha" 
                      {...field} 
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-pink-500 hover:bg-pink-600 transition-colors" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando conta...
              </>
            ) : (
              "Criar Minha Conta"
            )}
          </Button>
        </form>
      </Form>
      
      <div className="mt-6">
        <p className="text-center text-sm text-gray-600">
          Já tem uma conta?{" "}
          <a href="/login" className="font-medium text-pink-500 hover:text-pink-600">
            Faça login
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;
