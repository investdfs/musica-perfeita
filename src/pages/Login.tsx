
import Header from "@/components/Header";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-64px)]">
        {/* Lado esquerdo - Imagem */}
        <div className="hidden md:block relative bg-gray-900">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-yellow-500/20 mix-blend-overlay z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1531685250784-7569952593d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80" 
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
        
        {/* Lado direito - Formulário de Login */}
        <div className="flex items-center justify-center p-8 md:p-12 bg-gradient-to-b from-gray-50 to-white">
          <LoginForm />
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-8 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <p>&copy; {new Date().getFullYear()} Musicaperfeita. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
