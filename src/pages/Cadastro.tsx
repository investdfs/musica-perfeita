
import Header from "@/components/Header";
import RegistrationForm from "@/components/cadastro/RegistrationForm";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { UserProfile } from "@/types/database.types";

interface CadastroProps {
  onRegister: (user: UserProfile) => void;
}

const Cadastro = ({ onRegister }: CadastroProps) => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-64px)]">
        {/* Lado esquerdo - Formulário de Cadastro */}
        <div className="flex items-center justify-center p-6 md:p-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-md w-full">
            <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-green-400 bg-clip-text text-transparent">
              Cadastre-se para Criar Sua Música Personalizada
            </h1>
            <p className="text-gray-600 mb-6">
              Transforme seus sentimentos em uma melodia única. 
              Crie sua conta para começar a jornada de compor a <strong>música personalizada</strong> perfeita 
              para aniversários, casamentos e momentos especiais.
            </p>
            
            <RegistrationForm onRegister={onRegister} />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 mb-2">Já possui uma conta?</p>
              <Link to="/login" className="text-pink-600 hover:text-pink-700 font-medium">
                Fazer login
              </Link>
            </div>
            
            <div className="mt-6 bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-800 mb-2">Vantagens do Cadastro:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Acesso à criação de músicas personalizadas exclusivas
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Prévia gratuita da sua música antes do pagamento
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Acompanhamento em tempo real do processo de criação
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Biblioteca pessoal de músicas personalizadas
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Lado direito - Imagem */}
        <div className="hidden md:block relative bg-gray-900">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-yellow-500/20 mix-blend-overlay z-10"></div>
          <img 
            src="https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/a-photo-of-a-couple-in-their-40s-enjoyin_t2ttoIKDQyunxoGpJnBZ6w__hxiyb1_S_2T_POWqpwATg.jpeg" 
            alt="Casal desfrutando de música personalizada" 
            className="object-cover h-[85%] w-full opacity-70"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-20">
            <h2 className="text-2xl font-bold mb-2">A emoção da música perfeita</h2>
            <p className="text-white/80">
              Músicas exclusivas personalizadas para momentos especiais e emocionantes, 
              criadas para aniversários, casamentos e declarações de amor.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="bg-white/20 text-white text-sm py-1 px-3 rounded-full">Presente Musical</span>
              <span className="bg-white/20 text-white text-sm py-1 px-3 rounded-full">Composição Personalizada</span>
              <span className="bg-white/20 text-white text-sm py-1 px-3 rounded-full">Momentos Especiais</span>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cadastro;
