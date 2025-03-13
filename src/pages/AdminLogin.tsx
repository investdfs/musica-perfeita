
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
    // Check if we're already logged in as admin
    const isAdmin = localStorage.getItem("musicaperfeita_admin");
    if (isAdmin === "true") {
      navigate("/admin");
      return;
    }
    
    // Auto-login in Lovable editor environment
    if (window.location.href.includes("lovable.dev/projects/")) {
      console.log("Auto-login - Lovable editor environment detected");
      
      localStorage.setItem("musicaperfeita_admin", "true");
      localStorage.setItem("admin_email", "editor@musicaperfeita.com");
      localStorage.setItem("admin_id", "editor-session");
      localStorage.setItem("admin_is_main", "true");
      
      toast({
        title: "Acesso de edição",
        description: "Autenticação automática como administrador em modo de edição",
      });
      
      setTimeout(() => {
        navigate("/admin");
      }, 500);
      return;
    }
    
    // Auto-login in development mode
    if (isDevelopmentOrPreview()) {
      localStorage.setItem("musicaperfeita_admin", "true");
      localStorage.setItem("admin_email", "contato@musicaperfeita.com");
      localStorage.setItem("admin_id", "dev-session");
      localStorage.setItem("admin_is_main", "true");
      
      toast({
        title: "Acesso de desenvolvimento/preview",
        description: "Autenticação automática como administrador em modo de desenvolvimento ou preview",
      });
      
      setTimeout(() => {
        navigate("/admin");
      }, 500);
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
      // Busca o usuário no Supabase sem verificar is_admin primeiro
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', values.email)
        .eq('password', values.password);

      console.log('Resultado da consulta:', data, error);

      // Se não encontrar usuário ou houver erro
      if (error) {
        console.error("Erro na consulta:", error);
        toast({
          title: "Erro ao fazer login",
          description: "Ocorreu um erro ao tentar autenticar. Tente novamente.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Se não encontrar nenhum usuário
      if (!data || data.length === 0) {
        toast({
          title: "Credenciais inválidas",
          description: "Email ou senha incorretos",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Verifica se o usuário tem permissão de admin
      const user = data[0];
      console.log("Usuário encontrado:", user);
      
      if (!user.is_admin) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissões de administrador",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Login bem-sucedido, salva as informações no localStorage
      localStorage.setItem("musicaperfeita_admin", "true");
      localStorage.setItem("admin_email", values.email);
      localStorage.setItem("admin_id", user.id);
      localStorage.setItem("admin_is_main", user.is_main_admin ? "true" : "false");
      
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
                Senha: 212300
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
