
import { UserProfile } from "@/types/database.types";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

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
    if (!isLoggedIn) {
      navigate(redirectUrl, { replace: true });
    }
  }, [isLoggedIn, navigate, redirectUrl]);
  
  // Se o usuário está logado, renderizar os children
  // Se não, não renderizar nada enquanto o redirecionamento acontece
  return isLoggedIn ? <>{children}</> : null;
};

export default RedirectHandler;
