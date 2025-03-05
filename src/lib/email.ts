
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
      replyTo
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
 * Test function to check if Resend integration is working
 */
export async function testEmailIntegration(testEmail: string) {
  try {
    const template = emailTemplates.welcome("Usuário Teste");
    
    const result = await sendEmail({
      to: testEmail,
      subject: template.subject,
      html: template.html
    });
    
    return {
      ...result,
      resendApiKey: RESEND_API_KEY.substring(0, 8) + '...',
      isDevelopment: isDevelopmentOrPreview()
    };
  } catch (error) {
    console.error('Error testing email integration:', error);
    return {
      success: false,
      error,
      message: 'Failed to test email integration',
      resendApiKey: RESEND_API_KEY.substring(0, 8) + '...',
      isDevelopment: isDevelopmentOrPreview()
    };
  }
}

/**
 * Common email layout wrapper
 */
const emailLayout = (content: string) => `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body, html {
        margin: 0;
        padding: 0;
        font-family: 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
      }
      .header {
        text-align: center;
        padding: 20px 0;
        background: linear-gradient(135deg, #9b87f5 0%, #D946EF 100%);
        border-radius: 8px 8px 0 0;
      }
      .header h1 {
        color: white;
        margin: 0;
        font-size: 24px;
        letter-spacing: 1px;
      }
      .content {
        padding: 30px;
        background-color: #ffffff;
        border-left: 1px solid #e5deff;
        border-right: 1px solid #e5deff;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 12px;
        color: #666;
        background-color: #f9f7ff;
        border-radius: 0 0 8px 8px;
        border: 1px solid #e5deff;
        border-top: none;
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        background: linear-gradient(135deg, #9b87f5 0%, #D946EF 100%);
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
        margin: 20px 0;
        text-align: center;
      }
      .highlight {
        color: #D946EF;
        font-weight: bold;
      }
      .divider {
        height: 1px;
        background-color: #e5deff;
        margin: 20px 0;
      }
      .note {
        background-color: #f9f7ff;
        padding: 15px;
        border-radius: 4px;
        font-size: 14px;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Música Perfeita</h1>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Música Perfeita. Todos os direitos reservados.</p>
        <p>Esta é uma mensagem automática, por favor não responda.</p>
        <p>Email para contato: <a href="mailto:contato.musicaperfeita@gmail.com">contato.musicaperfeita@gmail.com</a></p>
        <p>WhatsApp: (32) 998847713 (somente WhatsApp)</p>
      </div>
    </div>
  </body>
  </html>
`;

/**
 * Pre-defined email templates
 */
