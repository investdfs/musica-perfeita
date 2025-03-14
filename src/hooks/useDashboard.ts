
import { useState, useEffect } from "react";
import { useMusicRequests } from "./useMusicRequests";
import { useRequestStatus } from "./useRequestStatus";
import { useUserAuth } from "./useUserAuth";
import { toast } from "./use-toast";

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
    setShowNewRequestForm,
    handleCancelRequestForm
  } = useMusicRequests(userProfile);

  const {
    hasCompletedRequest,
    hasPreviewUrl,
    hasAnyRequest,
    hasPaidRequest,
    latestRequest
  } = useRequestStatus(userRequests);

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
