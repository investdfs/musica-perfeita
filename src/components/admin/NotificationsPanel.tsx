
import { useState, useEffect } from "react";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { isDevelopmentOrPreview } from "@/lib/environment";
import { sendEmail, emailTemplates } from "@/lib/email";
import { toast } from "@/hooks/use-toast";

// Interface para tipagem das notificações
interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  type?: 'new_request' | 'payment' | 'production' | 'delivery';
  emailSent?: boolean;
  requestId?: string;
  userId?: string;
}

// Mock notifications for development mode
const mockNotifications = [
  {
    id: 1,
    title: "Novo pedido recebido",
    message: "João Silva fez um novo pedido para Ana Pereira",
    read: false,
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    type: 'new_request',
    emailSent: false,
    requestId: "1234",
    userId: "1"
  },
  {
    id: 2,
    title: "Pagamento confirmado",
    message: "Pagamento do pedido #1234 foi confirmado",
    read: true,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    type: 'payment',
    emailSent: true,
    requestId: "1234",
    userId: "1"
  },
  {
    id: 3,
    title: "Lembrete de produção",
    message: "O pedido #5678 está aguardando produção há 2 dias",
    read: false,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'production',
    emailSent: false,
    requestId: "5678",
    userId: "2"
  },
] as Notification[];

// Função para buscar o email do usuário (simulada em desenvolvimento)
const getUserEmail = (userId: string): string => {
  // Em produção, buscaria o email do usuário no banco de dados
  const mockEmails: Record<string, string> = {
    "1": "joao@teste.com",
    "2": "maria@teste.com"
  };
  
  return mockEmails[userId] || "cliente@exemplo.com";
};

// Função para obter o nome do usuário (simulada em desenvolvimento)
const getUserName = (userId: string): string => {
  // Em produção, buscaria o nome do usuário no banco de dados
  const mockNames: Record<string, string> = {
    "1": "João Silva",
    "2": "Maria Oliveira"
  };
  
  return mockNames[userId] || "Cliente";
};

const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState<Notification[]>(isDevelopmentOrPreview() ? mockNotifications : []);
  const [open, setOpen] = useState(false);
  
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
  
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
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
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notificações</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Marcar todas como lidas
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Nenhuma notificação
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium">{notification.title}</h4>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(notification.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                  <div className="flex justify-between items-center">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Marcar como lida
                    </Button>
                    
                    {!notification.emailSent && notification.type && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => sendEmailForNotification(notification)}
                        className="text-xs"
                      >
                        Enviar Email
                      </Button>
                    )}
                    
                    {notification.emailSent && (
                      <span className="text-xs text-green-600">✓ Email enviado</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPanel;