export const emailTemplates = {
  // Welcome email template
  welcome: (userName: string) => {
    const content = `
      <h2>Bem-vindo à Música Perfeita!</h2>
      <p>Olá <span class="highlight">${userName}</span>,</p>
      <p>Estamos muito felizes em ter você conosco na Música Perfeita!</p>
      
      <p>Aqui você poderá transformar seus sentimentos em melodias personalizadas e criar presentes inesquecíveis para pessoas especiais.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://musicaperfeita.com/dashboard" class="button">
          Criar Minha Primeira Música
        </a>
      </div>
      
      <div class="note">
        <p><strong>Dica:</strong> Pense em detalhes, memórias e sentimentos significativos para incluir no seu pedido. Quanto mais informações você nos fornecer, mais especial será a música!</p>
      </div>
      
      <div class="divider"></div>
      
      <p>Se tiver alguma dúvida, estamos sempre à disposição para ajudar.</p>
      <p>Obrigado por escolher a <span class="highlight">Música Perfeita</span> para transformar seus sentimentos em música!</p>
    `;
    
    return {
      subject: `Bem-vindo à Música Perfeita!`,
      html: emailLayout(content)
    };
  },
  
  // Template for new request notification
  newRequest: (userName: string, requestId: string) => {
    const content = `
      <h2>Pedido Recebido com Sucesso!</h2>
      <p>Olá <span class="highlight">${userName}</span>,</p>
      <p>Estamos felizes em informar que recebemos seu pedido de música personalizada.</p>
      
      <div class="note">
        <p><strong>Número do pedido:</strong> #${requestId}</p>
        <p>Já começamos a analisar seu pedido e em breve iniciaremos o processo de criação.</p>
      </div>
      
      <p>Você receberá atualizações sobre o progresso da sua música nos próximos dias.</p>
      
      <div class="divider"></div>
      
      <p>Agradecemos por escolher a <span class="highlight">Música Perfeita</span> para criar algo único e especial!</p>
      <p>Se tiver alguma dúvida, estamos à disposição para ajudar.</p>
    `;
    
    return {
      subject: `Seu pedido #${requestId} foi recebido - Música Perfeita`,
      html: emailLayout(content)
    };
  },
  
  // Template for music ready notification
  musicDelivery: (userName: string, honoree: string, musicLink: string) => {
    const content = `
      <h2>Sua Música Personalizada está Pronta!</h2>
      <p>Olá <span class="highlight">${userName}</span>,</p>
      <p>Temos uma ótima notícia! Sua música personalizada para <span class="highlight">${honoree}</span> está pronta!</p>
      
      <p>Criamos esta música com muito carinho e atenção aos detalhes que você nos forneceu, esperamos que ela transmita exatamente os sentimentos que você queria expressar.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${musicLink}" class="button">
          Acessar Minha Música
        </a>
      </div>
      
      <div class="note">
        <p><strong>Dica:</strong> Você pode baixar a música para reproduzi-la offline ou compartilhá-la diretamente nas redes sociais.</p>
      </div>
      
      <div class="divider"></div>
      
      <p>Agradecemos por confiar na <span class="highlight">Música Perfeita</span> para criar algo único e especial!</p>
      <p>Esperamos que você e ${honoree} apreciem esta composição exclusiva.</p>
    `;
    
    return {
      subject: `Sua música personalizada para ${honoree} está pronta!`,
      html: emailLayout(content)
    };
  },
  
  // Template for status update notification
  statusUpdate: (userName: string, requestId: string, newStatus: string) => {
    // Translation of status to Portuguese
    const statusTranslation: Record<string, string> = {
      'pending': 'Pendente',
      'in_production': 'Em Produção',
      'completed': 'Concluído',
      'Pagamento Confirmado': 'Pagamento Confirmado'
    };
    
    const statusText = statusTranslation[newStatus] || newStatus;
    
    // Different content depending on status
    let statusSpecificContent = '';
    
    switch(newStatus) {
      case 'in_production':
      case 'Em Produção':
        statusSpecificContent = `
          <p>Nossos compositores já começaram a trabalhar na sua música personalizada.</p>
          <p>Este é um processo criativo que pode levar alguns dias, mas estamos empenhados em entregar uma música única e especial.</p>
        `;
        break;
      case 'Pagamento Confirmado':
        statusSpecificContent = `
          <p>Seu pagamento foi processado com sucesso e confirmado em nosso sistema.</p>
          <p>Agora podemos dar continuidade ao processo de criação da sua música personalizada!</p>
        `;
        break;
      default:
        statusSpecificContent = `
          <p>Continuaremos trabalhando no seu pedido e enviaremos atualizações sobre o progresso.</p>
        `;
    }
    
    const content = `
      <h2>Atualização do Seu Pedido</h2>
      <p>Olá <span class="highlight">${userName}</span>,</p>
      <p>Temos novidades sobre o seu pedido <strong>#${requestId}</strong>!</p>
      
      <div class="note">
        <p>O status do seu pedido foi atualizado para: <span class="highlight">${statusText}</span></p>
        ${statusSpecificContent}
      </div>
      
      <div class="divider"></div>
      
      <p>Continuaremos a mantê-lo informado sobre o progresso da sua música personalizada.</p>
      <p>Agradecemos por escolher a <span class="highlight">Música Perfeita</span>!</p>
    `;
    
    return {
      subject: `Atualização do seu pedido #${requestId} - ${statusText}`,
      html: emailLayout(content)
    };
  }
};
