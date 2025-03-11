
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "@/types/database.types";
import { toast } from "@/hooks/use-toast";

export const useUserAuth = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  const checkUserAuth = useCallback(() => {
    const storedUser = localStorage.getItem("musicaperfeita_user");
    
    if (!storedUser) {
      toast({
        title: "Acesso restrito",
        description: "Você precisa fazer login para acessar esta página",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    const userInfo = storedUser ? JSON.parse(storedUser) : null;
    setUserProfile(userInfo);
  }, [navigate]);

  const handleUserLogout = () => {
    localStorage.removeItem("musicaperfeita_user");
    
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
    checkUserAuth,
    handleUserLogout
  };
};
