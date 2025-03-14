
import { Loader2 } from "lucide-react";

const Loading = () => (
  <div className="flex items-center justify-center h-screen w-full">
    <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
    <span className="ml-2 text-lg text-gray-700">Carregando...</span>
  </div>
);

export default Loading;
