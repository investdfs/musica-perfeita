
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const WelcomeSection = () => {
  return (
    <section className="py-16 px-6 bg-gradient-to-br from-yellow-50 via-pink-50 to-green-50">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-green-400 bg-clip-text text-transparent">
            Transforme seu Amor em Música Perfeita!
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            Crie uma música personalizada para a pessoa amada, com emoção e carinho, gastando pouco e recebendo rapidinho!
          </p>
          <Link to="/cadastro">
            <Button size="lg" className="text-md mt-4 bg-pink-500 hover:bg-pink-600">
              Comece Agora <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="relative h-64 md:h-80 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 via-pink-100 to-green-100 opacity-60"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src="https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/UniversalUpscaler_96cb2fe5-2944-44b2-b0ae-198f3f8f8237-1.jpg"
              alt="Casal romântico"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
