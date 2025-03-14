
import { Music, Clock, Heart, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { MusicRequest } from "@/types/database.types";

interface MusicDetailsCardProps {
  requestData: MusicRequest | null;
}

const MusicDetailsCard = ({ requestData }: MusicDetailsCardProps) => {
  const isPaid = requestData?.payment_status === 'completed';
  
  return (
    <Card className="bg-gray-800/95 shadow-lg rounded-xl border border-gray-700 mb-8">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Music className="h-5 w-5 text-indigo-400 mr-2" />
          <CardTitle className="text-xl font-semibold text-gray-200">Detalhes da Música</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg border border-gray-700 bg-gray-900/90">
            <div className="flex items-center mb-2">
              <Clock className="h-4 w-4 text-indigo-400 mr-2" />
              <p className="text-sm text-gray-400">Duração</p>
            </div>
            <p className="text-gray-200 font-medium">
              {isPaid ? 'Música Completa' : 'Prévia de 40 segundos'}
            </p>
          </div>
          
          <div className="bg-gray-900/90 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center mb-2">
              <Heart className="h-4 w-4 text-indigo-400 mr-2" />
              <p className="text-sm text-gray-400">Criada para</p>
            </div>
            <p className="text-gray-200 font-medium">{requestData?.honoree_name || "Você"}</p>
          </div>
          
          <div className="bg-gray-900/90 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center mb-2">
              <Music className="h-4 w-4 text-indigo-400 mr-2" />
              <p className="text-sm text-gray-400">Formato</p>
            </div>
            <p className="text-gray-200 font-medium">
              {isPaid ? 'Versão Completa' : 'Prévia Limitada'}
            </p>
          </div>
        </div>
        
        <div className="bg-gray-900/90 p-4 rounded-lg border border-gray-700">
          <h3 className="text-lg font-medium text-gray-200 mb-3">
            {isPaid ? 'Informações' : 'Instruções'}
          </h3>
          
          {!isPaid && (
            <div className="mb-4 bg-amber-900/30 p-3 rounded-md border border-amber-700/50 flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-amber-300 text-sm">
                Esta é apenas uma prévia da sua música. Para acessar a versão completa, faça o pagamento.
              </p>
            </div>
          )}
          
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            {isPaid ? (
              <>
                <li>Sua música completa já está disponível para você!</li>
                <li>Você pode baixar a música em alta qualidade a qualquer momento.</li>
                <li>A música foi criada exclusivamente para você, com base nas informações que você forneceu.</li>
                <li>Se precisar de ajuda, entre em contato com nosso suporte.</li>
              </>
            ) : (
              <>
                <li>Esta é apenas uma prévia limitada a 40 segundos da sua música.</li>
                <li>Para acessar a versão completa, faça o pagamento.</li>
                <li>A música foi criada exclusivamente para você, com base nas informações que você forneceu.</li>
                <li>Após o pagamento, você poderá baixar a música em alta qualidade.</li>
              </>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicDetailsCard;
