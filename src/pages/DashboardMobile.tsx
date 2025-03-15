
import React from "react";
import { UserProfile } from "@/types/database.types";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
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
    handleCancelRequestForm
  } = useDashboard();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-4">
        <DashboardHeader userProfile={userProfile} onLogout={onLogout} />
      </header>
      
      <main className="px-4 py-6">
        <div className="space-y-6">
          <section className="bg-white rounded-lg shadow p-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Painel de Controle
            </h2>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {!hasAnyRequest && (
                  <div className="text-center py-6">
                    <p className="text-gray-600 mb-4">
                      Você ainda não criou nenhuma música. Comece agora mesmo!
                    </p>
                    <button
                      onClick={handleCreateNewRequest}
                      className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Criar Minha Música
                    </button>
                  </div>
                )}
                
                {hasAnyRequest && !showNewRequestForm && (
                  <div className="flex flex-col items-center">
                    <p className="text-gray-700 mb-4">
                      {hasCompletedRequest
                        ? "Sua música está pronta! Veja abaixo."
                        : "Sua música está sendo processada. Aguarde!"}
                    </p>
                    {hasPreviewUrl && (
                      <div className="w-full bg-gray-100 p-4 rounded-lg mb-4">
                        <h3 className="font-medium text-lg mb-2">Prévia da sua música</h3>
                        <audio
                          controls
                          className="w-full mb-2"
                          src={latestRequest?.preview_url || ""}
                        >
                          Seu navegador não suporta o elemento de áudio.
                        </audio>
                      </div>
                    )}
                    
                    {!hasPaidRequest && (
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md transition-colors mt-4"
                      >
                        Pagar pela Música Completa
                      </button>
                    )}
                  </div>
                )}
                
                {showNewRequestForm && (
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Novo Pedido de Música</h3>
                    <p className="mb-4 text-sm text-gray-600">
                      Preencha as informações abaixo para criar sua música personalizada.
                    </p>
                    
                    <button
                      onClick={handleCancelRequestForm}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors text-sm mt-2"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashboardMobile;
