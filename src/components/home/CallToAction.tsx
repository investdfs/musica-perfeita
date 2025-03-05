
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
          Sua história merece ser cantada!
        </h2>
        <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-white/90 px-4">
          É grátis para começar – crie sua conta e transforme sentimentos em música.
        </p>
        <Link to="/cadastro">
          <Button size="lg" variant="secondary" className="text-pink-600 font-semibold text-base sm:text-lg px-6 sm:px-8 py-3 w-full sm:w-auto max-w-xs mx-auto">
            <UserPlus className="mr-2 h-5 w-5" /> Cadastre-se Agora e Comece!
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
