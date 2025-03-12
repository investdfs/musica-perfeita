
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProgressIndicator from "@/components/dashboard/ProgressIndicator";
import MusicPreviewPlayer from "@/components/dashboard/MusicPreviewPlayer";
import MusicRequestForm from "@/components/dashboard/MusicRequestForm";
import OrderControlPanel from "@/components/dashboard/OrderControlPanel";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useDashboard } from "@/hooks/useDashboard";

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
          
          {!showNewRequestForm && (
            <OrderControlPanel 
              userRequests={userRequests} 
              onCreateNewRequest={handleCreateNewRequest}
              isLoading={isLoading}
            />
          )}
          
          {hasPreviewUrl && !showNewRequestForm && (
            <MusicPreviewPlayer 
              previewUrl={userRequests[0].preview_url || ''} 
              fullSongUrl={userRequests[0].full_song_url}
              isCompleted={hasCompletedRequest}
              paymentStatus={userRequests[0].payment_status || 'pending'}
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
