
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { MusicRequest, UserProfile } from "@/types/database.types";
import { sendEmail, emailTemplates } from "@/lib/email";
import { toast } from "@/hooks/use-toast";

interface DeliveryFormProps {
  showDeliveryForm: boolean;
  setShowDeliveryForm: (show: boolean) => void;
  selectedRequest: MusicRequest | null;
  handleSendEmail: () => void;
  getUserName: (userId: string) => string;
  getUserEmail: (userId: string) => string | undefined;
}

const DeliveryForm = ({ 
  showDeliveryForm, 
  setShowDeliveryForm, 
  selectedRequest, 
  handleSendEmail,
  getUserName,
  getUserEmail
}: DeliveryFormProps) => {
  const [customMessage, setCustomMessage] = useState(
    "Olá! Sua música personalizada está pronta. Esperamos que goste do resultado final. Clique no link abaixo para acessar a música completa."
  );
  const [isSending, setIsSending] = useState(false);

  const handleSendEmailClick = async () => {
    if (!selectedRequest) return;

    setIsSending(true);
    try {
      const userName = getUserName(selectedRequest.user_id);
      const userEmail = getUserEmail(selectedRequest.user_id);
      
      if (!userEmail) {
        throw new Error("Email do usuário não encontrado");
      }

      // Cria uma URL fictícia para o link da música em ambiente de desenvolvimento
      // Em produção, use a URL real da música
      const musicLink = selectedRequest.full_song_url || 
        `https://musicaperfeita.com/musica/${selectedRequest.id}`;

      // Cria um template personalizado com a mensagem customizada
      const emailTemplate = emailTemplates.musicDelivery(
        userName, 
        selectedRequest.honoree_name, 
        musicLink
      );

      // Adiciona a mensagem customizada ao template
      const customizedHtml = emailTemplate.html.replace(
        '<p>Estamos muito felizes em informar', 
        `<p>${customMessage}</p><p>Estamos muito felizes em informar`
      );

      // Envia o email
      const result = await sendEmail({
        to: userEmail,
        subject: emailTemplate.subject,
        html: customizedHtml
      });

      if (result.success) {
        toast({
          title: "Email enviado com sucesso!",
          description: "O cliente foi notificado sobre a entrega da música."
        });
        handleSendEmail(); // Função original para atualizar o estado no componente pai
        setShowDeliveryForm(false);
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
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={showDeliveryForm} onOpenChange={setShowDeliveryForm}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Entregar Música ao Cliente</DialogTitle>
          <DialogDescription>
            Envie a música finalizada para o cliente por e-mail.
          </DialogDescription>
        </DialogHeader>
        
        {selectedRequest && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Cliente</h3>
              <p className="p-2 bg-gray-50 rounded">{getUserName(selectedRequest.user_id)}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Música para</h3>
              <p className="p-2 bg-gray-50 rounded">{selectedRequest.honoree_name}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Status do Pagamento</h3>
              <p className={`p-2 rounded ${
                selectedRequest.payment_status === 'completed' 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                {selectedRequest.payment_status === 'completed' ? 'Pago' : 'Não Pago'}
              </p>
              {selectedRequest.payment_status !== 'completed' && (
                <p className="text-sm text-red-500">
                  Atenção: Este pedido ainda não foi pago. Recomendamos verificar o pagamento antes de entregar a música.
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Mensagem para o Cliente</h3>
              <textarea 
                className="w-full p-2 border rounded"
                rows={4}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
              />
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDeliveryForm(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSendEmailClick}
            disabled={selectedRequest?.payment_status !== 'completed' || isSending}
          >
            {isSending ? "Enviando..." : "Enviar por E-mail"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryForm;
