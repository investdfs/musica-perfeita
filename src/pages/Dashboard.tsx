
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import supabase from "@/lib/supabase";
import { MusicRequest, UserProfile } from "@/types/database.types";
import ProgressIndicator from "@/components/dashboard/ProgressIndicator";
import MusicPreviewPlayer from "@/components/dashboard/MusicPreviewPlayer";
import MusicRequestForm from "@/components/dashboard/MusicRequestForm";
import { toast } from "@/hooks/use-toast";
import { isDevelopmentOrPreview } from "@/lib/environment";

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRequests, setUserRequests] = useState<MusicRequest[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const navigate = useNavigate();

  // Get the user info from localStorage or create a test user in development/preview
  useEffect(() => {
    const storedUser = localStorage.getItem("musicaperfeita_user");
    
    // In development or preview, create a test user if none exists
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
    
    // Redirect to registration in production if no user is found
    if (!storedUser && !isDevelopmentOrPreview()) {
      navigate("/cadastro");
      return;
    }
    
    const userInfo = storedUser ? JSON.parse(storedUser) : null;
    setUserProfile(userInfo);
    
    // Fetch user's music requests
    const fetchUserRequests = async () => {
      try {
        if (!userInfo?.id) return;
        
        const { data, error } = await supabase
          .from('music_requests')
          .select('*')
          .eq('user_id', userInfo.id);
          
        if (error) throw error;
        
        if (data) {
          setUserRequests(data);
          
          // Set progress based on latest request status
          if (data.length > 0) {
            const latestRequest = data[0];
            switch (latestRequest.status) {
              case 'pending':
                setCurrentProgress(33);
                break;
              case 'in_production':
                setCurrentProgress(66);
                break;
              case 'completed':
                setCurrentProgress(100);
                break;
              default:
                setCurrentProgress(0);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching music requests:', error);
      }
    };
    
    if (userInfo) {
      fetchUserRequests();
    }
  }, [navigate]);

  // Handle new request submission
  const handleRequestSubmitted = (data: MusicRequest[]) => {
    setUserRequests([...data, ...userRequests]);
    setCurrentProgress(33); // Set to first stage
  };

  // Check if the latest request is completed and has a preview URL
  const hasCompletedRequest = userRequests.length > 0 && userRequests[0].status === 'completed';
  const hasPreviewUrl = userRequests.length > 0 && userRequests[0].preview_url;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-50 via-pink-50 to-white">
      <Header />
      <main className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {userProfile && (
            <h1 className="text-3xl font-bold mb-8 text-center">
              Olá, <span className="text-pink-500">{userProfile.name}</span>! Crie sua música perfeita!
            </h1>
          )}
          
          <ProgressIndicator currentProgress={currentProgress} />
          
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
            />
          )}
        </div>
      </main>
      <footer className="bg-gradient-to-r from-purple-700 to-pink-500 text-white py-8 text-center mt-12">
        <div className="max-w-5xl mx-auto px-6">
          <p>&copy; {new Date().getFullYear()} Musicaperfeita. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
