
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { isDevelopmentOrPreview } from "@/lib/environment";
import supabase from "@/lib/supabase";

const adminLoginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
});

type AdminLoginValues = z.infer<typeof adminLoginSchema>;

const AdminLogin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDevelopmentOrPreview()) {
      localStorage.setItem("musicaperfeita_admin", "true");
      localStorage.setItem("admin_email", "admin@musicaperfeita.com");
      const timer = setTimeout(() => {
        navigate("/admin");
      }, 1000);
      
      toast({
        title: "Acesso de desenvolvimento/preview",
        description: "Autenticação automática como administrador em modo de desenvolvimento ou preview",
      });
      
      return () => clearTimeout(timer);
    }
  }, [navigate]);

  const form = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: AdminLoginValues) => {
    setIsSubmitting(true);
    console.log('Tentando login com:', values);
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', values.email)
        .eq('password', values.password)
        .eq('is_admin', true);

      console.log('Resultado da consulta:', data, error);

      if (error || !data || data.length === 0) {
        toast({
          title: "Credenciais inválidas",
          description: "Email ou senha incorretos, ou você não tem permissões de administrador",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      localStorage.setItem("musicaperfeita_admin", "true");
      localStorage.setItem("admin_email", values.email);
      
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo ao painel de administração",
      });
      
      navigate("/admin");
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro ao tentar fazer login. Tente novamente.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <main className="py-16 px-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Login Administrativo</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="admin@exemplo.com" {...field} />
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
                        <Input type="password" placeholder="******" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Autenticando..." : "Entrar"}
                </Button>
              </form>
            </Form>
            
            <div className="mt-4 text-center text-sm">
              <p className="text-gray-500">
                Administrador principal:
              </p>
              <p className="text-gray-600">
                Email: contato@musicaperfeita.com
              </p>
              <p className="text-gray-600">
                Senha: 212300Lr@
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLogin;
