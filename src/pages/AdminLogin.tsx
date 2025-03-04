
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

const adminLoginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
});

type AdminLoginValues = z.infer<typeof adminLoginSchema>;

const AdminLogin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Auto-login for development environment
  useEffect(() => {
    // Check if we're in development mode
    if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
      // Automatically authenticate as admin in development mode
      localStorage.setItem("musicaperfeita_admin", "true");
      // Redirect to admin panel after a short delay to allow toast to be visible
      const timer = setTimeout(() => {
        navigate("/admin");
      }, 1000);
      
      toast({
        title: "Acesso de desenvolvimento",
        description: "Autenticação automática como administrador em modo de desenvolvimento",
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
    
    // This is just a mock authentication
    // In a real application, you would verify credentials with Supabase Auth
    if (values.email === "admin@musicaperfeita.com" && values.password === "admin123") {
      // Store authentication state
      localStorage.setItem("musicaperfeita_admin", "true");
      
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo ao painel de administração",
      });
      
      navigate("/admin");
    } else {
      toast({
        title: "Credenciais inválidas",
        description: "Email ou senha incorretos",
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
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
                Para fins de demonstração, use:
              </p>
              <p className="text-gray-600">
                Email: admin@musicaperfeita.com
              </p>
              <p className="text-gray-600">
                Senha: admin123
              </p>
            </div>
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

export default AdminLogin;
