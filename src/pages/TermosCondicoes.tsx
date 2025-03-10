
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermosCondicoes = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Termos e Condições</h1>
          
          <div className="space-y-6 text-gray-700">
            <p>Última atualização: 05 de março de 2025</p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">1. Introdução</h2>
            <p>
              Bem-vindo ao Música Perfeita! Estes Termos e Condições regem o uso do nosso site e serviços de criação de músicas personalizadas. 
              Ao acessar nosso site ou utilizar nossos serviços, você concorda com estes termos. Por favor, leia-os atentamente.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">2. Definições</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>"Música Perfeita", "nós", "nosso" referem-se à empresa Música Perfeita Ltda.</li>
              <li>"Usuário", "você", "seu" referem-se a qualquer pessoa que acesse nosso site ou utilize nossos serviços.</li>
              <li>"Serviços" refere-se à criação de músicas personalizadas e produtos relacionados oferecidos por nós.</li>
              <li>"Site" refere-se ao website www.musicaperfeita.com.br e todos os seus subdomínios.</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">3. Uso do Serviço</h2>
            <p>
              Nossos serviços são destinados a criar músicas personalizadas conforme as informações fornecidas pelos usuários. 
              Ao solicitar nossos serviços, você concorda em:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Fornecer informações verdadeiras e precisas.</li>
              <li>Utilizar o serviço apenas para fins legais e pessoais.</li>
              <li>Não violar direitos de terceiros, incluindo direitos autorais, marcas registradas ou privacidade.</li>
              <li>Não utilizar nosso serviço para criar conteúdo ofensivo, difamatório, pornográfico ou que promova ódio ou discriminação.</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">4. Processo de Criação e Entrega</h2>
            <p>
              Após o recebimento de seu pedido, iniciaremos o processo de criação da música personalizada. O prazo para entrega pode variar
              de 5 a 14 dias úteis, dependendo da complexidade do projeto e volume de pedidos. Poderemos entrar em contato para solicitar
              informações adicionais necessárias para a criação da música.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">5. Pagamento e Reembolso</h2>
            <p>
              Os preços dos nossos serviços estão disponíveis em nosso site e podem ser alterados sem aviso prévio. O pagamento só deve
              ser efetuado após a aprovação da prévia da música criada. Oferecemos as seguintes políticas de reembolso:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Se não conseguirmos produzir uma música que atenda às suas expectativas após uma revisão, oferecemos reembolso integral.</li>
              <li>Após a aprovação final e pagamento, não realizamos reembolsos, exceto em circunstâncias excepcionais avaliadas caso a caso.</li>
              <li>Para produtos físicos não entregues ou danificados durante o transporte, oferecemos reembolso ou reenvio.</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">6. Direitos Autorais e Licença de Uso</h2>
            <p>
              Após a finalização da música e confirmação do pagamento, você receberá uma licença de uso pessoal não exclusiva da música criada.
              Esta licença permite:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Reproduzir e ouvir a música para uso pessoal.</li>
              <li>Compartilhar a música em redes sociais pessoais e eventos particulares.</li>
              <li>Utilizar a música como trilha sonora em vídeos pessoais não comerciais.</li>
            </ul>
            <p>
              Os direitos autorais da composição, letra e produção permanecem com o Música Perfeita. Uso comercial da música 
              (publicidade, produtos à venda, etc.) requer uma licença comercial adicional.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">7. Modificações e Alterações</h2>
            <p>
              Oferecemos uma revisão gratuita após a entrega inicial da música. Alterações adicionais podem ser solicitadas mediante 
              taxa adicional, dependendo da complexidade das mudanças requeridas. Nos reservamos o direito de recusar alterações que 
              considerarmos tecnicamente inviáveis ou que comprometam a qualidade artística da obra.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">8. Limitação de Responsabilidade</h2>
            <p>
              O Música Perfeita não se responsabiliza por:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Informações incorretas ou imprecisas fornecidas pelo usuário.</li>
              <li>Interrupções ou falhas técnicas temporárias em nossos serviços.</li>
              <li>Uso indevido ou ilegal das músicas por parte dos usuários.</li>
              <li>Quaisquer danos indiretos, consequenciais ou punitivos decorrentes do uso de nossos serviços.</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">9. Privacidade</h2>
            <p>
              Respeitamos sua privacidade e protegemos seus dados pessoais. Para mais informações sobre como coletamos, usamos e protegemos
              suas informações, consulte nossa Política de Privacidade.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">10. Modificações dos Termos</h2>
            <p>
              Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após
              sua publicação no site. O uso continuado de nossos serviços após tais alterações constitui aceitação dos novos termos.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">11. Lei Aplicável e Jurisdição</h2>
            <p>
              Estes termos são regidos pelas leis do Brasil. Qualquer disputa relacionada a estes termos ou nossos serviços será
              submetida à jurisdição exclusiva dos tribunais de Minas Gerais, Brasil.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">12. Contato</h2>
            <p>
              Para questões relacionadas a estes Termos e Condições, entre em contato conosco através do e-mail contato.musicaperfeita@gmail.com
              ou pelo WhatsApp (32) 998847713.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermosCondicoes;
