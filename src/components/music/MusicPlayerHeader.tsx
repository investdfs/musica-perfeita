
import { Music } from "lucide-react";

const MusicPlayerHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center mb-4">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg">
          <Music className="h-6 w-6 text-white" />
        </div>
      </div>
      
      <h1 className="text-4xl font-bold text-center text-gray-100 mb-4 tracking-tight">
        Prévia da Sua Música
      </h1>
      
      <p className="text-center text-gray-300 max-w-xl mx-auto mb-2">
        Ouça uma prévia de 40 segundos da sua música personalizada criada com base nas suas preferências.
      </p>
      
      <p className="text-center text-indigo-400 text-sm max-w-xl mx-auto">
        Para acessar a versão completa, faça o pagamento e desbloqueie todos os recursos.
      </p>
    </div>
  );
};

export default MusicPlayerHeader;
