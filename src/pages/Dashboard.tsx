
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

  useEffect(() => {
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
      navigate("/cadastro");
      return;
    }
    
    const userInfo = storedUser ? JSON.parse(storedUser) : null;
    setUserProfile(userInfo);
    
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
            // Usuário cadastrado mas sem pedidos ainda
            setCurrentProgress(10);
          }
        }
      } catch (error) {
        console.error('Error fetching music requests:', error);
        // Mesmo com erro, mostrar que o cadastro foi realizado
        setCurrentProgress(10);
      }
    };
    
    if (userInfo) {
      fetchUserRequests();
    }
  }, [navigate]);

  const handleRequestSubmitted = (data: MusicRequest[]) => {
    setUserRequests([...data, ...userRequests]);
    setCurrentProgress(25);
  };

  const hasCompletedRequest = userRequests.length > 0 && userRequests[0].status === 'completed';
  const hasPreviewUrl = userRequests.length > 0 && userRequests[0].preview_url;
  const hasAnyRequest = userRequests.length > 0;

  // Configurar o polling para verificar atualizações a cada 30 segundos
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
    
    // Verificar atualizações imediatamente e depois a cada 30 segundos
    const intervalId = setInterval(checkForStatusUpdates, 30000);
    
    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, [userProfile]);

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
          
          <ProgressIndicator currentProgress={currentProgress} hasAnyRequest={hasAnyRequest} />
          
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
      <Footer />
    </div>
  );
};

export default Dashboard;
