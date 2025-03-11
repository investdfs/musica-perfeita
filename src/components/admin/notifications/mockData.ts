
import { Notification } from "./types";

// Mock notifications for development mode
export const mockNotifications = [
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

// Dados simulados de usuários para desenvolvimento
export const mockUserData = {
  "1": {
    email: "joao@teste.com",
    name: "João Silva"
  },
  "2": {
    email: "maria@teste.com",
    name: "Maria Oliveira"
  }
};
