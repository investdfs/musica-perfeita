
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PoliticaPrivacidade = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Política de Privacidade</h1>
          
          <div className="space-y-6 text-gray-700">
            <p>Última atualização: 05 de março de 2025</p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">1. Introdução</h2>
            <p>
              A Música Perfeita valoriza a privacidade dos seus usuários e está comprometida em proteger suas informações pessoais.
              Esta Política de Privacidade descreve como coletamos, usamos, compartilhamos e protegemos suas informações quando
              você utiliza nosso site e serviços.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">2. Informações que Coletamos</h2>
            <p>Podemos coletar os seguintes tipos de informações:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Informações de Cadastro:</strong> Nome, e-mail, telefone, endereço e informações de pagamento quando você cria uma conta ou solicita nossos serviços.</li>
              <li><strong>Informações de Perfil:</strong> Preferências musicais, histórias pessoais e outras informações que você compartilha para a criação da sua música personalizada.</li>
              <li><strong>Informações de Uso:</strong> Como você interage com nosso site, incluindo páginas visitadas, tempo de permanência e ações realizadas.</li>
              <li><strong>Informações de Dispositivo:</strong> Tipo de dispositivo, sistema operacional, navegador e informações de rede.</li>
              <li><strong>Comunicações:</strong> Conteúdo de mensagens, e-mails e outras comunicações que você troca conosco.</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">3. Como Usamos Suas Informações</h2>
            <p>Utilizamos suas informações para os seguintes fins:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Criar e entregar músicas personalizadas conforme solicitado.</li>
              <li>Processar pagamentos e gerenciar sua conta.</li>
              <li>Comunicar-nos com você sobre seu pedido, atualizações do serviço e promoções.</li>
              <li>Melhorar nossos serviços e desenvolver novos recursos.</li>
              <li>Resolver problemas técnicos e garantir a segurança do nosso site.</li>
              <li>Cumprir obrigações legais e proteger nossos direitos.</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">4. Compartilhamento de Informações</h2>
            <p>
              Podemos compartilhar suas informações com terceiros nas seguintes circunstâncias:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Prestadores de Serviços:</strong> Empresas que nos ajudam a fornecer nossos serviços, como processadores de pagamento, serviços de hospedagem e entrega.</li>
              <li><strong>Parceiros de Negócios:</strong> Músicos, produtores e outros profissionais que colaboram na criação de sua música personalizada.</li>
              <li><strong>Exigências Legais:</strong> Quando exigido por lei, ordem judicial ou para proteger nossos direitos legais.</li>
              <li><strong>Com seu Consentimento:</strong> Em outras circunstâncias, com sua permissão explícita.</li>
            </ul>
            <p>
              Não vendemos, alugamos ou comercializamos suas informações pessoais para terceiros para fins de marketing.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">5. Segurança das Informações</h2>
            <p>
              Implementamos medidas técnicas e organizacionais apropriadas para proteger suas informações contra acesso não autorizado,
              perda acidental, alteração ou destruição. Apesar de nossos esforços, nenhum sistema de segurança é impenetrável.
              Não podemos garantir a segurança absoluta de suas informações.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">6. Retenção de Dados</h2>
            <p>
              Mantemos suas informações pelo tempo necessário para fornecer nossos serviços e cumprir nossas obrigações legais.
              Quando suas informações não forem mais necessárias, iremos excluí-las ou anonimizá-las de forma segura.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">7. Seus Direitos</h2>
            <p>
              Você tem certos direitos em relação às suas informações pessoais, incluindo:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Acessar suas informações pessoais.</li>
              <li>Corrigir informações incorretas ou desatualizadas.</li>
              <li>Excluir suas informações em determinadas circunstâncias.</li>
              <li>Restringir ou se opor ao processamento de suas informações.</li>
              <li>Solicitar a transferência de suas informações.</li>
              <li>Retirar seu consentimento a qualquer momento.</li>
            </ul>
            <p>
              Para exercer esses direitos, entre em contato conosco através dos meios indicados na seção "Contato" abaixo.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">8. Cookies e Tecnologias Similares</h2>
            <p>
              Utilizamos cookies e tecnologias similares para melhorar sua experiência em nosso site, lembrar suas preferências
              e analisar como você interage com nosso conteúdo. Você pode controlar o uso de cookies através das configurações
              do seu navegador, mas isso pode afetar a funcionalidade de certas partes do nosso site.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">9. Privacidade de Crianças</h2>
            <p>
              Nossos serviços não são direcionados a menores de 18 anos. Não coletamos intencionalmente informações pessoais
              de crianças. Se você acredita que coletamos informações de um menor sem consentimento parental, entre em contato
              conosco imediatamente.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">10. Alterações nesta Política</h2>
            <p>
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre alterações significativas
              publicando a nova política em nosso site e, quando apropriado, por e-mail. Recomendamos que você revise esta política
              regularmente para se manter informado sobre nossas práticas de privacidade.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">11. Contato</h2>
            <p>
              Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade ou nossas práticas de privacidade,
              entre em contato conosco através do e-mail contato.musicaperfeita@gmail.com ou pelo WhatsApp (32) 998847713.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PoliticaPrivacidade;
