
import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  currentProgress: number;
}

const ProgressIndicator = ({ currentProgress }: ProgressIndicatorProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Status do seu pedido</h2>
      <Progress value={currentProgress} className="h-3 mb-4" />
      <div className="flex justify-between text-sm">
        <span className={currentProgress >= 33 ? "text-pink-500 font-medium" : ""}>Pedido Enviado</span>
        <span className={currentProgress >= 66 ? "text-pink-500 font-medium" : ""}>Em Produção</span>
        <span className={currentProgress >= 100 ? "text-pink-500 font-medium" : ""}>Música Pronta</span>
      </div>
    </div>
  );
};

export default ProgressIndicator;
