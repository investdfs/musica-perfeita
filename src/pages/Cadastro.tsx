
import Header from "@/components/Header";
import RegistrationForm from "@/components/cadastro/RegistrationForm";

const Cadastro = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Header />
      <main className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 bg-gradient-to-r from-yellow-400 via-pink-500 to-green-400 bg-clip-text text-transparent">
            Cadastre-se para Começar
          </h1>
          
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-lg text-gray-700">
                Transforme seus sentimentos em melodia com apenas alguns passos.
                Crie sua conta gratuitamente e comece a jornada musical!
              </p>
            </div>
            
            <RegistrationForm />
          </div>
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

export default Cadastro;
