
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "@/types/database.types";
import { toast } from "@/hooks/use-toast";

export const useUserAuth = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecked, setIsAuthChecked] = useState<boolean>(false);
  const navigate = useNavigate();

  const checkUserAuth = useCallback(() => {
    const storedUser = localStorage.getItem("musicaperfeita_user");
    
    if (!storedUser) {
      // Só redireciona se já verificamos a autenticação
      if (isAuthChecked) {
        toast({
          title: "Acesso restrito",
          description: "Você precisa fazer login para acessar esta página",
          variant: "destructive",
        });
        navigate("/login");
      }
      setIsAuthenticated(false);
      setIsAuthChecked(true);
      return;
    }
    
    try {
      const userInfo = JSON.parse(storedUser);
      setUserProfile(userInfo);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Erro ao processar dados do usuário:", error);
      localStorage.removeItem("musicaperfeita_user");
      setIsAuthenticated(false);
    } finally {
      setIsAuthChecked(true);
    }
  }, [navigate, isAuthChecked]);

  const handleUserLogout = () => {
    localStorage.removeItem("musicaperfeita_user");
    setUserProfile(null);
    setIsAuthenticated(false);
    
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta com sucesso"
    });
    
    navigate("/login");
  };

  useEffect(() => {
    checkUserAuth();
  }, [checkUserAuth]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkUserAuth();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkUserAuth]);

  return {
    userProfile,
    isAuthenticated,
    isAuthChecked,
    checkUserAuth,
    handleUserLogout
  };
};
