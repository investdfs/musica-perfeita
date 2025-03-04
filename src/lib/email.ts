
import { Resend } from 'resend';
import { isDevelopmentOrPreview } from './environment';

// Inicializa o cliente Resend com a chave de API
// Em produção, use sua chave real da Resend
// Em desenvolvimento, usamos uma chave fictícia para testes
const RESEND_API_KEY = isDevelopmentOrPreview() 
  ? 'test_api_key_for_development' 
  : 'seu_api_key_real_da_resend_aqui';

const resend = new Resend(RESEND_API_KEY);

type EmailOptions = {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
};

/**
 * Função para enviar emails através do Resend
 */
export async function sendEmail(options: EmailOptions) {
  const { to, subject, html, text, cc, bcc, replyTo } = options;
  
  // Email padrão do remetente
  const from = options.from || "Musicaperfeita <no-reply@musicaperfeita.com>";
  
  try {
    // Em modo de desenvolvimento, apenas simula o envio
    if (isDevelopmentOrPreview()) {
      console.log('SIMULAÇÃO DE EMAIL EM AMBIENTE DE DESENVOLVIMENTO:');
      console.log({
        from,
        to,
        subject,
        html,
        text: text || 'Versão em texto não fornecida',
        cc,
        bcc,
        reply_to: replyTo
      });
      
      return {
        success: true,
        messageId: `dev-${Date.now()}`,
        message: 'Email simulado em ambiente de desenvolvimento'
      };
    }
    
    // Em produção, envia o email real
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
      cc,
      bcc,
      reply_to: replyTo
    });
    
    if (error) {
      console.error('Erro ao enviar email:', error);
      throw error;
    }
    
    return {
      success: true,
      messageId: data?.id,
      message: 'Email enviado com sucesso'
    };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return {
      success: false,
      error,
      message: 'Falha ao enviar email'
    };
  }
}

/**
 * Templates de email pré-definidos
 */
export const emailTemplates = {
  // Template para notificação de novo pedido
  newRequest: (userName: string, requestId: string) => ({
    subject: `Novo pedido recebido - #${requestId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d946ef;">Novo Pedido Recebido!</h2>
        <p>Olá ${userName},</p>
        <p>Recebemos seu pedido de música personalizada (#${requestId}) e já estamos analisando.</p>
        <p>Você receberá atualizações sobre o progresso da sua música em breve.</p>
        <p>Obrigado por escolher a MusicaPerfeita!</p>
        <hr style="margin: 20px 0;" />
        <p style="font-size: 12px; color: #666;">Este é um email automático, por favor não responda.</p>
      </div>
    `
  }),
  
  // Template para notificação de música pronta
  musicDelivery: (userName: string, honoree: string, musicLink: string) => ({
    subject: `Sua música personalizada está pronta!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d946ef;">Sua Música Personalizada Está Pronta!</h2>
        <p>Olá ${userName},</p>
        <p>Estamos muito felizes em informar que sua música personalizada para ${honoree} está pronta!</p>
        <p>Você pode acessar e baixar sua música através do link abaixo:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${musicLink}" style="background-color: #d946ef; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Acessar Minha Música
          </a>
        </p>
        <p>Esperamos que você goste do resultado final! Se tiver qualquer dúvida, entre em contato conosco.</p>
        <p>Obrigado por escolher a MusicaPerfeita!</p>
        <hr style="margin: 20px 0;" />
        <p style="font-size: 12px; color: #666;">Este é um email automático, por favor não responda.</p>
      </div>
    `
  }),
  
  // Template para notificação de status atualizado
  statusUpdate: (userName: string, requestId: string, newStatus: string) => {
    // Tradução do status para português
    const statusTranslation: Record<string, string> = {
      'pending': 'Pendente',
      'in_production': 'Em Produção',
      'completed': 'Concluído'
    };
    
    const statusText = statusTranslation[newStatus] || newStatus;
    
    return {
      subject: `Atualização do seu pedido #${requestId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d946ef;">Atualização do Seu Pedido</h2>
          <p>Olá ${userName},</p>
          <p>O status do seu pedido #${requestId} foi atualizado para: <strong>${statusText}</strong></p>
          <p>Continuaremos te mantendo informado sobre o progresso da sua música personalizada.</p>
          <p>Obrigado por escolher a MusicaPerfeita!</p>
          <hr style="margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">Este é um email automático, por favor não responda.</p>
        </div>
      `
    };
  }
};
