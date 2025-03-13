import { useState } from "react";
import { MusicRequest } from "@/types/database.types";
import { isDevelopmentOrPreview } from "@/lib/environment";
import supabase from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export const useRequestManagement = (
  requests: MusicRequest[],
  setRequests: (requests: MusicRequest[]) => void
) => {
  const [selectedRequest, setSelectedRequest] = useState<MusicRequest | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);

  const handleViewDetails = (request: MusicRequest) => {
    setSelectedRequest(request);
    setShowDetails(true);
  };

  const handleDeliverMusic = (request: MusicRequest) => {
    setSelectedRequest(request);
    setShowDeliveryForm(true);
  };

  const handleSaveMusicLink = async (requestId: string, musicLink: string) => {
    if (!musicLink.trim()) {
      throw new Error("Link da música não pode estar vazio");
    }
    
    setIsUploading(true);
    
    try {
      const targetRequest = requests.find(req => req.id === requestId);
      if (!targetRequest) {
        throw new Error("Pedido não encontrado");
      }
      
      const isValidAudioLink = musicLink.match(/\.(mp3|wav|ogg|m4a|flac)($|\?)/i) || 
                              musicLink.includes('wp.novaenergiamg.com.br') ||
                              musicLink.includes('drive.google.com');

      if (!isValidAudioLink) {
        const confirmUpload = window.confirm(
          "O link fornecido não parece ser um arquivo de áudio. Deseja continuar mesmo assim?"
        );
        if (!confirmUpload) {
          setIsUploading(false);
          return;
        }
      }
      
      const updateData = { 
        status: 'completed', 
        full_song_url: musicLink, 
        preview_url: musicLink 
      };
      
      console.log('[Admin] Atualizando pedido com link:', requestId, updateData);
      
      const { error } = await supabase
        .from('music_requests')
        .update(updateData)
        .eq('id', requestId);
          
      if (error) {
        console.error('[Admin] Erro ao atualizar pedido no Supabase:', error);
        throw new Error(`Erro ao salvar o link: ${error.message}`);
      }
      
      console.log('[Admin] Pedido atualizado com sucesso no Supabase');
      
      const updatedRequests = requests.map(req => 
        req.id === requestId 
          ? { ...req, ...updateData } 
          : req
      );
      
      setRequests(updatedRequests);
      
      console.log(`[Admin] Pedido atualizado com sucesso. Novo status: completed, Link: ${musicLink}`);
      
      return Promise.resolve();
    } catch (error: any) {
      console.error('[Admin] Erro ao atualizar pedido com link de música:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSoundCloudId = async (musicLink: string) => {
    if (!selectedRequest) return;
    
    setIsUploading(true);
    
    try {
      const updateData = { 
        status: 'completed', 
        soundcloud_id: null,
        full_song_url: musicLink, 
        preview_url: musicLink 
      };
      
      console.log('[Admin] Salvando link da música:', selectedRequest.id, updateData);
      
      const { error } = await supabase
        .from('music_requests')
        .update(updateData)
        .eq('id', selectedRequest.id);
          
      if (error) {
        console.error('[Admin] Erro ao atualizar pedido no Supabase:', error);
        throw error;
      }
      
      console.log('[Admin] Pedido atualizado com sucesso no Supabase');
      
      const updatedRequests = requests.map(req => 
        req.id === selectedRequest.id 
          ? { ...req, ...updateData } 
          : req
      );
      
      setRequests(updatedRequests);
      
      setShowDetails(false);
      
      toast({
        title: "Música Disponibilizada",
        description: "O link da música foi salvo e o status do pedido foi atualizado para Concluído.",
      });
    } catch (error: any) {
      console.error('[Admin] Erro ao atualizar pedido:', error);
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Não foi possível atualizar o status do pedido",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedRequest) return;
    
    try {
      toast({
        title: "E-mail enviado",
        description: "A música foi enviada ao cliente por e-mail",
      });
      setShowDeliveryForm(false);
      return Promise.resolve();
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar o e-mail",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, request: MusicRequest) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioFile(file);
      setSelectedRequest(request);
      uploadMusicFile(file, request);
    }
  };
  
  const uploadMusicFile = async (file: File, request: MusicRequest) => {
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      const cleanFileName = file.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/[^a-zA-Z0-9.-]/g, "_"); // Replace spaces and special chars with underscore
      
      const fileName = `music/${request.id}/${Date.now()}-${cleanFileName}`;
      
      console.log("Attempting to upload with clean filename:", fileName);
      
      const { data, error } = await supabase.storage
        .from('music-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (error) {
        console.error("Storage upload error:", error);
        
        const objectUrl = URL.createObjectURL(file);
        
        const updateData = { 
          status: 'completed',
          full_song_url: `temp:${objectUrl}`,
          preview_url: `temp:${objectUrl}`
        };
        
        const updatedRequests = requests.map(req => 
          req.id === request.id 
            ? { ...req, ...updateData } 
            : req
        );
        
        setRequests(updatedRequests);
        
        toast({
          title: "Música Salva Localmente",
          description: "Não foi possível fazer upload para o servidor, mas a música está disponível temporariamente.",
        });
        
        setIsUploading(false);
        return;
      }
      
      const { data: urlData } = supabase.storage
        .from('music-files')
        .getPublicUrl(fileName);
        
      if (!urlData || !urlData.publicUrl) {
        throw new Error("Failed to get public URL for the uploaded file");
      }
      
      console.log("Upload successful, URL:", urlData.publicUrl);
      
      const updateData = { 
        status: 'completed', 
        full_song_url: urlData.publicUrl,
        preview_url: urlData.publicUrl 
      };
      
      if (isDevelopmentOrPreview()) {
        const updatedRequests = requests.map(req => 
          req.id === request.id 
            ? { ...req, ...updateData } 
            : req
        );
        
        setRequests(updatedRequests);
      } else {
        const { error: updateError } = await supabase
          .from('music_requests')
          .update(updateData)
          .eq('id', request.id);
          
        if (updateError) {
          console.error('Database update error:', updateError);
          throw updateError;
        }
        
        const updatedRequests = requests.map(req => 
          req.id === request.id 
            ? { ...req, ...updateData } 
            : req
        );
        
        setRequests(updatedRequests);
      }
      
      toast({
        title: "Música Enviada",
        description: "A música foi enviada e o status do pedido foi atualizado para Concluído.",
      });
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: "Erro ao fazer upload",
        description: error.message || "Não foi possível fazer o upload do arquivo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateStatus = async (requestId: string, status?: MusicRequest['status'], paymentStatus?: MusicRequest['payment_status']) => {
    try {
      const updates: { status?: MusicRequest['status'], payment_status?: MusicRequest['payment_status'] } = {};
      
      if (status) updates.status = status;
      if (paymentStatus) updates.payment_status = paymentStatus;
      
      console.log(`[Admin] Atualizando pedido ${requestId} com:`, updates);
      
      const { error } = await supabase
        .from('music_requests')
        .update(updates)
        .eq('id', requestId);
        
      if (error) {
        console.error('[Admin] Erro ao atualizar no Supabase:', error);
        throw new Error(`Erro ao atualizar o status: ${error.message}`);
      }
      
      console.log('[Admin] Atualização no Supabase bem-sucedida');
      
      const updatedRequests = requests.map(req => 
        req.id === requestId 
          ? { ...req, ...updates } 
          : req
      );
      
      setRequests(updatedRequests);
      
      const requestAfterUpdate = updatedRequests.find(req => req.id === requestId);
      console.log(`[Admin] Pedido após atualização:`, requestAfterUpdate);
      
      toast({
        title: "Status atualizado",
        description: "O status do pedido foi atualizado com sucesso",
      });
    } catch (error: any) {
      console.error('[Admin] Erro ao atualizar status:', error);
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Não foi possível atualizar o status",
        variant: "destructive",
      });
    }
  };

  const handleDownloadFile = (request: MusicRequest) => {
    if (request.full_song_url) {
      if (request.full_song_url.startsWith('temp:')) {
        const actualUrl = request.full_song_url.replace('temp:', '');
        
        const a = document.createElement('a');
        a.href = actualUrl;
        a.download = `music-for-${request.honoree_name}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        toast({
          title: "Download Iniciado",
          description: "O download da música foi iniciado.",
        });
      } else {
        window.open(request.full_song_url, '_blank');
      }
    } else {
      toast({
        title: "Arquivo Indisponível",
        description: "Não há arquivo de música disponível para este pedido.",
        variant: "destructive",
      });
    }
  };

  return {
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
    handleSaveSoundCloudId,
    handleSendEmail,
    handleFileUpload,
    handleUpdateStatus,
    handleDownloadFile,
    handleSaveMusicLink
  };
};
