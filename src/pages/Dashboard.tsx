import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import supabase from "@/lib/supabase";
import { MusicRequest, UserProfile } from "@/types/database.types";
import ProgressIndicator from "@/components/dashboard/ProgressIndicator";
import MusicPreviewPlayer from "@/components/dashboard/MusicPreviewPlayer";
import MusicRequestForm from "@/components/dashboard/MusicRequestForm";
import OrderControlPanel from "@/components/dashboard/OrderControlPanel";
import { toast } from "@/hooks/use-toast";
import { isDevelopmentOrPreview } from "@/lib/environment";
import { Button } from "@/components/ui/button";
import { Eye, LogOut, Music } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRequests, setUserRequests] = useState<MusicRequest[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const checkUserAuth = useCallback(() => {
    const storedUser = localStorage.getItem("musicaperfeita_user");
    
    if (!storedUser && isDevelopmentOrPreview()) {
      const testUser = {
        id: uuidv4(),
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
  }, [navigate]);

  const fetchUserRequests = useCallback(async () => {
    try {
      if (!userProfile?.id) return;
      
      if (userProfile.id === 'dev-user-id') {
        setUserRequests([]);
        setCurrentProgress(10);
        setShowNewRequestForm(true);
        setIsLoading(false);
        return;
      }
      
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
    
    const checkForStatusUpdates = async () => {
      try {
        if (userProfile.id === 'dev-user-id') {
          return;
        }
        
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
    };
    
    const intervalId = setInterval(checkForStatusUpdates, 30000);
    
    return () => clearInterval(intervalId);
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

  const hasCompletedRequest = userRequests.length > 0 && userRequests[0].status === 'completed';
  const hasPreviewUrl = userRequests.length > 0 && userRequests[0].preview_url;
  const hasAnyRequest = userRequests.length > 0;
  const hasPaidRequest = userRequests.length > 0 && userRequests[0].payment_status === 'completed';

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-indigo-50 to-white animate-gradient-background">
      <div className="animated-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <Header />
      <main className="py-12 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {userProfile && (
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">
                Olá, <span className="text-pink-500">{userProfile.name}</span>! Crie sua música perfeita!
              </h1>
              <button
                onClick={handleUserLogout}
                className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </div>
          )}
          
          <ProgressIndicator currentProgress={currentProgress} hasAnyRequest={userRequests.length > 0} />
          
          {!showNewRequestForm && (
            <OrderControlPanel 
              userRequests={userRequests} 
              onCreateNewRequest={handleCreateNewRequest}
              isLoading={isLoading}
            />
          )}
          
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8 mt-4 text-center border border-blue-100 transition-all hover:shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-purple-700">Acesso à sua música</h2>
            
            <Button 
              disabled={!(hasCompletedRequest && hasPaidRequest)}
              onClick={() => navigate("/minha-musica", { state: { musicRequest: userRequests[0] } })}
              className={`px-6 py-3 rounded-lg shadow-md transition-all text-lg w-full max-w-md ${
                hasCompletedRequest && hasPaidRequest 
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white" 
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              <Music className="mr-2 h-5 w-5" />
              ACESSAR MINHA MÚSICA PERSONALIZADA
            </Button>
            
            <p className="mt-3 text-gray-500 text-sm">
              {hasCompletedRequest && hasPaidRequest 
                ? "Sua música está pronta para acesso." 
                : "Este botão será liberado quando sua música estiver pronta."}
            </p>
          </div>
          
          {hasCompletedRequest && !hasPaidRequest && !showNewRequestForm && (
            <div className="text-center mb-8">
              <Button 
                onClick={() => navigate("/music-preview", { 
                  state: { musicRequest: userRequests[0] } 
                })}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-all"
              >
                <Eye className="mr-2 h-5 w-5" />
                Ver meu Pedido
              </Button>
            </div>
          )}
          
          {hasPreviewUrl && !showNewRequestForm && (
            <MusicPreviewPlayer 
              previewUrl={userRequests[0].preview_url || ''} 
              fullSongUrl={userRequests[0].full_song_url}
              isCompleted={hasCompletedRequest}
            />
          )}
          
          {userProfile && showNewRequestForm && (
            <MusicRequestForm 
              userProfile={userProfile} 
              onRequestSubmitted={handleRequestSubmitted}
              hasExistingRequest={false}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
