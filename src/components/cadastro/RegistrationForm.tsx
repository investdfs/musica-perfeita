
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
import { Eye, EyeOff } from "lucide-react";
import { sendEmail, emailTemplates } from "@/lib/email";

const formSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  whatsapp: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, { 
    message: "WhatsApp deve estar no formato (XX) XXXXX-XXXX" 
  }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
});

const RegistrationForm = () => {
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // First, register the user with Supabase Auth
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
      
      if (authError) throw authError;
      
      // Then save additional user details to the user_profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          id: authData.user?.id, // Link to the auth user id
          name: values.name,
          email: values.email,
          whatsapp: values.whatsapp,
          password: "" // Store an empty string as the password is already in auth
        }])
        .select();
        
      if (profileError) {
        console.error('Error creating user profile:', profileError);
        // Try to continue even if profile creation fails
      }
      
      // Store user profile in localStorage
      const userProfile: UserProfile = profileData?.[0] || {
        id: authData.user?.id || '',
        created_at: new Date().toISOString(),
        name: values.name,
        email: values.email,
        whatsapp: values.whatsapp,
        password: ""
      };
      
      localStorage.setItem("musicaperfeita_user", JSON.stringify(userProfile));
      
      // Send welcome email
      try {
        const emailTemplate = emailTemplates.welcome(values.name);
        await sendEmail({
          to: values.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html
        });
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
        // Continue even if email fails
      }
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo ao Musicaperfeita!",
      });
      
      navigate("/dashboard");
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
          
          <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600" disabled={isSubmitting}>
            {isSubmitting ? "Criando conta..." : "Criar Minha Conta"}
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
        <p className="mt-4 text-center text-sm text-gray-600">
          Não pedimos cartão de crédito. Cadastre-se grátis e comece agora!
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;
