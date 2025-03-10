
import { useState } from "react";
import { MusicRequest, UserProfile } from "@/types/database.types";
import RequestsList from "./RequestsList";
import RequestDetails from "./RequestDetails";
import DeliveryForm from "./DeliveryForm";
import { useRequestManagement } from "./useRequestManagement";

interface RequestsManagementProps {
  requests: MusicRequest[];
  users: UserProfile[];
  setRequests: (requests: MusicRequest[]) => void;
  isLoading: boolean;
  getUserEmail: (userId: string) => string | undefined;
}

const RequestsManagement = ({ 
  requests, 
  users, 
  setRequests, 
  isLoading,
  getUserEmail
}: RequestsManagementProps) => {
  const {
    selectedRequest,
    showDetails,
    setShowDetails,
    audioFile,
    setAudioFile,
    isUploading,
    showDeliveryForm,
    setShowDeliveryForm,
    handleViewDetails,
    handleDeliverMusic,
    handleSaveMusicUrl,
    handleSendEmail,
    handleFileUpload,
    handleUpdateStatus,
    handleDownloadFile
  } = useRequestManagement(requests, setRequests);

  const getUserName = (userId: string): string => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : userId;
  };

  return (
    <>
      <RequestsList
        requests={requests}
        isLoading={isLoading}
        getUserName={getUserName}
        onViewDetails={handleViewDetails}
        onUpdateStatus={handleUpdateStatus}
        onFileUpload={handleFileUpload}
        onDeliverMusic={handleDeliverMusic}
        onDownloadFile={handleDownloadFile}
        isUploading={isUploading}
        selectedRequestId={selectedRequest?.id || null}
      />

      <RequestDetails 
        showDetails={showDetails} 
        setShowDetails={setShowDetails} 
        selectedRequest={selectedRequest} 
        handleSaveMusicUrl={handleSaveMusicUrl} 
        isUploading={isUploading} 
      />

      <DeliveryForm 
        showDeliveryForm={showDeliveryForm}
        setShowDeliveryForm={setShowDeliveryForm}
        selectedRequest={selectedRequest}
        handleSendEmail={handleSendEmail}
        getUserName={getUserName}
        getUserEmail={getUserEmail}
      />
    </>
  );
};

export default RequestsManagement;
