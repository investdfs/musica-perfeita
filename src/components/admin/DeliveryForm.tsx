
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

interface DeliveryFormProps {
  showDeliveryForm: boolean;
  setShowDeliveryForm: (show: boolean) => void;
  selectedRequest: MusicRequest | null;
  handleSendEmail: () => void;
  getUserName: (userId: string) => string;
}

const DeliveryForm = ({ 
  showDeliveryForm, 
  setShowDeliveryForm, 
  selectedRequest, 
  handleSendEmail,
  getUserName
}: DeliveryFormProps) => {
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
                defaultValue="Olá! Sua música personalizada está pronta. Esperamos que goste do resultado final. Clique no link abaixo para acessar a música completa."
              />
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDeliveryForm(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSendEmail}
            disabled={selectedRequest?.payment_status !== 'completed'}
          >
            Enviar por E-mail
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryForm;
