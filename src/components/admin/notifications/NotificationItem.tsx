
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Notification } from "./types";

interface NotificationItemProps {
  notification: Notification;
  formatTimestamp: (timestamp: string) => string;
  markAsRead: (id: number) => void;
  sendEmailForNotification: (notification: Notification) => Promise<void>;
}

const NotificationItem = ({ 
  notification, 
  formatTimestamp, 
  markAsRead, 
  sendEmailForNotification 
}: NotificationItemProps) => {
  return (
    <div 
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
  );
};

export default NotificationItem;
