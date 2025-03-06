
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MusicRequest, UserProfile } from "@/types/database.types";
import supabase from "@/lib/supabase";
import UserHeader from "./UserHeader";
import ProgressIndicator from "./ProgressIndicator";
import MusicAccessButton from "./MusicAccessButton";
import PreviewButton from "./PreviewButton";
import MusicPreviewPlayer from "./MusicPreviewPlayer";
import MusicRequestForm from "./MusicRequestForm";
import { toast } from "@/hooks/use-toast";
import { isDevelopmentOrPreview } from "@/lib/environment";

const DashboardContent = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRequests, setUserRequests] = useState<MusicRequest[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserAuth = () => {
      const storedUser = localStorage.getItem("musicaperfeita_user");
      
      if (!storedUser && isDevelopmentOrPreview()) {
        const testUser = {
          id: 'dev-user-id',
          name: 'Usuário de Desenvolvimento',
          email: 'dev@example.com',
          created_at: new Date().toISOString(),
          whatsapp: '+5511999999999'
        } as UserProfile;
        
        localStorage.setItem("musicaperfeita_user", JSON.stringify(testUser));
        setUserProfile(testUser);
        
        toast({
          title: "Modo de desenvolvimento/preview",
          description: "Usuário de teste criado automaticamente",
        });
        
        return;
      }
      
      if (!storedUser && !isDevelopmentOrPreview()) {
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
    };
    
    checkUserAuth();
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkUserAuth();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [navigate]);

  useEffect(() => {
    const fetchUserRequests = async () => {
      try {
        if (!userProfile?.id) return;
        
        const { data, error } = await supabase
          .from('music_requests')
          .select('*')
          .eq('user_id', userProfile.id);
          
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
          }
        }
      } catch (error) {
        console.error('Error fetching music requests:', error);
        setCurrentProgress(10);
      }
    };
    
    if (userProfile) {
      fetchUserRequests();
    }
  }, [userProfile]);

  useEffect(() => {
    if (!userProfile?.id) return;
    
    const checkForStatusUpdates = async () => {
      try {
        const { data, error } = await supabase
          .from('music_requests')
          .select('*')
          .eq('user_id', userProfile.id);
          
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
    };
    
    const intervalId = setInterval(checkForStatusUpdates, 30000);
    
    return () => clearInterval(intervalId);
  }, [userProfile]);

  const handleRequestSubmitted = (data: MusicRequest[]) => {
    setUserRequests([...data, ...userRequests]);
    setCurrentProgress(25);
  };

  const hasCompletedRequest = userRequests.length > 0 && userRequests[0].status === 'completed';
  const hasPreviewUrl = userRequests.length > 0 && userRequests[0].preview_url;
  const hasAnyRequest = userRequests.length > 0;
  const hasPaidRequest = userRequests.length > 0 && userRequests[0].payment_status === 'completed';
  const latestRequest = userRequests.length > 0 ? userRequests[0] : undefined;

  return (
    <div className="max-w-4xl mx-auto">
      <UserHeader userProfile={userProfile} />
      
      <ProgressIndicator currentProgress={currentProgress} hasAnyRequest={hasAnyRequest} />
      
      <MusicAccessButton 
        hasCompletedRequest={hasCompletedRequest} 
        hasPaidRequest={hasPaidRequest} 
        latestRequest={latestRequest}
      />
      
      <PreviewButton 
        hasCompletedRequest={hasCompletedRequest} 
        hasPaidRequest={hasPaidRequest}
        latestRequest={latestRequest}
      />
      
      {hasPreviewUrl && (
        <MusicPreviewPlayer 
          previewUrl={userRequests[0].preview_url || ''} 
          fullSongUrl={userRequests[0].full_song_url}
          isCompleted={hasCompletedRequest}
        />
      )}
      
      {userProfile && (
        <MusicRequestForm 
          userProfile={userProfile} 
          onRequestSubmitted={handleRequestSubmitted}
          hasExistingRequest={userRequests.length > 0}
        />
      )}
    </div>
  );
};

export default DashboardContent;
