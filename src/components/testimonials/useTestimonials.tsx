
import { useState, useEffect } from "react";
import { UserProfile } from "@/types/database.types";
import supabase from "@/lib/supabase";

export const useTestimonials = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [hasCompletedMusic, setHasCompletedMusic] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in and has a completed music
    const checkUserStatus = async () => {
      const storedUser = localStorage.getItem("musicaperfeita_user");
      
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserProfile(user);
        
        // Check if user has a completed music
        try {
          const { data, error } = await supabase
            .from('music_requests')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'completed')
            .eq('payment_status', 'completed')
            .limit(1);
            
          if (data && data.length > 0) {
            setHasCompletedMusic(true);
          }
        } catch (error) {
          console.error("Error checking music status:", error);
        }
      }
    };
    
    checkUserStatus();
  }, []);

  return {
    userProfile,
    hasCompletedMusic
  };
};
