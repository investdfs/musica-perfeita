
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "@/lib/supabase";
import { MusicRequest, UserProfile } from "@/types/database.types";
import { toast } from "@/hooks/use-toast";
import { isDevelopmentOrPreview } from "@/lib/environment";
import { v4 as uuidv4 } from 'uuid';

export const useDashboard = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRequests, setUserRequests] = useState<MusicRequest[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const checkUserAuth = useCallback(() => {
    const storedUser = localStorage.getItem("musicaperfeita_user");
    
    if (!storedUser) {
      // Remover o modo de desenvolvimento automático e redirecionar para o login
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

  const fetchUserRequests = useCallback(async () => {
    try {
      if (!userProfile?.id) return;
      
      const { data, error } = await supabase
        .from('music_requests')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        setUserRequests(data);
        
        if (data.length > 0) {
          const latestRequest = data[0];
          switch (latestRequest.status) {
            case 'pending':
              setCurrentProgress(25);
              break;
            case 'in_production':
              setCurrentProgress(50);
              break;
            case 'completed':
              setCurrentProgress(100);
              break;
            default:
              setCurrentProgress(0);
          }
        } else {
          setCurrentProgress(10);
          setShowNewRequestForm(true);
        }
      }
    } catch (error) {
      console.error('Error fetching music requests:', error);
      setCurrentProgress(10);
    } finally {
      setIsLoading(false);
    }
  }, [userProfile]);

  const checkForStatusUpdates = useCallback(async () => {
    try {
      if (!userProfile?.id) return;
      
      const { data, error } = await supabase
        .from('music_requests')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const latestRequest = data[0];
        setUserRequests(data);
        
        switch (latestRequest.status) {
          case 'pending':
            setCurrentProgress(25);
            break;
          case 'in_production':
            setCurrentProgress(50);
            break;
          case 'completed':
            setCurrentProgress(100);
            break;
          default:
            setCurrentProgress(0);
        }
      }
    } catch (error) {
      console.error('Error checking for status updates:', error);
    }
  }, [userProfile]);

  const handleRequestSubmitted = (data: MusicRequest[]) => {
    setUserRequests([...data, ...userRequests]);
    setCurrentProgress(25);
    setShowNewRequestForm(false);
  };

  const handleCreateNewRequest = () => {
    setShowNewRequestForm(true);
  };

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
    if (userProfile) {
      fetchUserRequests();
    }
  }, [userProfile, fetchUserRequests]);

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

  useEffect(() => {
    if (!userProfile?.id) return;
    
    const intervalId = setInterval(checkForStatusUpdates, 30000);
    
    return () => clearInterval(intervalId);
  }, [userProfile, checkForStatusUpdates]);

  const hasCompletedRequest = userRequests.length > 0 && userRequests[0].status === 'completed';
  const hasPreviewUrl = userRequests.length > 0 && userRequests[0].preview_url;
  const hasAnyRequest = userRequests.length > 0;
  const hasPaidRequest = userRequests.length > 0 && userRequests[0].payment_status === 'completed';

  return {
    userProfile,
    userRequests,
    currentProgress,
    showNewRequestForm,
    isLoading,
    hasCompletedRequest,
    hasPreviewUrl,
    hasAnyRequest,
    hasPaidRequest,
    handleRequestSubmitted,
    handleCreateNewRequest,
    handleUserLogout
  };
};
