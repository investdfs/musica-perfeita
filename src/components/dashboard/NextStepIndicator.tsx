
import { MusicRequest } from "@/types/database.types";
import { Loader2, FileText, Music, CreditCard, CheckCircle } from "lucide-react";

interface NextStepIndicatorProps {
  currentRequest: MusicRequest | null;
  hasSubmittedForm: boolean;
}

const NextStepIndicator = ({ currentRequest, hasSubmittedForm }: NextStepIndicatorProps) => {
  if (!currentRequest && !hasSubmittedForm) {
    return (
      <div className="flex items-center p-4 bg-indigo-50 rounded-lg mb-4">
        <div className="mr-3 bg-indigo-100 rounded-full p-2">
          <FileText className="h-5 w-5 text-indigo-500 animate-pulse" />
        </div>
        <div>
          <h4 className="font-medium text-indigo-700">Próximo passo:</h4>
          <p className="text-indigo-600 text-sm">
            Aguardando envio do seu formulário para podermos começar a trabalhar na letra da sua música.
          </p>
        </div>
      </div>
    );
  }

  if (!currentRequest) {
    return null;
  }

  const getStepContent = () => {
    // Se tiver preview mas ainda não pagou
    if (currentRequest.preview_url && currentRequest.payment_status !== 'completed') {
      return {
        icon: <CreditCard className="h-5 w-5 text-amber-500 animate-pulse" />,
        title: "Próximo passo:",
        message: "Aguardando confirmação do pagamento.",
        bgColor: "bg-amber-50",
        iconBgColor: "bg-amber-100",
        textColor: "text-amber-700",
        textColorMessage: "text-amber-600"
      };
    }

    // Se já pagou e está tudo completo
    if (currentRequest.payment_status === 'completed') {
      return {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        title: "Concluído!",
        message: "Sua música foi finalizada e está pronta para você.",
        bgColor: "bg-green-50",
        iconBgColor: "bg-green-100",
        textColor: "text-green-700",
        textColorMessage: "text-green-600"
      };
    }

    // Por status de produção da música
    switch (currentRequest.status) {
      case 'pending':
        return {
          icon: <FileText className="h-5 w-5 text-indigo-500 animate-pulse" />,
          title: "Próximo passo:",
          message: "Vamos trabalhar na escrita da letra, incluindo versos, refrão e pontes.",
          bgColor: "bg-indigo-50",
          iconBgColor: "bg-indigo-100",
          textColor: "text-indigo-700",
          textColorMessage: "text-indigo-600"
        };
      case 'in_production':
        return {
          icon: <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />,
          title: "Próximo passo:",
          message: "Estamos criando a melodia base e trabalhando na progressão de acordes.",
          bgColor: "bg-blue-50",
          iconBgColor: "bg-blue-100",
          textColor: "text-blue-700",
          textColorMessage: "text-blue-600"
        };
      case 'completed':
        return {
          icon: <Music className="h-5 w-5 text-purple-500 animate-pulse" />,
          title: "Próximo passo:",
          message: "Sua música está quase pronta, e já temos uma prévia para te mostrar, clique no botão abaixo.",
          bgColor: "bg-purple-50",
          iconBgColor: "bg-purple-100",
          textColor: "text-purple-700",
          textColorMessage: "text-purple-600"
        };
      default:
        return {
          icon: <Loader2 className="h-5 w-5 text-gray-500 animate-spin" />,
          title: "Processando:",
          message: "Estamos verificando o status do seu pedido.",
          bgColor: "bg-gray-50",
          iconBgColor: "bg-gray-100",
          textColor: "text-gray-700",
          textColorMessage: "text-gray-600"
        };
    }
  };

  const content = getStepContent();

  return (
    <div className={`flex items-center p-4 ${content.bgColor} rounded-lg mb-4 transition-all duration-300`}>
      <div className={`mr-3 ${content.iconBgColor} rounded-full p-2`}>
        {content.icon}
      </div>
      <div>
        <h4 className={`font-medium ${content.textColor}`}>{content.title}</h4>
        <p className={`${content.textColorMessage} text-sm`}>
          {content.message}
        </p>
      </div>
    </div>
  );
};

export default NextStepIndicator;
