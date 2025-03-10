
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQ = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
              <HelpCircle className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Perguntas Frequentes</h1>
            <p className="text-lg text-gray-600">
              Respostas para as dúvidas mais comuns sobre nosso serviço de músicas personalizadas
            </p>
          </div>

          <Accordion type="single" collapsible className="bg-white shadow-md rounded-lg p-6">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left font-medium">
                O que é o serviço Música Perfeita?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                O Música Perfeita é um serviço único que cria músicas personalizadas com base na sua história pessoal. 
                Utilizamos tecnologia avançada e sensibilidade artística para transformar seus sentimentos, memórias e 
                momentos especiais em canções originais que capturam a essência da sua história.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left font-medium">
                Como funciona o processo de criação da minha música?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                É simples! Você preenche um formulário detalhado compartilhando sua história, relacionamento, memórias especiais 
                e preferências musicais. Nossa equipe analisa essas informações e, com auxílio de tecnologia avançada, compõe uma 
                música original que reflete sua história. Após a composição, produzimos a música com instrumentos de alta qualidade 
                e, se solicitado, adicionamos vocais profissionais.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left font-medium">
                Quanto tempo leva para receber minha música personalizada?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                O tempo de produção varia de 5 a 14 dias úteis, dependendo da complexidade do projeto e do volume de pedidos. 
                Projetos com urgência podem ter prazo reduzido mediante disponibilidade e taxa adicional. Recomendamos fazer 
                seu pedido com antecedência, especialmente para datas comemorativas importantes.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left font-medium">
                As músicas usam inteligência artificial?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Sim, utilizamos inteligência artificial como ferramenta auxiliar no processo criativo, mas com supervisão 
                humana em todas as etapas. A tecnologia nos ajuda a transformar sua história em letra e melodia, mas toda 
                a produção é revisada e aperfeiçoada por nossa equipe de músicos e produtores, garantindo qualidade e 
                originalidade em cada composição.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left font-medium">
                Posso solicitar alterações na música depois de pronta?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Sim! Oferecemos uma revisão sem custo adicional caso a música não atenda completamente suas expectativas. 
                Alterações adicionais podem ser solicitadas mediante taxa, dependendo da complexidade das mudanças. Nossa 
                prioridade é sua satisfação, por isso trabalhamos para entregar uma música que realmente represente sua história.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left font-medium">
                Como recebo minha música após finalizada?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Você receberá sua música em formato digital MP3 de alta qualidade via e-mail. Também disponibilizamos a música 
                em sua área do cliente no nosso site, onde poderá baixá-la e ouvi-la quantas vezes quiser. Para pedidos que 
                incluem pacotes especiais, também enviamos materiais físicos como pendrive personalizado ou CD conforme contratado.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger className="text-left font-medium">
                Posso usar a música comercialmente ou em redes sociais?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Sua música é para uso pessoal e pode ser compartilhada em redes sociais pessoais. Para uso comercial 
                (publicidade, produtos à venda, etc.), é necessário adquirir uma licença comercial adicional. Entre em 
                contato conosco para discutir opções de licenciamento para uso profissional ou comercial.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger className="text-left font-medium">
                Como garantem a originalidade da minha música?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Cada música é criada exclusivamente para você, baseada nas informações que nos fornece. Não utilizamos 
                templates ou músicas pré-compostas. Nossa equipe cria cada composição do zero, garantindo que sua música 
                seja única e original, assim como sua história.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9">
              <AccordionTrigger className="text-left font-medium">
                Quais formas de pagamento são aceitas?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Aceitamos pagamentos via PIX, boleto bancário e cartões de crédito (podendo parcelar em até 12x com juros). 
                Também oferecemos descontos para pagamentos à vista via PIX. Todas as transações são processadas por 
                plataformas seguras como Mercado Pago.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10">
              <AccordionTrigger className="text-left font-medium">
                E se eu não gostar do resultado final?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Nossa prioridade é sua satisfação. Se você não estiver completamente satisfeito com o resultado, 
                oferecemos uma revisão gratuita para ajustar a música de acordo com seu feedback. Caso ainda não 
                esteja satisfeito, temos uma política de devolução que pode ser acionada em casos específicos 
                dentro de 7 dias após a entrega final.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-11">
              <AccordionTrigger className="text-left font-medium">
                Posso escolher o gênero musical da minha canção?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Absolutamente! Durante o preenchimento do formulário, você pode indicar suas preferências de gênero 
                musical. Trabalhamos com uma ampla variedade de estilos, desde pop, rock, MPB, sertanejo até 
                bossa nova, reggae e muitos outros. Caso tenha dúvidas sobre qual estilo se adequaria melhor à sua 
                história, nossa equipe pode oferecer sugestões personalizadas.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-10 text-center">
            <p className="text-gray-600">
              Ainda tem dúvidas? Entre em contato conosco pelo WhatsApp <span className="font-medium">(32) 99884-7713</span> ou 
              e-mail <span className="font-medium">contato.musicaperfeita@gmail.com</span>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
