
import { useState, useEffect, useCallback } from "react";
import { MusicRequest, UserProfile } from "@/types/database.types";
import supabase from "@/lib/supabase";

export const useMusicRequests = (userProfile: UserProfile | null) => {
  const [userRequests, setUserRequests] = useState<MusicRequest[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);

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

  useEffect(() => {
    if (userProfile) {
      fetchUserRequests();
    }
  }, [userProfile, fetchUserRequests]);

  useEffect(() => {
    if (!userProfile?.id) return;
    
    const intervalId = setInterval(checkForStatusUpdates, 30000);
    
    return () => clearInterval(intervalId);
  }, [userProfile, checkForStatusUpdates]);

  return {
    userRequests,
    currentProgress,
    showNewRequestForm,
    isLoading,
    handleRequestSubmitted,
    handleCreateNewRequest,
    checkForStatusUpdates,
    fetchUserRequests
  };
};
