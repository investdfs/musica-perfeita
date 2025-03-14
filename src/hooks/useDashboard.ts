
import { useState, useEffect } from "react";
import { useMusicRequests } from "./useMusicRequests";
import { useRequestStatus } from "./useRequestStatus";
import { useUserAuth } from "./useUserAuth";

export const useDashboard = () => {
  const { userProfile, handleUserLogout } = useUserAuth();
  const {
    userRequests,
    currentProgress,
    showNewRequestForm,
    isLoading,
    handleRequestSubmitted,
    handleCreateNewRequest,
    fetchUserRequests,
    setUserRequests,
    setShowNewRequestForm
  } = useMusicRequests(userProfile);

  const {
    hasCompletedRequest,
    hasPreviewUrl,
    hasAnyRequest,
    hasPaidRequest,
    latestRequest
  } = useRequestStatus(userRequests);

  // Função para cancelar o formulário de pedido
  const handleCancelRequestForm = () => {
    // Apenas oculta o formulário
    setShowNewRequestForm(false);
    
    // Notificar o usuário que o pedido foi cancelado
    toast({
      title: "Pedido cancelado",
      description: "Você cancelou a criação do pedido de música.",
    });
  };

  return {
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
  };
};

// Importando toast
import { toast } from "./use-toast";
