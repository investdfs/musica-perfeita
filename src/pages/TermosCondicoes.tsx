
import React from "react";
import { Separator } from "@/components/ui/separator";

const TermosCondicoes = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Termos e Condições</h1>
      <Separator className="mb-8" />

      <div className="prose prose-purple max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Aceitação dos Termos</h2>
          <p className="text-gray-600 mb-4">
            Ao acessar ou utilizar o serviço Musicaperfeita, você concorda em cumprir e estar sujeito a estes Termos e 
            Condições de uso. Se você não concordar com qualquer parte destes termos, não poderá acessar ou utilizar nossos serviços.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. Descrição do Serviço</h2>
          <p className="text-gray-600 mb-4">
            O Musicaperfeita oferece serviços de criação de músicas personalizadas utilizando tecnologia de 
            inteligência artificial, com base nas informações fornecidas pelos usuários. As músicas são criadas 
            especificamente para cada cliente e podem ser utilizadas para diferentes ocasiões como aniversários, 
            casamentos, declarações de amor, entre outros.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Cadastro e Conta</h2>
          <p className="text-gray-600 mb-4">
            Para utilizar alguns dos nossos serviços, é necessário criar uma conta. Você é responsável por manter 
            a confidencialidade de sua senha e é totalmente responsável por todas as atividades realizadas em sua conta.
          </p>
          <p className="text-gray-600 mb-4">
            Você concorda em notificar imediatamente o Musicaperfeita sobre qualquer uso não autorizado de sua conta 
            ou qualquer outra violação de segurança.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. Propriedade Intelectual</h2>
          <p className="text-gray-600 mb-4">
            As músicas criadas pelo Musicaperfeita são licenciadas para uso pessoal do cliente que as contratou. 
            A propriedade intelectual das composições permanece com o Musicaperfeita, mas concedemos uma licença 
            perpétua, não exclusiva e não transferível para o uso pessoal da música pelo cliente.
          </p>
          <p className="text-gray-600 mb-4">
            Os clientes não estão autorizados a:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-600">
            <li>Revender, sublicenciar ou distribuir comercialmente a música</li>
            <li>Reivindicar a autoria da composição</li>
            <li>Modificar substancialmente o conteúdo sem autorização prévia</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. Pagamento e Reembolso</h2>
          <p className="text-gray-600 mb-4">
            O pagamento é realizado antecipadamente para a criação da música personalizada. Aceitamos as 
            formas de pagamento disponibilizadas em nossa plataforma, incluindo Pix e cartões de crédito via Mercado Pago.
          </p>
          <p className="text-gray-600 mb-4">
            Nosso processo de reembolso:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-600">
            <li>Reembolso integral se cancelar antes do início da produção</li>
            <li>Reembolso parcial (50%) se cancelar durante o processo de produção</li>
            <li>Não há reembolso após a entrega da música final</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">6. Conteúdo do Usuário</h2>
          <p className="text-gray-600 mb-4">
            Ao fornecer informações para a criação da música personalizada, você garante que tem os direitos 
            necessários sobre esse conteúdo e que não infringe direitos de terceiros.
          </p>
          <p className="text-gray-600 mb-4">
            O Musicaperfeita se reserva o direito de recusar a criação de músicas que contenham conteúdo 
            considerado ofensivo, ilegal ou que viole direitos de terceiros.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">7. Limitação de Responsabilidade</h2>
          <p className="text-gray-600 mb-4">
            O Musicaperfeita não se responsabiliza por quaisquer danos diretos, indiretos, incidentais, 
            consequenciais ou punitivos decorrentes do uso ou incapacidade de usar nossos serviços.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">8. Modificações nos Termos</h2>
          <p className="text-gray-600 mb-4">
            O Musicaperfeita reserva-se o direito de modificar estes termos a qualquer momento. As alterações 
            entram em vigor imediatamente após sua publicação em nosso site. O uso contínuo dos serviços após 
            tais alterações constitui sua aceitação dos novos termos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">9. Lei Aplicável</h2>
          <p className="text-gray-600 mb-4">
            Estes termos são regidos pelas leis brasileiras. Qualquer disputa relacionada a estes termos será 
            submetida à jurisdição exclusiva dos tribunais de Minas Gerais, Brasil.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">10. Contato</h2>
          <p className="text-gray-600 mb-4">
            Caso tenha dúvidas sobre estes Termos e Condições, entre em contato conosco através do e-mail: 
            contato.musicaperfeita@gmail.com ou pelo WhatsApp: (32) 99884-7713.
          </p>
        </section>

        <div className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-gray-500 text-sm text-center">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermosCondicoes;
