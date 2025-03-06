
import { useEffect, useState } from "react";
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
import { LogOut } from "lucide-react";

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRequests, setUserRequests] = useState<MusicRequest[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
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

  const fetchUserRequests = async () => {
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
        }
      }
    } catch (error) {
      console.error('Error fetching music requests:', error);
      setCurrentProgress(10);
    }
  };

  useEffect(() => {
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
    fetchUserRequests();
    setShowNewRequestForm(false);
    
    toast({
      title: "Pedido enviado com sucesso!",
      description: "Seu pedido foi recebido. Acompanhe o status aqui no painel.",
    });
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
              <Button
                onClick={handleUserLogout}
                variant="destructive"
                size="sm"
                className="flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
          )}
          
          <ProgressIndicator currentProgress={currentProgress} hasAnyRequest={userRequests.length > 0} />
          
          {!showNewRequestForm && (
            <OrderControlPanel 
              userProfile={userProfile}
              userRequests={userRequests}
              onNewRequestClick={() => setShowNewRequestForm(true)}
              onRefreshRequests={fetchUserRequests}
            />
          )}
          
          {hasPreviewUrl && !showNewRequestForm && (
            <MusicPreviewPlayer 
              previewUrl={userRequests[0].preview_url || ''} 
              fullSongUrl={userRequests[0].full_song_url}
              isCompleted={hasCompletedRequest}
            />
          )}
          
          {showNewRequestForm && userProfile && (
            <>
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-purple-700">Novo Pedido de Música</h2>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewRequestForm(false)}
                  className="text-sm"
                >
                  Voltar para meus pedidos
                </Button>
              </div>
              <MusicRequestForm 
                userProfile={userProfile} 
                onRequestSubmitted={handleRequestSubmitted}
                hasExistingRequest={false}
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
