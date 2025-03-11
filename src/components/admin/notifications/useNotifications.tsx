
import { useState, useEffect } from "react";
import { Notification, MockUserData } from "./types";
import { mockNotifications, mockUserData } from "./mockData";
import { isDevelopmentOrPreview } from "@/lib/environment";
import { sendEmail, emailTemplates } from "@/lib/email";
import { toast } from "@/hooks/use-toast";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(
    isDevelopmentOrPreview() ? mockNotifications : []
  );
  const [open, setOpen] = useState(false);
  
  // Contador de notificações não lidas
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Efeito para verificar notificações não enviadas por email quando o componente é montado
  useEffect(() => {
    checkAndSendPendingEmails();
  }, []);
  
  // Verifica e envia emails para notificações pendentes
  const checkAndSendPendingEmails = async () => {
    if (!isDevelopmentOrPreview()) {
      // Em produção, precisaria buscar notificações não enviadas do banco de dados
      return;
    }
    
    // Filtra notificações que não foram enviadas por email
    const pendingNotifications = notifications.filter(
      n => n.emailSent === false && n.userId && n.requestId
    );
    
    // Se não houver notificações pendentes, não faz nada
    if (pendingNotifications.length === 0) return;
    
    // Atualiza notificações pendentes para enviadas
    const updatedNotifications = [...notifications];
    
    for (const notification of pendingNotifications) {
      try {
        if (!notification.userId || !notification.requestId) continue;
        
        const userEmail = getUserEmail(notification.userId);
        const userName = getUserName(notification.userId);
        let emailTemplate;
        
        // Seleciona o template apropriado com base no tipo de notificação
        switch (notification.type) {
          case 'new_request':
            emailTemplate = emailTemplates.newRequest(userName, notification.requestId);
            break;
          case 'payment':
            emailTemplate = emailTemplates.statusUpdate(
              userName, 
              notification.requestId,
              'Pagamento Confirmado'
            );
            break;
          case 'production':
            emailTemplate = emailTemplates.statusUpdate(
              userName, 
              notification.requestId,
              'Em Produção'
            );
            break;
          default:
            continue;
        }
        
        // Envia o email
        const result = await sendEmail({
          to: userEmail,
          subject: emailTemplate.subject,
          html: emailTemplate.html
        });
        
        if (result.success) {
          // Atualiza a notificação como enviada
          const index = updatedNotifications.findIndex(n => n.id === notification.id);
          if (index !== -1) {
            updatedNotifications[index] = {
              ...updatedNotifications[index],
              emailSent: true
            };
          }
          
          console.log(`Email enviado com sucesso para ${userEmail}`);
        }
      } catch (error) {
        console.error(`Erro ao enviar email para notificação ${notification.id}:`, error);
      }
    }
    
    // Atualiza o estado das notificações
    setNotifications(updatedNotifications);
  };
  
  // Formatação da data/hora da notificação
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `${diffMins} min atrás`;
    } else if (diffHours < 24) {
      return `${diffHours} h atrás`;
    } else {
      return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;
    }
  };
  
  // Marcar uma notificação como lida
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  // Marcar todas as notificações como lidas
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  // Função para obter o email do usuário (simulada em desenvolvimento)
  const getUserEmail = (userId: string): string => {
    const userData = mockUserData as MockUserData;
    return userData[userId]?.email || "cliente@exemplo.com";
  };
  
  // Função para obter o nome do usuário (simulada em desenvolvimento)
  const getUserName = (userId: string): string => {
    const userData = mockUserData as MockUserData;
    return userData[userId]?.name || "Cliente";
  };
  
  // Função para enviar email manualmente para uma notificação específica
  const sendEmailForNotification = async (notification: Notification) => {
    try {
      if (!notification.userId || !notification.requestId) {
        throw new Error("Dados insuficientes para enviar email");
      }
      
      const userEmail = getUserEmail(notification.userId);
      const userName = getUserName(notification.userId);
      let emailTemplate;
      
      // Seleciona o template apropriado com base no tipo de notificação
      switch (notification.type) {
        case 'new_request':
          emailTemplate = emailTemplates.newRequest(userName, notification.requestId);
          break;
        case 'payment':
          emailTemplate = emailTemplates.statusUpdate(
            userName, 
            notification.requestId,
            'Pagamento Confirmado'
          );
          break;
        case 'production':
          emailTemplate = emailTemplates.statusUpdate(
            userName, 
            notification.requestId,
            'Em Produção'
          );
          break;
        default:
          throw new Error("Tipo de notificação não suportado");
      }
      
      // Envia o email
      const result = await sendEmail({
        to: userEmail,
        subject: emailTemplate.subject,
        html: emailTemplate.html
      });
      
      if (result.success) {
        // Atualiza a notificação como enviada
        setNotifications(notifications.map(n => 
          n.id === notification.id ? { ...n, emailSent: true } : n
        ));
        
        toast({
          title: "Email enviado com sucesso",
          description: `Notificação enviada para ${userName} (${userEmail})`
        });
      } else {
        throw new Error(result.message || "Erro ao enviar email");
      }
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      toast({
        title: "Erro ao enviar email",
        description: "Não foi possível enviar o email. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return {
    notifications,
    open,
    setOpen,
    unreadCount,
    formatTimestamp,
    markAsRead,
    markAllAsRead,
    sendEmailForNotification
  };
};
