
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Music, UserCheck } from "lucide-react";

interface ProgressIndicatorProps {
  currentProgress: number;
}

const ProgressIndicator = ({ currentProgress }: ProgressIndicatorProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-purple-700">Status do seu pedido</h2>
      
      <Progress value={currentProgress} className="h-3 mb-6 bg-gray-100" 
        style={{
          backgroundImage: 'linear-gradient(to right, #ec4899, #8b5cf6)',
          backgroundSize: `${currentProgress}% 100%`,
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <div className="grid grid-cols-4 gap-2">
        <div className={`flex flex-col items-center p-3 rounded-lg transition-all bg-green-50 text-green-600`}>
          <div className={`rounded-full p-2 mb-2 bg-green-100`}>
            <UserCheck className={`h-5 w-5 text-green-500`} />
          </div>
          <span className="text-sm font-medium text-center">Cadastro Realizado</span>
        </div>

        <div className={`flex flex-col items-center p-3 rounded-lg transition-all ${currentProgress >= 25 ? 'bg-pink-50 text-pink-600' : 'text-gray-400'}`}>
          <div className={`rounded-full p-2 mb-2 ${currentProgress >= 25 ? 'bg-pink-100' : 'bg-gray-100'}`}>
            <CheckCircle className={`h-5 w-5 ${currentProgress >= 25 ? 'text-pink-500' : 'text-gray-400'}`} />
          </div>
          <span className="text-sm font-medium text-center">Pedido Enviado</span>
        </div>
        
        <div className={`flex flex-col items-center p-3 rounded-lg transition-all ${currentProgress >= 50 ? 'bg-purple-50 text-purple-600' : 'text-gray-400'}`}>
          <div className={`rounded-full p-2 mb-2 ${currentProgress >= 50 ? 'bg-purple-100' : 'bg-gray-100'}`}>
            <Clock className={`h-5 w-5 ${currentProgress >= 50 ? 'text-purple-500' : 'text-gray-400'}`} />
          </div>
          <span className="text-sm font-medium text-center">Em Produção</span>
        </div>
        
        <div className={`flex flex-col items-center p-3 rounded-lg transition-all ${currentProgress >= 100 ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400'}`}>
          <div className={`rounded-full p-2 mb-2 ${currentProgress >= 100 ? 'bg-indigo-100' : 'bg-gray-100'}`}>
            <Music className={`h-5 w-5 ${currentProgress >= 100 ? 'text-indigo-500' : 'text-gray-400'}`} />
          </div>
          <span className="text-sm font-medium text-center">Música Pronta</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
