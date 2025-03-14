
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import supabase from "@/lib/supabase";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido" }),
});

const RecuperarSenha = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('Recuperação de senha iniciada para:', values.email);
      
      // Verificar se o e-mail existe na nossa base de dados
      const { data: existingUser, error: userError } = await supabase
        .from('user_profiles')
        .select('id, email')
        .eq('email', values.email)
        .single();
      
      if (userError || !existingUser) {
        toast({
          title: "E-mail não encontrado",
          description: "Não encontramos uma conta com este e-mail. Verifique e tente novamente.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Se o usuário existe, enviamos uma "nova senha temporária" (simulado)
      // Em um sistema real, seria enviado um link de redefinição de senha por e-mail
      // usando o supabase.auth.resetPasswordForEmail()
      
      // Gerar uma senha temporária aleatória
      const tempPassword = Math.random().toString(36).slice(-8);
      
      // Atualizar a senha do usuário
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ password: tempPassword })
        .eq('email', values.email);
      
      if (updateError) {
        console.error('Erro ao atualizar senha:', updateError);
        throw new Error('Erro ao processar sua solicitação');
      }
      
      // Aqui, em uma aplicação real, enviaria um e-mail com a senha temporária
      console.log('Senha temporária gerada (apenas para demonstração):', tempPassword);
      
      // Mostrar mensagem de sucesso
      setIsSubmitted(true);
      toast({
        title: "Recuperação de senha iniciada",
        description: "Se este e-mail estiver cadastrado, enviaremos instruções para recuperar sua senha.",
      });
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      toast({
        title: "Erro na recuperação de senha",
        description: "Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <Link to="/login" className="text-purple-600 hover:text-purple-800 flex items-center mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar para login
          </Link>
          
          <h1 className="text-2xl font-bold text-center mb-6">Recuperação de Senha</h1>
          
          {!isSubmitted ? (
            <>
              <p className="text-gray-600 mb-6 text-center">
                Informe seu e-mail abaixo e enviaremos instruções para redefinir sua senha.
              </p>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="seu@email.com" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Enviar instruções"
                    )}
                  </Button>
                </form>
              </Form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-green-50 text-green-800 p-4 rounded-md">
                <p className="font-medium">E-mail enviado com sucesso!</p>
                <p className="text-sm mt-2">
                  Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                </p>
                <p className="text-sm mt-2 text-green-700 font-bold">
                  Importante: Para demonstração, a nova senha temporária foi gerada e está visível apenas no console do desenvolvedor.
                </p>
              </div>
              
              <p className="text-gray-600 text-sm">
                Não recebeu o e-mail? Verifique sua pasta de spam ou 
                <button 
                  onClick={() => setIsSubmitted(false)} 
                  className="text-purple-600 hover:text-purple-800 ml-1"
                >
                  tente novamente
                </button>.
              </p>
              
              <div className="mt-6">
                <Link 
                  to="/login" 
                  className="text-purple-600 hover:text-purple-800 flex items-center justify-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Voltar para tela de login
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RecuperarSenha;
