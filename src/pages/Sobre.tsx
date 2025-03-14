
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Sobre = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header />
      <main className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-400 via-pink-500 to-green-400 bg-clip-text text-transparent">
            Sobre o Projeto Música Perfeita
          </h1>
          
          <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">
            Criamos músicas personalizadas com inteligência artificial que emocionam e transformam momentos em memórias inesquecíveis
          </p>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-pink-600">Nossa História</h2>
            <p className="text-gray-700 mb-6">
              O <strong>Música Perfeita</strong> nasceu da paixão por unir tecnologia, música e emoção. Percebemos como presentes personalizados 
              tocam profundamente as pessoas, e decidimos criar um serviço que transforma histórias de amor, 
              amizade e carinho em canções únicas que ficarão para sempre na memória. Utilizando <strong>inteligência artificial avançada</strong>, 
              conseguimos criar composições musicais que capturam a essência dos relacionamentos e momentos especiais.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-pink-600">Como Funciona</h2>
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-4">
                <div className="bg-yellow-100 rounded-full p-3 text-xl">1</div>
                <div>
                  <h3 className="text-lg font-medium">Cadastro Simples</h3>
                  <p className="text-gray-700">
                    Crie uma conta em menos de 1 minuto, sem necessidade de cartão de crédito. 
                    Nossa plataforma é segura e de fácil navegação, projetada para facilitar seu processo de criação musical.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-pink-100 rounded-full p-3 text-xl">2</div>
                <div>
                  <h3 className="text-lg font-medium">Conte sua História</h3>
                  <p className="text-gray-700">
                    Compartilhe os detalhes importantes, sentimentos e memórias para inspirar a composição.
                    Quanto mais detalhes você fornecer, mais personalizada e significativa será sua <strong>música exclusiva</strong>.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-full p-3 text-xl">3</div>
                <div>
                  <h3 className="text-lg font-medium">Ouça e Aprove</h3>
                  <p className="text-gray-700">
                    Você receberá uma prévia para aprovar antes de qualquer pagamento. Nossa <strong>inteligência artificial musical</strong> 
                    criará uma amostra para você avaliar a qualidade e o estilo da composição.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 rounded-full p-3 text-xl">4</div>
                <div>
                  <h3 className="text-lg font-medium">Receba sua Música</h3>
                  <p className="text-gray-700">
                    Após o pagamento, você receberá a <strong>música personalizada completa</strong> para download e compartilhamento.
                    Ideal para presentes em <strong>aniversários</strong>, <strong>casamentos</strong>, <strong>declarações de amor</strong> e momentos especiais.
                  </p>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4 text-pink-600">Nossa Missão</h2>
            <p className="text-gray-700 mb-6">
              Acreditamos que cada relacionamento tem uma trilha sonora única. Nossa missão é capturar a essência 
              dos seus sentimentos e transformá-los em uma <strong>experiência musical personalizada</strong> que será lembrada e celebrada por anos.
              Com <strong>inteligência artificial</strong> e dedicação humana, criamos músicas que tocam corações.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-pink-600">Diferenciais da Nossa Tecnologia</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-medium text-yellow-800 mb-2">IA Musical Avançada</h3>
                <p className="text-gray-700 text-sm">
                  Utilizamos algoritmos avançados de inteligência artificial para compor melodias harmonicamente ricas e emocionalmente impactantes.
                </p>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg">
                <h3 className="font-medium text-pink-800 mb-2">Personalização Profunda</h3>
                <p className="text-gray-700 text-sm">
                  Nossa tecnologia captura não apenas nomes e datas, mas contextos emocionais e narrativas pessoais em cada composição.
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-800 mb-2">Produção Profissional</h3>
                <p className="text-gray-700 text-sm">
                  Cada música é mixada e masterizada com padrões de alta qualidade, garantindo um resultado digno de estúdio.
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">Versatilidade de Estilos</h3>
                <p className="text-gray-700 text-sm">
                  Nossa IA é treinada em diversos gêneros musicais, permitindo criar desde baladas românticas até batidas modernas.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-100 via-pink-100 to-green-100 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-3 text-center">Inteligência Artificial a Serviço da Emoção</h2>
              <p className="text-gray-700 text-center mb-4">
                A <strong>Música Perfeita</strong> utiliza tecnologia de ponta em inteligência artificial para criar composições musicais 
                que expressam sentimentos humanos de forma genuína e tocante. Nossa tecnologia aprende e evolui constantemente 
                para oferecer experiências musicais cada vez mais personalizadas.
              </p>
            </div>
            
            <div className="text-center">
              <Link to="/cadastro">
                <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white">
                  Crie Sua Música Personalizada
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Sobre;
