
import Header from "@/components/Header";
import LoginForm from "@/components/auth/LoginForm";
import Footer from "@/components/Footer";
import { UserProfile } from "@/types/database.types";

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-64px)]">
        {/* Lado esquerdo - Formulário de Login */}
        <div className="flex items-center justify-center p-8 md:p-12 bg-gradient-to-b from-gray-50 to-white">
          <LoginForm onLogin={onLogin} />
        </div>
        
        {/* Lado direito - Imagem */}
        <div className="hidden md:block relative bg-gray-900">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-yellow-500/20 mix-blend-overlay z-10"></div>
          <img 
            src="https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/a-vibrant-and-emotional-image-of-a-daugh_J7ITx4AISfmXcxt8o0phKg_K4Lq53NqRHqCT0q4LHF0qQ.jpeg" 
            alt="Pessoa emocionada ouvindo música" 
            className="object-cover h-full w-full opacity-70"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-20">
            <h2 className="text-3xl font-bold mb-2">A emoção da música perfeita</h2>
            <p className="text-white/80">
              Músicas exclusivas para momentos especiais e emocionantes
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
