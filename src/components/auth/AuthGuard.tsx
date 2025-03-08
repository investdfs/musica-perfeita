
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

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
    
    const checkAuth = () => {
      // Verificar se o usuário está logado
      const storedUser = localStorage.getItem("musicaperfeita_user");
      
      if (!storedUser) {
        // Se não estiver logado e não estiver em uma rota pública, redirecionar
        if (
          location.pathname !== "/" && 
          location.pathname !== "/login" && 
          location.pathname !== "/cadastro" && 
          location.pathname !== "/sobre"
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
    
    const isAuth = checkAuth();
    setIsAuthenticated(isAuth);
  }, [location.pathname, location.search, navigate]);

  // Se ainda estiver verificando, não renderizar nada
  if (isAuthenticated === null && 
      location.pathname !== "/" && 
      location.pathname !== "/login" && 
      location.pathname !== "/cadastro" && 
      location.pathname !== "/sobre") {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
