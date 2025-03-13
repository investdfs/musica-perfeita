
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProgressIndicator from "@/components/dashboard/ProgressIndicator";
import MusicPreviewPlayer from "@/components/dashboard/MusicPreviewPlayer";
import MusicRequestForm from "@/components/dashboard/MusicRequestForm";
import OrderControlPanel from "@/components/dashboard/OrderControlPanel";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useDashboard } from "@/hooks/useDashboard";
import { useEffect } from "react";

const Dashboard = () => {
  const {
    userProfile,
    userRequests,
    currentProgress,
    showNewRequestForm,
    isLoading,
    hasCompletedRequest,
    hasPreviewUrl,
    hasAnyRequest,
    hasPaidRequest,
    handleRequestSubmitted,
    handleCreateNewRequest,
    handleUserLogout
  } = useDashboard();

  // Log para ajudar no diagnóstico
  console.log('[Dashboard] Estado atual:', {
    userRequestsCount: userRequests.length,
    showNewRequestForm,
    hasAnyRequest,
    renderOrderPanel: userRequests.length > 0 && !showNewRequestForm,
    renderFormCondition: userProfile && showNewRequestForm
  });
  
  // Verificação adicional para logs de diagnóstico
  useEffect(() => {
    console.log('[Dashboard] Estado atualizado:', {
      userRequestsLength: userRequests.length,
      showNewRequestForm,
      hasAnyRequest,
      temPedido: userRequests.length > 0,
      mostrarCaixaPedidos: !showNewRequestForm && userRequests.length > 0,
      userProfile: !!userProfile
    });
  }, [userRequests, showNewRequestForm, hasAnyRequest, userProfile]);

  // CORREÇÃO CRÍTICA: Verificar diretamente se deve mostrar o painel de controle de pedidos
  // Se temos pedidos, sempre mostramos o painel de pedidos, a menos que o formulário esteja visível
  const shouldShowOrderPanel = userRequests.length > 0 && !showNewRequestForm;
  
  // CORREÇÃO CRÍTICA: Verificar diretamente se deve mostrar o formulário
  // Só mostrar o formulário se explicitamente indicado e não houver pedidos OU se o usuário solicitou um novo pedido
  const shouldShowForm = userProfile && showNewRequestForm;

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
          <DashboardHeader userProfile={userProfile} onLogout={handleUserLogout} />
          
          <ProgressIndicator currentProgress={currentProgress} hasAnyRequest={hasAnyRequest} />
          
          {/* CORREÇÃO CRÍTICA: Usar variável de controle direta para exibir o painel de pedidos */}
          {shouldShowOrderPanel && (
            <OrderControlPanel 
              userRequests={userRequests} 
              onCreateNewRequest={handleCreateNewRequest}
              isLoading={isLoading}
            />
          )}
          
          {hasPreviewUrl && !showNewRequestForm && (
            <MusicPreviewPlayer 
              previewUrl={userRequests[0]?.preview_url || ''} 
              fullSongUrl={userRequests[0]?.full_song_url}
              isCompleted={hasCompletedRequest}
              paymentStatus={userRequests[0]?.payment_status || 'pending'}
            />
          )}
          
          {/* CORREÇÃO CRÍTICA: Usar variável de controle direta para exibir o formulário */}
          {shouldShowForm && (
            <MusicRequestForm 
              userProfile={userProfile} 
              onRequestSubmitted={handleRequestSubmitted}
              hasExistingRequest={userRequests.length > 0}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
