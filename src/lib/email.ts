
import { Resend } from 'resend';
import { isDevelopmentOrPreview } from './environment';

// Initialize the Resend client with the API key
// In production, use your real Resend API key
// In development, we use a dummy key for testing
const RESEND_API_KEY = isDevelopmentOrPreview() 
  ? 'test_api_key_for_development' 
  : 're_8oWdKWbb_FiCExjKmHJpJRUGGH1Y85Ten';

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
 * Function to send emails via Resend
 */
export async function sendEmail(options: EmailOptions) {
  const { to, subject, html, text, cc, bcc, replyTo } = options;
  
  // Default sender email
  const from = options.from || "Musicaperfeita <no-reply@musicaperfeita.com>";
  
  try {
    // In development mode, just simulate sending
    if (isDevelopmentOrPreview()) {
      console.log('EMAIL SIMULATION IN DEVELOPMENT ENVIRONMENT:');
      console.log({
        from,
        to,
        subject,
        html,
        text: text || 'Text version not provided',
        cc,
        bcc,
        replyTo
      });
      
      return {
        success: true,
        messageId: `dev-${Date.now()}`,
        message: 'Email simulated in development environment'
      };
    }
    
    // In production, send the real email
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
      cc,
      bcc,
      replyTo // Corrected from reply_to to replyTo
    });
    
    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }
    
    return {
      success: true,
      messageId: data?.id,
      message: 'Email sent successfully'
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error,
      message: 'Failed to send email'
    };
  }
}

/**
 * Pre-defined email templates
 */
export const emailTemplates = {
  // Template for new request notification
  newRequest: (userName: string, requestId: string) => ({
    subject: `New request received - #${requestId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d946ef;">New Request Received!</h2>
        <p>Hello ${userName},</p>
        <p>We have received your custom music request (#${requestId}) and we are already analyzing it.</p>
        <p>You will receive updates on the progress of your music soon.</p>
        <p>Thank you for choosing MusicaPerfeita!</p>
        <hr style="margin: 20px 0;" />
        <p style="font-size: 12px; color: #666;">This is an automated email, please do not reply.</p>
      </div>
    `
  }),
  
  // Template for music ready notification
  musicDelivery: (userName: string, honoree: string, musicLink: string) => ({
    subject: `Your custom music is ready!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d946ef;">Your Custom Music Is Ready!</h2>
        <p>Hello ${userName},</p>
        <p>We are very happy to inform you that your custom music for ${honoree} is ready!</p>
        <p>You can access and download your music through the link below:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${musicLink}" style="background-color: #d946ef; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Access My Music
          </a>
        </p>
        <p>We hope you like the final result! If you have any questions, please contact us.</p>
        <p>Thank you for choosing MusicaPerfeita!</p>
        <hr style="margin: 20px 0;" />
        <p style="font-size: 12px; color: #666;">This is an automated email, please do not reply.</p>
      </div>
    `
  }),
  
  // Template for status update notification
  statusUpdate: (userName: string, requestId: string, newStatus: string) => {
    // Translation of status to Portuguese
    const statusTranslation: Record<string, string> = {
      'pending': 'Pendente',
      'in_production': 'Em Produção',
      'completed': 'Concluído'
    };
    
    const statusText = statusTranslation[newStatus] || newStatus;
    
    return {
      subject: `Update on your request #${requestId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d946ef;">Update on Your Request</h2>
          <p>Hello ${userName},</p>
          <p>The status of your request #${requestId} has been updated to: <strong>${statusText}</strong></p>
          <p>We will continue to keep you informed about the progress of your custom music.</p>
          <p>Thank you for choosing MusicaPerfeita!</p>
          <hr style="margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">This is an automated email, please do not reply.</p>
        </div>
      `
    };
  }
};
