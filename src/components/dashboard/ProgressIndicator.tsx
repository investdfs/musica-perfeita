
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Music, UserCheck, Factory } from "lucide-react";
import { useEffect, useState } from "react";

interface ProgressIndicatorProps {
  currentProgress: number;
  hasAnyRequest: boolean;
}

const ProgressIndicator = ({ currentProgress, hasAnyRequest }: ProgressIndicatorProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  // CORREÇÃO CRÍTICA: Log para acompanhar mudanças de progresso
  useEffect(() => {
    console.log('[ProgressIndicator] Progresso atualizado:', { currentProgress, hasAnyRequest });
  }, [currentProgress, hasAnyRequest]);
  
  // Animar a barra de progresso para uma transição mais suave
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedProgress(currentProgress);
    }, 300);
    
    return () => {
      clearTimeout(timeout);
    };
  }, [currentProgress]);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8 border border-blue-100 transition-all card-hover-effect">
      <h2 className="text-xl font-semibold mb-4 text-blue-600">Status do seu pedido</h2>
      
      <Progress 
        value={animatedProgress} 
        className="h-5 mb-6" 
      />
      
      <div className="grid grid-cols-4 gap-2">
        <div className={`flex flex-col items-center p-3 rounded-lg transition-all bg-green-50 text-green-600 transform hover:scale-105 duration-200`}>
          <div className={`rounded-full p-2 mb-2 bg-green-100`}>
            <UserCheck className={`h-5 w-5 text-green-500`} />
          </div>
          <span className="text-sm font-medium text-center">Cadastro Realizado</span>
        </div>

        <div className={`flex flex-col items-center p-3 rounded-lg transition-all ${hasAnyRequest ? 'bg-green-50 text-green-600' : 'text-gray-400'} transform hover:scale-105 duration-200`}>
          <div className={`rounded-full p-2 mb-2 ${hasAnyRequest ? 'bg-green-100' : 'bg-gray-100'}`}>
            <CheckCircle className={`h-5 w-5 ${hasAnyRequest ? 'text-green-500' : 'text-gray-400'}`} />
          </div>
          <span className="text-sm font-medium text-center">Pedido Enviado</span>
        </div>
        
        <div className={`flex flex-col items-center p-3 rounded-lg transition-all ${currentProgress >= 50 ? 'bg-green-50 text-green-600' : 'text-gray-400'} transform hover:scale-105 duration-200`}>
          <div className={`rounded-full p-2 mb-2 ${currentProgress >= 50 ? 'bg-green-100' : 'bg-gray-100'}`}>
            <Factory className={`h-5 w-5 ${currentProgress >= 50 ? 'text-green-500' : 'text-gray-400'}`} />
          </div>
          <span className="text-sm font-medium text-center">Em Produção</span>
        </div>
        
        <div className={`flex flex-col items-center p-3 rounded-lg transition-all ${currentProgress >= 100 ? 'bg-green-50 text-green-600' : 'text-gray-400'} transform hover:scale-105 duration-200`}>
          <div className={`rounded-full p-2 mb-2 ${currentProgress >= 100 ? 'bg-green-100' : 'bg-gray-100'}`}>
            <Music className={`h-5 w-5 ${currentProgress >= 100 ? 'text-green-500' : 'text-gray-400'}`} />
          </div>
          <span className="text-sm font-medium text-center">Música Pronta</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
