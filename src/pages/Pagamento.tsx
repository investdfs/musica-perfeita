import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MusicRequest, UserProfile } from "@/types/database.types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Music, ShieldCheck, CreditCard, Clock, Lock, Headphones, Calendar, Heart, Tag, Mic, Sparkles, UserRound, BookOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { validateMusicRequest } from "@/utils/validationUtils";

interface PagamentoProps {
  userProfile: UserProfile | null;
}

const Pagamento = ({ userProfile }: PagamentoProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [musicRequest, setMusicRequest] = useState<MusicRequest | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  
  const verifyUserAccess = async (requestId: string, userId?: string) => {
    if (!userId) return false;
    
    try {
      const { data, error } = await supabase
        .from('music_requests')
        .select('user_id')
        .eq('id', requestId)
        .single();
      
      if (error) {
        console.error("Erro ao verificar acesso:", error);
        return false;
      }
      
      return data.user_id === userId;
    } catch (error) {
      console.error("Erro ao verificar permissão:", error);
      return false;
    }
  };
  
  useEffect(() => {
    const loadMusicRequestData = async () => {
      setIsLoading(true);
      
      try {
        if (location.state?.musicRequest) {
          console.log("Dados da música recebidos do state:", location.state.musicRequest);
          
          if (userProfile?.id) {
            const hasAccess = await verifyUserAccess(
              location.state.musicRequest.id, 
              userProfile.id
            );
            
            if (!hasAccess) {
              console.error("Usuário não tem permissão para acessar este pedido");
              toast({
                title: "Acesso negado",
                description: "Você não tem permissão para acessar este pedido",
                variant: "destructive",
              });
              navigate("/dashboard");
              return;
            }
          }
          
          const validatedRequest = validateMusicRequest(location.state.musicRequest);
          setMusicRequest(validatedRequest);
        } 
        else {
          const savedRequest = localStorage.getItem("current_music_request");
          
          if (savedRequest) {
            const parsedRequest = JSON.parse(savedRequest);
            console.log("Dados da música recuperados do localStorage:", parsedRequest);
            
            if (userProfile?.id) {
              const hasAccess = await verifyUserAccess(parsedRequest.id, userProfile.id);
              
              if (!hasAccess) {
                console.error("Usuário não tem permissão para acessar este pedido");
                toast({
                  title: "Acesso negado",
                  description: "Você não tem permissão para acessar este pedido",
                  variant: "destructive",
                });
                navigate("/dashboard");
                return;
              }
            }
            
            const validatedRequest = validateMusicRequest(parsedRequest);
            setMusicRequest(validatedRequest);
          } else {
            if (userProfile?.id) {
              console.log("Buscando pedidos do usuário do banco de dados");
              const { data, error } = await supabase
                .from('music_requests')
                .select('*')
                .eq('user_id', userProfile.id)
                .order('created_at', { ascending: false })
                .limit(1);
                
              if (error) {
                console.error("Erro ao buscar pedido:", error);
                toast({
                  title: "Erro",
                  description: "Não foi possível carregar os detalhes da música",
                  variant: "destructive",
                });
              } else if (data && data.length > 0) {
                console.log("Pedido encontrado no banco:", data[0]);
                
                const validatedRequest = validateMusicRequest(data[0]);
                setMusicRequest(validatedRequest);
              } else {
                console.error("Nenhum pedido encontrado para este usuário");
                toast({
                  title: "Erro",
                  description: "Você não possui pedidos de música",
                  variant: "destructive",
                });
                navigate("/dashboard");
              }
            } else {
              console.error("Usuário não está logado e não há dados do pedido");
              toast({
                title: "Erro",
                description: "Não foi possível carregar os detalhes da música",
                variant: "destructive",
              });
              navigate("/dashboard");
            }
          }
        }
      } catch (error) {
        console.error("Erro ao processar dados do pedido:", error);
        toast({
          title: "Erro",
          description: "Houve um problema ao carregar os detalhes. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMusicRequestData();
  }, [location.state, navigate, userProfile]);

  const handlePayment = () => {
    if (!musicRequest) {
      toast({
        title: "Erro",
        description: "Dados da música não disponíveis",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    const requestId = musicRequest.id;
    const userId = userProfile?.id || 'guest';
    
    const successUrl = `${window.location.origin}/confirmacao?request_id=${requestId}&user_id=${userId}&status=success`;
    const failureUrl = `${window.location.origin}/confirmacao?request_id=${requestId}&user_id=${userId}&status=failure`;
    
    console.log("URL de sucesso:", successUrl);
    console.log("URL de falha:", failureUrl);
    
    window.open("https://mpago.la/2WyrDAe", "_blank");
    
    setTimeout(() => {
      toast({
        title: "Pagamento iniciado!",
        description: "Acompanhe o processo no Mercado Pago.",
      });
      
      setIsProcessing(false);
      
      localStorage.setItem("payment_pending_request", JSON.stringify({
        requestId,
        userId,
        timestamp: new Date().toISOString()
      }));
      
      navigate("/confirmacao", { state: { musicRequest } });
    }, 2000);
  };

  const getRelationshipLabel = (type: string, custom?: string | null) => {
    const relationshipMap: Record<string, string> = {
      'esposa': 'Esposa',
      'noiva': 'Noiva',
      'namorada': 'Namorada',
      'amigo_especial': 'Amigo Especial',
      'partner': 'Parceiro(a)',
      'friend': 'Amigo(a)',
      'family': 'Familiar',
      'colleague': 'Colega',
      'mentor': 'Mentor(a)',
      'child': 'Filho(a)',
      'sibling': 'Irmão/Irmã',
      'parent': 'Pai/Mãe',
      'other': custom || 'Outro'
    };
    
    return relationshipMap[type] || type;
  };

  const getGenreLabel = (genre: string) => {
    const genreMap: Record<string, string> = {
      'romantic': 'Romântica',
      'mpb': 'MPB',
      'classical': 'Clássica',
      'jazz': 'Jazz',
      'hiphop': 'Hip Hop',
      'rock': 'Rock',
      'country': 'Country',
      'reggae': 'Reggae',
      'electronic': 'Eletrônica',
      'samba': 'Samba',
      'folk': 'Folk',
      'pop': 'Pop'
    };
    
    return genreMap[genre] || genre;
  };

  const getToneLabel = (tone?: string) => {
    if (!tone) return 'Não especificado';
    
    const toneMap: Record<string, string> = {
      'happy': 'Alegre',
      'romantic': 'Romântica',
      'nostalgic': 'Nostálgica',
      'fun': 'Divertida',
      'melancholic': 'Melancólica',
      'energetic': 'Energética',
      'peaceful': 'Tranquila',
      'inspirational': 'Inspiradora',
      'dramatic': 'Dramática',
      'uplifting': 'Motivadora',
      'reflective': 'Reflexiva',
      'mysterious': 'Misteriosa'
    };
    
    return toneMap[tone] || tone;
  };

  const getVoiceLabel = (voice?: string) => {
    if (!voice) return 'Não especificado';
    
    const voiceMap: Record<string, string> = {
      'male': 'Masculina',
      'female': 'Feminina',
      'male_romantic': 'Masculina Romântica',
      'female_romantic': 'Feminina Romântica',
      'male_folk': 'Masculina Folk',
      'female_folk': 'Feminina Folk',
      'male_deep': 'Masculina Profunda',
      'female_powerful': 'Feminina Poderosa',
      'male_soft': 'Masculina Suave',
      'female_sweet': 'Feminina Doce',
      'male_jazzy': 'Masculina Jazz',
      'female_jazzy': 'Feminina Jazz',
      'male_rock': 'Masculina Rock',
      'female_rock': 'Feminina Rock',
      'male_country': 'Masculina Country',
      'female_country': 'Feminina Country'
    };
    
    return voiceMap[voice] || voice;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Header />
      
      <div className="animated-shapes opacity-50">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      <main className="py-16 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent animate-gradient-background">
            Música Perfeita Aguarda Você!
          </h1>
          
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto text-lg">
            Estamos a apenas um passo de criar sua música personalizada. 
            Complete o pagamento para desbloquear sua experiência musical única.
          </p>
          
          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando detalhes do seu pedido...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-10">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <Music className="h-6 w-6 mr-3" />
                    Resumo da Sua Música
                  </h2>
                </div>
                
                <div className="p-6">
                  {musicRequest ? (
                    <div className="space-y-5">
                      <div className="flex flex-col md:flex-row gap-4 pb-4 border-b border-gray-100">
                        <div className="w-full md:w-1/3 aspect-square rounded-lg overflow-hidden bg-purple-50 border border-purple-100 relative flex-shrink-0">
                          {musicRequest.cover_image_url ? (
                            <img 
                              src={musicRequest.cover_image_url} 
                              alt="Capa da música" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100">
                              <Music className="h-16 w-16 text-purple-300" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start mb-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <Heart className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-xl text-gray-800">Música Personalizada</h3>
                              <p className="text-indigo-600 font-medium">Para: {musicRequest.honoree_name}</p>
                              <p className="text-gray-500 text-sm mt-1">
                                Relacionamento: {getRelationshipLabel(musicRequest.relationship_type, musicRequest.custom_relationship)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                            <div className="flex items-center">
                              <Tag className="h-4 w-4 text-indigo-500 mr-2" />
                              <span className="text-sm">
                                <span className="text-gray-500">Gênero:</span> {' '}
                                <span className="font-medium text-gray-700">{getGenreLabel(musicRequest.music_genre)}</span>
                              </span>
                            </div>
                            
                            <div className="flex items-center">
                              <Mic className="h-4 w-4 text-indigo-500 mr-2" />
                              <span className="text-sm">
                                <span className="text-gray-500">Voz:</span> {' '}
                                <span className="font-medium text-gray-700">{getVoiceLabel(musicRequest.voice_type)}</span>
                              </span>
                            </div>
                            
                            <div className="flex items-center">
                              <Sparkles className="h-4 w-4 text-indigo-500 mr-2" />
                              <span className="text-sm">
                                <span className="text-gray-500">Tom:</span> {' '}
                                <span className="font-medium text-gray-700">{getToneLabel(musicRequest.music_tone)}</span>
                              </span>
                            </div>
                            
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-indigo-500 mr-2" />
                              <span className="text-sm">
                                <span className="text-gray-500">Solicitado em:</span> {' '}
                                <span className="font-medium text-gray-700">{formatDate(musicRequest.created_at)}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {musicRequest.story && (
                          <div className="bg-indigo-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <BookOpen className="h-4 w-4 text-indigo-600 mr-2" />
                              <h4 className="font-medium text-indigo-800">História</h4>
                            </div>
                            <p className="text-sm text-gray-700">
                              {musicRequest.story}
                            </p>
                          </div>
                        )}
                        
                        {musicRequest.include_names && musicRequest.names_to_include && (
                          <div className="bg-pink-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <UserRound className="h-4 w-4 text-pink-600 mr-2" />
                              <h4 className="font-medium text-pink-800">Nomes incluídos</h4>
                            </div>
                            <p className="text-sm text-gray-700">{musicRequest.names_to_include}</p>
                          </div>
                        )}
                        
                        {musicRequest.music_focus && (
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Headphones className="h-4 w-4 text-purple-600 mr-2" />
                              <h4 className="font-medium text-purple-800">Foco da música</h4>
                            </div>
                            <p className="text-sm text-gray-700">{musicRequest.music_focus}</p>
                          </div>
                        )}
                        
                        {musicRequest.happy_memory && (
                          <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Heart className="h-4 w-4 text-green-600 mr-2" />
                              <h4 className="font-medium text-green-800">Memória Feliz</h4>
                            </div>
                            <p className="text-sm text-gray-700">{musicRequest.happy_memory}</p>
                          </div>
                        )}
                        
                        {musicRequest.sad_memory && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Heart className="h-4 w-4 text-blue-600 mr-2" />
                              <h4 className="font-medium text-blue-800">Memória Triste</h4>
                            </div>
                            <p className="text-sm text-gray-700">{musicRequest.sad_memory}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center py-2 px-4 bg-yellow-50 rounded-lg border border-yellow-100">
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                          <span className="text-sm font-medium text-yellow-800">
                            Status: {musicRequest.payment_status === 'completed' ? 'Pagamento Confirmado' : 'Aguardando Pagamento'}
                          </span>
                        </div>
                        <div className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Prévia disponível
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Music className="h-8 w-8 text-red-500" />
                      </div>
                      <p className="text-gray-500 mb-4">Detalhes da música não disponíveis.</p>
                      <Button 
                        onClick={() => navigate('/dashboard')} 
                        variant="outline"
                        className="mx-auto"
                      >
                        Voltar ao Dashboard
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <CreditCard className="h-6 w-6 mr-3" />
                    Finalizar Pagamento
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Valor</h3>
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <span className="text-gray-700 font-medium">Total a pagar</span>
                      <span className="text-2xl font-bold text-purple-700">R$ 79,90</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 text-right">Pagamento único, sem assinaturas</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="relative overflow-hidden rounded-xl border border-gray-200 mb-8">
                      <img 
                        src="https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/chamada-pix-mercado-pago.jpg" 
                        alt="Mercado Pago - Pagamento via PIX" 
                        className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-300"
                        style={{ maxHeight: "180px" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-end">
                        <p className="text-white p-3 font-medium text-sm">Pague via PIX ou cartão de crédito</p>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handlePayment} 
                      className="w-full h-14 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 group"
                      disabled={isProcessing || !musicRequest}
                    >
                      <Lock className="mr-2 h-5 w-5 text-indigo-200 group-hover:animate-pulse" />
                      {isProcessing ? "Processando..." : "Pagar com Mercado Pago"}
                    </Button>
                    
                    <div className="mt-6 space-y-3">
                      <div className="flex items-start">
                        <div className="bg-green-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <p className="text-sm text-gray-600">
                          Acesso instantâneo à sua música personalizada após confirmação do pagamento.
                        </p>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-green-100 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <p className="text-sm text-gray-600">
                          Download em alta qualidade para ouvir quando e onde quiser.
                        </p>
                      </div>
                      
                      <div className="flex items-start">
                        <ShieldCheck className="h-5 w-5 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600">
                          Transação 100% segura. Satisfação garantida ou seu dinheiro de volta.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
            <h3 className="text-xl font-bold text-center mb-8 text-gray-800">Por que escolher a Música Perfeita?</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 hover:bg-purple-50 rounded-xl transition-colors duration-300">
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="h-6 w-6 text-indigo-600" />
                </div>
                <h4 className="font-medium mb-2 text-gray-800">Qualidade Profissional</h4>
                <p className="text-sm text-gray-600">Músicas compostas e produzidas por artistas experientes com estúdio profissional.</p>
              </div>
              
              <div className="text-center p-4 hover:bg-purple-50 rounded-xl transition-colors duration-300">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-medium mb-2 text-gray-800">Entrega Rápida</h4>
                <p className="text-sm text-gray-600">Sua música estará pronta e disponível para download imediatamente após o pagamento.</p>
              </div>
              
              <div className="text-center p-4 hover:bg-purple-50 rounded-xl transition-colors duration-300">
                <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="h-6 w-6 text-pink-600" />
                </div>
                <h4 className="font-medium mb-2 text-gray-800">Garantia de Satisfação</h4>
                <p className="text-sm text-gray-600">Se não ficar satisfeito, devolvemos seu dinheiro sem questionamentos.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pagamento;
