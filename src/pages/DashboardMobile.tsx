
import React from "react";
import { UserProfile } from "@/types/database.types";
import { LogOut, Music, PlusCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useDashboard } from "@/hooks/useDashboard";
import Footer from "@/components/Footer";
import FormIntroduction from "@/components/dashboard/FormIntroduction";
import MusicRequestForm from "@/components/dashboard/MusicRequestForm";

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
    hasAnyRequest,
    handleRequestSubmitted,
    handleCreateNewRequest,
    handleCancelRequestForm
  } = useDashboard();

  const statusLabels = {
    pending: "Aguardando produção",
    in_production: "Em produção",
    completed: "Concluído"
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    in_production: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800"
  };

  const paymentStatusColors = {
    pending: "bg-orange-100 text-orange-800",
    completed: "bg-green-100 text-green-800"
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-indigo-50 to-white">
      {/* Header com nome do usuário e botão de logout */}
      <header className="sticky top-0 z-40 bg-white shadow-sm px-4 py-3">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            MúsicaPerfeita
          </h1>
          <button
            onClick={onLogout}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-md text-sm"
          >
            <LogOut className="h-3 w-3" />
            <span>Sair</span>
          </button>
        </div>
      </header>

      <main className="px-4 py-6">
        {/* Saudação ao usuário */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Olá, <span className="text-pink-500">{userProfile.name}</span>!
          </h2>
          <p className="text-sm text-gray-600">
            Crie sua música perfeita agora mesmo.
          </p>
        </div>

        {/* Indicador de progresso */}
        {hasAnyRequest && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-medium text-gray-800 mb-2">Status do seu pedido:</h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-pink-600 bg-pink-200">
                    {currentProgress === 1 && "Aguardando produção"}
                    {currentProgress === 2 && "Em produção"}
                    {currentProgress === 3 && "Concluído"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-pink-600">
                    {Math.round((currentProgress / 3) * 100)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-pink-200">
                <div
                  style={{ width: `${(currentProgress / 3) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500"
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de pedidos existentes */}
        {hasAnyRequest && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-2">Seus pedidos:</h3>
            <div className="space-y-3">
              {userRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={request.id} className="border-b-0">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50">
                        <div className="flex items-center justify-between w-full pr-2">
                          <div className="flex items-center">
                            <Music className="h-4 w-4 text-pink-500 mr-2" />
                            <span className="font-medium">{request.honoree_name}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[request.status as keyof typeof statusColors]}`}>
                              {statusLabels[request.status as keyof typeof statusLabels]}
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="text-sm space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-gray-500">Relacionamento:</p>
                              <p className="font-medium">{request.custom_relationship || request.relationship_type}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Gênero musical:</p>
                              <p className="font-medium">{request.music_genre}</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-gray-500">História:</p>
                            <p className="text-xs text-gray-700 line-clamp-3">{request.story}</p>
                          </div>
                          
                          <div className="pt-2">
                            <p className="text-gray-500 mb-1">Status do pagamento:</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${paymentStatusColors[request.payment_status as keyof typeof paymentStatusColors] || 'bg-gray-100 text-gray-800'}`}>
                              {request.payment_status === 'completed' ? 'Pago' : 'Pendente'}
                            </span>
                          </div>
                          
                          {request.status === 'completed' && request.payment_status !== 'completed' && (
                            <div className="pt-2">
                              <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                                Realizar Pagamento
                              </Button>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botão para criar novo pedido */}
        {!showNewRequestForm && (
          <div className="mb-6">
            <Button 
              onClick={handleCreateNewRequest}
              className="w-full bg-pink-600 hover:bg-pink-700" 
              disabled={isLoading}
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              {hasAnyRequest ? 'Criar Outro Pedido' : 'Criar Seu Primeiro Pedido'}
            </Button>
          </div>
        )}

        {/* Formulário de pedido */}
        {showNewRequestForm && (
          <div className="mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <FormIntroduction />
              <MusicRequestForm 
                userProfile={userProfile} 
                onRequestSubmitted={handleRequestSubmitted}
                hasExistingRequest={userRequests.length > 0}
                onCancel={handleCancelRequestForm}
              />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default DashboardMobile;
