
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import supabase from "@/lib/supabase";
import { MusicRequest, UserProfile } from "@/types/database.types";
import ProgressIndicator from "@/components/dashboard/ProgressIndicator";
import MusicPreviewPlayer from "@/components/dashboard/MusicPreviewPlayer";
import MusicRequestForm from "@/components/dashboard/MusicRequestForm";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRequests, setUserRequests] = useState<MusicRequest[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const navigate = useNavigate();

  // Get the user info from localStorage or create a test user in development
  useEffect(() => {
    const storedUser = localStorage.getItem("musicaperfeita_user");
    
    // In development, create a test user if none exists
    if (!storedUser && (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost')) {
      const testUser: UserProfile = {
        id: 'dev-user-id',
        name: 'Usuário de Desenvolvimento',
        email: 'dev@example.com',
        phone: '11999999999',
        created_at: new Date().toISOString()
      };
      
      localStorage.setItem("musicaperfeita_user", JSON.stringify(testUser));
      setUserProfile(testUser);
      
      toast({
        title: "Modo de desenvolvimento",
        description: "Usuário de teste criado automaticamente",
      });
      
      return;
    }
    
    // Redirect to registration in production if no user is found
    if (!storedUser && process.env.NODE_ENV !== 'development') {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Header />
      <main className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {userProfile && (
            <h1 className="text-3xl font-bold mb-8">
              Olá, <span className="text-pink-500">{userProfile.name}</span>! Crie sua música perfeita!
            </h1>
          )}
          
          <ProgressIndicator currentProgress={currentProgress} />
          
          {userRequests.length > 0 && userRequests[0].preview_url && (
            <MusicPreviewPlayer previewUrl={userRequests[0].preview_url} />
          )}
          
          {userProfile && (
            <MusicRequestForm 
              userProfile={userProfile} 
              onRequestSubmitted={handleRequestSubmitted} 
            />
          )}
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-8 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <p>&copy; {new Date().getFullYear()} Musicaperfeita. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
