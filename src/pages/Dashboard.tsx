
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProgressIndicator from "@/components/dashboard/ProgressIndicator";
import MusicPreviewPlayer from "@/components/dashboard/MusicPreviewPlayer";
import MusicRequestForm from "@/components/dashboard/MusicRequestForm";
import OrderControlPanel from "@/components/dashboard/OrderControlPanel";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useDashboard } from "@/hooks/useDashboard";
import { UserProfile } from "@/types/database.types";

interface DashboardProps {
  userProfile: UserProfile;
  onLogout: () => void;
}

const Dashboard = ({ userProfile, onLogout }: DashboardProps) => {
  const {
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
    handleUserLogout,
    handleCancelRequestForm
  } = useDashboard();

  // Verificação rigorosa para determinar se devemos mostrar a prévia
  // Removendo completamente a exibição do componente MusicPreviewPlayer conforme solicitado
  const shouldShowPreview = false; // Desabilitando completamente esta funcionalidade

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
          <DashboardHeader userProfile={userProfile} onLogout={onLogout} />
          
          <ProgressIndicator 
            currentProgress={currentProgress} 
            hasAnyRequest={hasAnyRequest} 
          />
          
          {/* Painel de controle de pedidos - SEMPRE visível */}
          <OrderControlPanel 
            userRequests={userRequests} 
            onCreateNewRequest={handleCreateNewRequest}
            isLoading={isLoading}
          />
          
          {/* Player de prévia de música - agora nunca será exibido devido à condição shouldShowPreview = false */}
          {shouldShowPreview && !showNewRequestForm && (
            <MusicPreviewPlayer 
              previewUrl={userRequests[0]?.preview_url || ''} 
              fullSongUrl={userRequests[0]?.full_song_url}
              isCompleted={hasCompletedRequest}
              paymentStatus={userRequests[0]?.payment_status || 'pending'}
              requestId={userRequests[0]?.id}
            />
          )}
          
          {/* Formulário de pedido de música, mostrado apenas se solicitado explicitamente */}
          {showNewRequestForm && userProfile && (
            <MusicRequestForm 
              userProfile={userProfile} 
              onRequestSubmitted={handleRequestSubmitted}
              hasExistingRequest={userRequests.length > 0}
              onCancel={handleCancelRequestForm}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
