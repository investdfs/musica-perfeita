
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Resetar o scroll para o topo quando a rota muda
    window.scrollTo(0, 0);
    
    const checkAuth = async () => {
      // Verificar se o usuário está logado
      const storedUser = localStorage.getItem("musicaperfeita_user");
      
      // Verificar se é uma rota de admin
      const isAdminRoute = location.pathname.startsWith("/admin") && location.pathname !== "/admin-login";
      
      if (isAdminRoute) {
        // Verificar se o usuário tem permissões de admin
        const adminLoggedIn = localStorage.getItem("musicaperfeita_admin") === "true";
        
        if (!adminLoggedIn) {
          toast({
            title: "Acesso negado",
            description: "Você não tem permissões para acessar a área administrativa",
            variant: "destructive",
          });
          
          navigate("/");
          return false;
        }
        
        // Verificar se o email existe na base de dados como admin
        try {
          const adminEmail = localStorage.getItem("admin_email");
          
          if (adminEmail) {
            const { data, error } = await supabase
              .from('user_profiles')
              .select('is_admin')
              .eq('email', adminEmail)
              .single();
              
            if (error || !data || data.is_admin !== true) {
              console.error("Verificação de admin falhou:", error || "Usuário não é admin");
              localStorage.removeItem("musicaperfeita_admin");
              toast({
                title: "Sessão inválida",
                description: "Suas credenciais de administrador são inválidas",
                variant: "destructive",
              });
              navigate("/");
              return false;
            }
          } else {
            // Se não tiver email de admin no localStorage, redirecionar
            localStorage.removeItem("musicaperfeita_admin");
            navigate("/");
            return false;
          }
        } catch (error) {
          console.error("Erro ao verificar permissões de admin:", error);
          navigate("/");
          return false;
        }
      }

      if (!storedUser) {
        // Se não estiver logado e não estiver em uma rota pública, redirecionar
        if (
          location.pathname !== "/" && 
          location.pathname !== "/login" && 
          location.pathname !== "/cadastro" && 
          location.pathname !== "/sobre" &&
          location.pathname !== "/nossas-musicas" &&
          location.pathname !== "/admin-login"
        ) {
          // Salvar a rota atual para redirecionamento após login
          localStorage.setItem("redirect_after_login", location.pathname + location.search);
          
          // Mostrar toast informando sobre o redirecionamento
          toast({
            title: "Acesso restrito",
            description: "Esta página é de acesso restrito aos clientes. Por favor, cadastre-se ou faça seu login.",
            variant: "destructive",
          });
          
          // Redirecionar para login
          navigate("/login");
          return false;
        }
      }
      
      return !!storedUser;
    };
    
    checkAuth().then(isAuth => {
      setIsAuthenticated(isAuth);
    });
  }, [location.pathname, location.search, navigate]);

  // Se ainda estiver verificando, não renderizar nada
  if (isAuthenticated === null && 
      location.pathname !== "/" && 
      location.pathname !== "/login" && 
      location.pathname !== "/cadastro" && 
      location.pathname !== "/sobre" &&
      location.pathname !== "/nossas-musicas" &&
      location.pathname !== "/admin-login") {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
