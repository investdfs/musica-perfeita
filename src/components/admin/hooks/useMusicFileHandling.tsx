
import { useState } from "react";
import { MusicRequest } from "@/types/database.types";
import { isDevelopmentOrPreview } from "@/lib/environment";
import supabase from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

/**
 * Hook para gerenciar upload e manipulação de arquivos de música
 */
export const useMusicFileHandling = (
  requests: MusicRequest[],
  setRequests: (requests: MusicRequest[]) => void,
  selectedRequest: MusicRequest | null,
  setSelectedRequest: (request: MusicRequest | null) => void
) => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
        
        // Define explicitamente o status com o tipo correto
        const updateData: Partial<MusicRequest> = { 
          status: 'completed' as const,
          full_song_url: `temp:${objectUrl}`,
          preview_url: `temp:${objectUrl}`
        };
        
        const updatedRequests = requests.map(req => 
          req.id === request.id 
            ? { ...req, ...updateData } as MusicRequest
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
      
      // Define explicitamente o status com o tipo correto
      const updateData: Partial<MusicRequest> = { 
        status: 'completed' as const, 
        full_song_url: urlData.publicUrl,
        preview_url: urlData.publicUrl 
      };
      
      if (isDevelopmentOrPreview()) {
        const updatedRequests = requests.map(req => 
          req.id === request.id 
            ? { ...req, ...updateData } as MusicRequest
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
            ? { ...req, ...updateData } as MusicRequest
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
    audioFile,
    setAudioFile,
    isUploading,
    handleFileUpload,
    handleDownloadFile
  };
};
