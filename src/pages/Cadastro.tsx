
import Header from "@/components/Header";
import RegistrationForm from "@/components/cadastro/RegistrationForm";
import Footer from "@/components/Footer";

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
              <p className="mt-4 text-sm text-gray-600">
                Ao criar uma conta, você receberá um email de boas-vindas e terá acesso 
                ao nosso painel para solicitar músicas personalizadas.
              </p>
            </div>
            
            <RegistrationForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cadastro;
