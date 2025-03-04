
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface FormInfoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const FormInfoDialog = ({ isOpen, onOpenChange }: FormInfoDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-pink-600">A Importância da Sua História</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-gray-700 leading-relaxed">
          Este campo da história é o coração pulsante da sua música – o lugar mais importante onde você vai ajudar nosso compositor a dar vida à alma perfeita para essa canção. Dedique alguns minutos especiais, desligue-se do mundo e mergulhe nos momentos mais emocionantes da vida da pessoa homenageada. Foque nos instantes que fizeram o coração dela vibrar – risadas inesquecíveis, lágrimas que ensinaram, ou gestos de amor que marcaram para sempre, mas lembre-se também dos momentos tristes, eles fazem parte da vida. Quanto mais detalhes e emoção você compartilhar aqui, mais única e tocante será a melodia que criaremos. Está pronto para transformar esses sentimentos em música? Escreva agora e deixe a magia acontecer!
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default FormInfoDialog;
