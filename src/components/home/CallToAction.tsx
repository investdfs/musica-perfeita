
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-16 px-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Sua história merece ser cantada!
        </h2>
        <p className="text-xl mb-8 text-white/90">
          É grátis para começar – crie sua conta e transforme sentimentos em música.
        </p>
        <Link to="/cadastro">
          <Button size="lg" variant="secondary" className="text-pink-600 font-semibold text-lg px-8">
            <UserPlus className="mr-2 h-5 w-5" /> Cadastre-se Agora e Comece!
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
