
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "@/types/database.types";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export const useUserAuth = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const checkUserAuth = useCallback(() => {
    const storedUser = localStorage.getItem("musicaperfeita_user");
    
    if (!storedUser) {
      toast({
        title: t("messages.restricted_access"),
        description: t("messages.login_required"),
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    const userInfo = storedUser ? JSON.parse(storedUser) : null;
    setUserProfile(userInfo);
  }, [navigate, t]);

  const handleUserLogout = () => {
    localStorage.removeItem("musicaperfeita_user");
    
    toast({
      title: t("messages.logout_success"),
      description: t("messages.logout_success")
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
