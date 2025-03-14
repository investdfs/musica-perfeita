
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";
import { isLovableEditor, isDevelopmentOrPreview } from "@/lib/environment";

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
      
      // Verificar se está logado como admin
      const isAdmin = localStorage.getItem("musicaperfeita_admin") === "true";
      
      // Se estiver em modo de desenvolvimento ou no editor Lovable, permitir acesso completo
      if (isDevelopmentOrPreview() || isLovableEditor()) {
        console.log("Ambiente de desenvolvimento ou editor detectado - navegação livre permitida");
        return true;
      }

      // Se for uma rota de admin, verificar permissões
      if (isAdminRoute) {
        // Verificar se o usuário tem permissões de admin
        if (!isAdmin) {
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

      // Se for admin, permitir acesso a qualquer página sem restrições
      if (isAdmin) {
        console.log("Usuário é administrador - acesso livre permitido");
        return true;
      }

      // Para usuários não-admin, verificar se precisam estar logados para acessar a página
      if (!storedUser) {
        // Se não estiver logado e não estiver em uma rota pública, redirecionar
        if (
          location.pathname !== "/" && 
          location.pathname !== "/login" && 
          location.pathname !== "/cadastro" && 
          location.pathname !== "/sobre" &&
          location.pathname !== "/nossas-musicas" &&
          location.pathname !== "/depoimentos" &&
          location.pathname !== "/admin-login" &&
          location.pathname !== "/faq" &&
          location.pathname !== "/termos-condicoes" &&
          location.pathname !== "/politica-privacidade"
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
      
      return !!storedUser || isAdmin;
    };
    
    checkAuth().then(isAuth => {
      setIsAuthenticated(isAuth);
    });
  }, [location.pathname, location.search, navigate]);

  // Se estiver em modo de desenvolvimento ou editor, sempre renderize o conteúdo
  if (isDevelopmentOrPreview() || isLovableEditor()) {
    return <>{children}</>;
  }

  // Se ainda estiver verificando, não renderizar nada apenas para páginas que precisam de autenticação
  // Se for admin, sempre renderizamos o conteúdo
  const isAdmin = localStorage.getItem("musicaperfeita_admin") === "true";
  if (isAuthenticated === null && 
      !isAdmin &&
      location.pathname !== "/" && 
      location.pathname !== "/login" && 
      location.pathname !== "/cadastro" && 
      location.pathname !== "/sobre" &&
      location.pathname !== "/nossas-musicas" &&
      location.pathname !== "/depoimentos" &&
      location.pathname !== "/admin-login" &&
      location.pathname !== "/faq" &&
      location.pathname !== "/termos-condicoes" &&
      location.pathname !== "/politica-privacidade") {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
