
import { ChevronUp } from "lucide-react";

interface FormIntroductionProps {
  isExpanded: boolean;
  toggleForm?: () => void;
  canToggle: boolean;
}

const FormIntroduction = ({ isExpanded, toggleForm, canToggle }: FormIntroductionProps) => {
  return (
    <div className="flex-1">
      <h2 className="text-2xl font-semibold mb-2 text-pink-600">Crie Sua Música Especial</h2>
      
      {isExpanded && (
        <div className="bg-pink-50 p-5 rounded-md border border-pink-100">
          <p className="text-sm text-gray-700 leading-relaxed">
            Transforme sua história em uma música única! Quanto mais detalhes emocionantes e fatos relevantes você compartilhar, 
            melhor será o resultado. A qualidade da música depende da sua narrativa!
          </p>
        </div>
      )}
      
      {canToggle && toggleForm && (
        <div className="absolute top-6 right-6">
          <button 
            onClick={toggleForm}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronUp className={`h-5 w-5 transition-transform ${isExpanded ? '' : 'rotate-180'}`} />
          </button>
        </div>
      )}
    </div>
  );
};

export default FormIntroduction;
