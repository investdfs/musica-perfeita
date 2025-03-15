
import React from "react";
import { UserProfile } from "@/types/database.types";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProgressIndicator from "@/components/dashboard/ProgressIndicator";
import MusicRequestForm from "@/components/dashboard/MusicRequestForm";
import OrderControlPanel from "@/components/dashboard/OrderControlPanel";
import { useDashboard } from "@/hooks/useDashboard";

interface DashboardMobileProps {
  userProfile: UserProfile;
  onLogout: () => void;
}

const DashboardMobile = ({ userProfile, onLogout }: DashboardMobileProps) => {
  const {
    userRequests,
    currentProgress,
    showNewRequestForm,
    isLoading,
    hasCompletedRequest,
    hasPreviewUrl,
    hasAnyRequest,
    hasPaidRequest,
    latestRequest,
    handleRequestSubmitted,
    handleCreateNewRequest,
    handleUserLogout,
    handleCancelRequestForm
  } = useDashboard();

  // Verificação rigorosa para determinar se devemos mostrar a prévia
  // Removendo completamente a exibição do componente MusicPreviewPlayer conforme solicitado
  const shouldShowPreview = false; // Desabilitando completamente esta funcionalidade

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-4">
        <DashboardHeader userProfile={userProfile} onLogout={onLogout} />
      </header>
      
      <main className="px-4 py-6">
        <div className="space-y-6">
          {/* Indicador de progresso - Mesmo componente da versão desktop */}
          <ProgressIndicator 
            currentProgress={currentProgress} 
            hasAnyRequest={hasAnyRequest} 
          />
          
          {/* Painel de controle de pedidos - Mesmo da versão desktop */}
          <OrderControlPanel 
            userRequests={userRequests} 
            onCreateNewRequest={handleCreateNewRequest}
            isLoading={isLoading}
          />
          
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
    </div>
  );
};

export default DashboardMobile;
