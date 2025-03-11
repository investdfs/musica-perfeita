
import { MusicRequest } from "@/types/database.types";

export const useRequestStatus = (userRequests: MusicRequest[]) => {
  const hasCompletedRequest = userRequests.length > 0 && userRequests[0].status === 'completed';
  const hasPreviewUrl = userRequests.length > 0 && userRequests[0].preview_url;
  const hasAnyRequest = userRequests.length > 0;
  const hasPaidRequest = userRequests.length > 0 && userRequests[0].payment_status === 'completed';

  return {
    hasCompletedRequest,
    hasPreviewUrl,
    hasAnyRequest,
    hasPaidRequest
  };
};
