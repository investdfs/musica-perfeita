
import { useUserAuth } from "./useUserAuth";
import { useMusicRequests } from "./useMusicRequests";
import { useRequestStatus } from "./useRequestStatus";

export const useDashboard = () => {
  const { userProfile, handleUserLogout } = useUserAuth();
  
  const {
    userRequests,
    currentProgress,
    showNewRequestForm,
    isLoading,
    handleRequestSubmitted,
    handleCreateNewRequest
  } = useMusicRequests(userProfile);
  
  const {
    hasCompletedRequest,
    hasPreviewUrl,
    hasAnyRequest,
    hasPaidRequest
  } = useRequestStatus(userRequests);

  return {
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
  };
};
