
import Header from "@/components/Header";

const Sobre = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header />
      <main className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 bg-gradient-to-r from-yellow-400 via-pink-500 to-green-400 bg-clip-text text-transparent">
            Sobre o Projeto Musicaperfeita
          </h1>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-pink-600">Nossa História</h2>
            <p className="text-gray-700 mb-6">
              O Musicaperfeita nasceu da paixão por unir música e emoção. Percebemos como presentes personalizados 
              tocam profundamente as pessoas, e decidimos criar um serviço que transforma histórias de amor, 
              amizade e carinho em canções únicas que ficarão para sempre na memória.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-pink-600">Como Funciona</h2>
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-4">
                <div className="bg-yellow-100 rounded-full p-3 text-xl">1</div>
                <div>
                  <h3 className="text-lg font-medium">Cadastro Simples</h3>
                  <p className="text-gray-700">
                    Crie uma conta em menos de 1 minuto, sem necessidade de cartão de crédito.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-pink-100 rounded-full p-3 text-xl">2</div>
                <div>
                  <h3 className="text-lg font-medium">Conte sua História</h3>
                  <p className="text-gray-700">
                    Compartilhe os detalhes importantes, sentimentos e memórias para inspirar a composição.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-full p-3 text-xl">3</div>
                <div>
                  <h3 className="text-lg font-medium">Ouça e Aprove</h3>
                  <p className="text-gray-700">
                    Você receberá uma prévia para aprovar antes de qualquer pagamento.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 rounded-full p-3 text-xl">4</div>
                <div>
                  <h3 className="text-lg font-medium">Receba sua Música</h3>
                  <p className="text-gray-700">
                    Após o pagamento, você receberá a música completa para download e compartilhamento.
                  </p>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4 text-pink-600">Nossa Missão</h2>
            <p className="text-gray-700 mb-6">
              Acreditamos que cada relacionamento tem uma trilha sonora única. Nossa missão é capturar a essência 
              dos seus sentimentos e transformá-los em uma experiência musical que será lembrada e celebrada por anos.
            </p>
            
            <div className="bg-gradient-to-r from-yellow-100 via-pink-100 to-green-100 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-3 text-center">Versão Beta</h2>
              <p className="text-gray-700 text-center">
                O Musicaperfeita está em fase beta, o que significa que estamos constantemente melhorando 
                nossa plataforma. Agradecemos seu feedback para tornar nossa experiência ainda melhor!
              </p>
            </div>
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

export default Sobre;
