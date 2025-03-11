
// Interface para tipagem das notificações
export interface Notification {
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

// Mapeamento de tipos para pessoas simuladas
export interface MockUserData {
  [userId: string]: {
    email: string;
    name: string;
  };
}
