import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { MusicRequest, UserProfile } from "@/types/database.types";
import supabase from "@/lib/supabase";
import { isDevelopmentOrPreview } from "@/lib/environment";
import { Download, Share2, Play, User, ShieldAlert, ExternalLink } from "lucide-react";

const Confirmacao = () => {
  const [showTerms, setShowTerms] = useState(true);
  const [countdown, setCountdown] = useState(15);
  const [canAgree, setCanAgree] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [musicRequest, setMusicRequest] = useState<MusicRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUserAuth = async () => {
      setIsLoading(true);
      
      const storedUser = localStorage.getItem("musicaperfeita_user");
      
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
      
      const stateRequest = location.state?.musicRequest as MusicRequest | undefined;
      
      if (stateRequest) {
        setMusicRequest(stateRequest);
        setIsLoading(false);
        return;
      }
      
      if (userInfo?.id) {
        try {
          const { data, error } = await supabase
            .from('music_requests')
            .select('*')
            .eq('user_id', userInfo.id)
            .eq('payment_status', 'completed')
            .order('created_at', { ascending: false })
            .limit(1);
            
          if (error) {
            throw error;
          }
          
          if (data && data.length > 0) {
            setMusicRequest(data[0] as MusicRequest);
          } else {
            toast({
              title: "Nenhuma música encontrada",
              description: "Você ainda não possui músicas com pagamento confirmado",
              variant: "destructive",
            });
            navigate("/dashboard");
          }
        } catch (error) {
          console.error('Error fetching music request:', error);
          toast({
            title: "Erro ao carregar dados",
            description: "Não foi possível carregar suas informações",
            variant: "destructive",
          });
        }
      }
      
      setIsLoading(false);
    };
    
    checkUserAuth();
  }, [navigate, location.state]);

  useEffect(() => {
    if (countdown > 0 && showTerms) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanAgree(true);
    }
  }, [countdown, showTerms]);

  const handleAgree = () => {
    setAgreed(true);
    setShowTerms(false);
    toast({
      title: "Termos aceitos",
      description: "Você agora pode baixar e compartilhar sua música!",
    });
  };

  const handleDownload = () => {
    if (!musicRequest?.full_song_url) {
      toast({
        title: "Link indisponível",
        description: "O link para download não está disponível no momento",
        variant: "destructive",
      });
      return;
    }
    
    if (musicRequest.full_song_url.includes('soundcloud.com')) {
      window.open(musicRequest.full_song_url, '_blank');
      
      toast({
        title: "Redirecionando para o SoundCloud",
        description: "Abrindo sua música no SoundCloud...",
      });
    } else {
      const link = document.createElement('a');
      link.href = musicRequest.full_song_url;
      link.download = `Musica_para_${musicRequest.honoree_name}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download iniciado",
        description: "Sua música está sendo baixada...",
      });
    }
  };

  const handleShare = () => {
    if (navigator.share && musicRequest) {
      navigator.share({
        title: `Música personalizada para ${musicRequest.honoree_name}`,
        text: 'Ouça essa música personalizada que eu criei!',
        url: window.location.href,
      })
      .then(() => {
        toast({
          title: "Compartilhado com sucesso",
          description: "Sua música foi compartilhada",
        });
      })
      .catch((error) => {
        console.error('Error sharing:', error);
        toast({
          title: "Erro ao compartilhar",
          description: "Não foi possível compartilhar sua música",
          variant: "destructive",
        });
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copiado",
        description: "O link para sua música foi copiado para a área de transferência",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando sua música...</p>
        </div>
      </div>
    );
  }

  if (!musicRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <Header />
        <main className="py-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              Nenhuma música encontrada
            </h1>
            <p className="mb-8 text-gray-600">
              Você ainda não possui músicas com pagamento confirmado.
            </p>
            <Button onClick={() => navigate("/dashboard")}>
              Voltar ao Dashboard
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isSoundCloudEmbed = musicRequest?.preview_url?.includes('soundcloud.com') || 
                            musicRequest?.preview_url?.includes('w.soundcloud.com');

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Header />
      <main className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 bg-gradient-to-r from-yellow-400 via-pink-500 to-green-400 bg-clip-text text-transparent">
            Pagamento Confirmado! Aproveite sua música!
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 text-center mb-8">
            {userProfile && (
              <div className="mb-6 flex items-center justify-center">
                <div className="bg-purple-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-3 text-left">
                  <p className="text-sm text-gray-500">Personalizado para</p>
                  <p className="font-medium">{userProfile.name}</p>
                </div>
              </div>
            )}
            
            <h2 className="text-2xl font-semibold mb-6">
              Sua música para {musicRequest.honoree_name} está pronta!
            </h2>
            
            <div className="mb-8">
              {isSoundCloudEmbed ? (
                <div className="aspect-video w-full mb-4">
                  <iframe 
                    width="100%" 
                    height="166"
                    scrolling="no" 
                    frameBorder="no" 
                    src={musicRequest.preview_url || ''}
                    allow="autoplay"
                    className="rounded-lg"
                  ></iframe>
                </div>
              ) : (
                <audio 
                  controls 
                  className="w-full mb-4"
                  src={musicRequest.full_song_url || musicRequest.preview_url || '#'} 
                >
                  Seu navegador não suporta áudio HTML5.
                </audio>
              )}
              <p className="text-sm text-gray-500">
                Música no estilo {musicRequest.music_genre}, criada especialmente para {musicRequest.honoree_name}
              </p>
            </div>
            
            <div className="flex justify-center gap-4 mb-10">
              {!isSoundCloudEmbed && (
                <Button 
                  className="flex items-center bg-purple-600 hover:bg-purple-700"
                  onClick={() => {
                    const audioElement = document.querySelector('audio');
                    if (audioElement) {
                      audioElement.play();
                    }
                  }}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Ouvir
                </Button>
              )}
              
              <Button 
                onClick={handleDownload} 
                disabled={!agreed}
                className={`flex items-center ${isSoundCloudEmbed ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} ${!agreed ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSoundCloudEmbed ? (
                  <>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Abrir no SoundCloud
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </>
                )}
              </Button>
              
              <Button 
                onClick={handleShare}
                disabled={!agreed}
                className={`flex items-center bg-blue-600 hover:bg-blue-700 ${!agreed ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Compartilhar
              </Button>
            </div>
            
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-4">Como usar sua música?</h3>
              <ul className="text-left space-y-2">
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span>Entregue em um convite especial para um evento.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span>Grave em canecas ou brindes personalizados.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span>Toque em um jantar romântico ou festa familiar.</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Button 
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="w-full"
            >
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </main>
      
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="max-w-md bg-white p-6 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600 flex items-center">
              <ShieldAlert className="mr-2 h-5 w-5" />
              Aviso Importante
            </DialogTitle>
            <DialogDescription className="text-base">
              Esta música é uma criação personalizada para uso individual, entre amigos e familiares. 
              Não possui direitos autorais, sendo estritamente proibida sua comercialização, 
              monetização ou distribuição em plataformas públicas. Respeite os termos para 
              preservar a essência pessoal desta obra.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 space-y-4">
            <div className="p-3 bg-red-50 border border-red-200 rounded text-center">
              <span className="font-medium">Aguarde {countdown} segundos</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                disabled={!canAgree} 
                checked={canAgree && agreed}
                onCheckedChange={() => setAgreed(!agreed)}
              />
              <label 
                htmlFor="terms" 
                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                  !canAgree ? 'text-gray-400' : ''
                }`}
              >
                Concordo com os termos
              </label>
            </div>
            
            <Button 
              className="w-full" 
              disabled={!canAgree || !agreed}
              onClick={handleAgree}
            >
              Concordo com os Termos
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Confirmacao;
