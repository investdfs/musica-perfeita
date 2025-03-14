
import { UserProfile } from "@/types/database.types";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isDevelopmentOrPreview } from "@/lib/environment";

interface RedirectHandlerProps {
  userProfile: UserProfile | null;
  isLoggedIn: boolean;
  redirectUrl: string;
  children?: React.ReactNode;
}

/**
 * Componente para redirecionar usuários baseado no estado de autenticação
 */
const RedirectHandler = ({ 
  userProfile, 
  isLoggedIn, 
  redirectUrl, 
  children 
}: RedirectHandlerProps) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verificar se o usuário é admin
    const isAdmin = localStorage.getItem("musicaperfeita_admin") === "true";
    
    // Permitir acesso irrestrito para admins ou em ambiente de desenvolvimento
    if (isAdmin || isDevelopmentOrPreview()) {
      return;
    }
    
    if (!isLoggedIn) {
      navigate(redirectUrl, { replace: true });
    }
  }, [isLoggedIn, navigate, redirectUrl]);
  
  // Se o usuário está logado ou é admin ou está em ambiente de desenvolvimento, renderizar os children
  const isAdmin = localStorage.getItem("musicaperfeita_admin") === "true";
  return (isLoggedIn || isAdmin || isDevelopmentOrPreview()) ? <>{children}</> : null;
};

export default RedirectHandler;
