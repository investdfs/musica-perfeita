
import { useState } from "react";
import { MusicRequest } from "@/types/database.types";
import supabase from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

/**
 * Hook para gerenciar links de música e integração SoundCloud
 */
export const useMusicLinkHandling = (
  requests: MusicRequest[],
  setRequests: (requests: MusicRequest[]) => void,
  setShowDetails: (show: boolean) => void
) => {
  
  const handleSaveSoundCloudId = async (musicLink: string) => {
    if (!requests || !requests.length) return;
    
    const selectedRequest = requests.find(req => req.id === requests[0].id);
    if (!selectedRequest) return;
    
    try {
      // Define explicitamente o status com o tipo correto
      const updateData: Partial<MusicRequest> = { 
        status: 'completed' as const, 
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
          ? { ...req, ...updateData } as MusicRequest
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
    }
  };

  const handleSaveMusicLink = async (requestId: string, musicLink: string) => {
    if (!musicLink.trim()) {
      throw new Error("Link da música não pode estar vazio");
    }
    
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
          return;
        }
      }
      
      // Define explicitamente o status com o tipo correto
      const updateData: Partial<MusicRequest> = { 
        status: 'completed' as const, 
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
          ? { ...req, ...updateData } as MusicRequest
          : req
      );
      
      setRequests(updatedRequests);
      
      console.log(`[Admin] Pedido atualizado com sucesso. Novo status: completed, Link: ${musicLink}`);
      
      return Promise.resolve();
    } catch (error: any) {
      console.error('[Admin] Erro ao atualizar pedido com link de música:', error);
      throw error;
    }
  };

  return {
    handleSaveSoundCloudId,
    handleSaveMusicLink
  };
};
