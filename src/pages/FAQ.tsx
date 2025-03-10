
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  HelpCircle, Clock, Sparkles, CreditCard, Users, Music, FileText, Mail, 
  Headphones, Heart, ArrowRight, PenTool, MessageCircle, Gift, Star, Zap,
  Repeat, ShieldCheck, MusicIcon, BrainCircuit, Palette, Languages, Smartphone,
  Calendar, LucideIcon, Award, Mic2, DollarSign, Lightbulb, Phone
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FaqItemProps {
  question: string;
  answer: string;
  icon: LucideIcon;
  color: string;
}

const FaqItem = ({ question, answer, icon: Icon, color }: FaqItemProps) => {
  return (
    <Card className={`border-l-4 border-${color}-400 mb-4 overflow-hidden`}>
      <AccordionItem value={question.replace(/\s+/g, '-').toLowerCase()}>
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50">
          <div className="flex items-center text-left">
            <div className={`mr-3 p-2 rounded-full bg-${color}-100`}>
              <Icon className={`h-5 w-5 text-${color}-500`} />
            </div>
            <span className="font-medium text-gray-800">{question}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 py-4 text-gray-600 bg-gray-50/50">
          <div className="ml-10">{answer}</div>
        </AccordionContent>
      </AccordionItem>
    </Card>
  );
};

const FAQ = () => {
  const faqItems: FaqItemProps[] = [
    {
      question: "O que é o serviço Música Perfeita?",
      answer: "O Música Perfeita é um serviço único que cria músicas personalizadas com base na sua história pessoal. Utilizamos tecnologia avançada e sensibilidade artística para transformar seus sentimentos, memórias e momentos especiais em canções originais que capturam a essência da sua história.",
      icon: Music,
      color: "purple"
    },
    {
      question: "Como funciona o processo de criação da minha música?",
      answer: "É simples! Você preenche um formulário detalhado compartilhando sua história, relacionamento, memórias especiais e preferências musicais. Nossa equipe analisa essas informações e, com auxílio de tecnologia avançada, compõe uma música original que reflete sua história. Após a composição, produzimos a música com instrumentos de alta qualidade e, se solicitado, adicionamos vocais profissionais.",
      icon: PenTool,
      color: "blue"
    },
    {
      question: "Quanto tempo leva para receber minha música personalizada?",
      answer: "O tempo de produção varia de 5 a 14 dias úteis, dependendo da complexidade do projeto e do volume de pedidos. Projetos com urgência podem ter prazo reduzido mediante disponibilidade e taxa adicional. Recomendamos fazer seu pedido com antecedência, especialmente para datas comemorativas importantes.",
      icon: Clock,
      color: "amber"
    },
    {
      question: "As músicas usam inteligência artificial?",
      answer: "Sim, utilizamos inteligência artificial como ferramenta auxiliar no processo criativo, mas com supervisão humana em todas as etapas. A tecnologia nos ajuda a transformar sua história em letra e melodia, mas toda a produção é revisada e aperfeiçoada por nossa equipe de músicos e produtores, garantindo qualidade e originalidade em cada composição.",
      icon: BrainCircuit,
      color: "indigo"
    },
    {
      question: "Posso solicitar alterações na música depois de pronta?",
      answer: "Sim! Oferecemos uma revisão sem custo adicional caso a música não atenda completamente suas expectativas. Alterações adicionais podem ser solicitadas mediante taxa, dependendo da complexidade das mudanças. Nossa prioridade é sua satisfação, por isso trabalhamos para entregar uma música que realmente represente sua história.",
      icon: Repeat,
      color: "cyan"
    },
    {
      question: "Como recebo minha música após finalizada?",
      answer: "Você receberá sua música em formato digital MP3 de alta qualidade via e-mail. Também disponibilizamos a música em sua área do cliente no nosso site, onde poderá baixá-la e ouvi-la quantas vezes quiser. Para pedidos que incluem pacotes especiais, também enviamos materiais físicos como pendrive personalizado ou CD conforme contratado.",
      icon: Mail,
      color: "pink"
    },
    {
      question: "Posso usar a música comercialmente ou em redes sociais?",
      answer: "Sua música é para uso pessoal e pode ser compartilhada em redes sociais pessoais. Para uso comercial (publicidade, produtos à venda, etc.), é necessário adquirir uma licença comercial adicional. Entre em contato conosco para discutir opções de licenciamento para uso profissional ou comercial.",
      icon: Users,
      color: "teal"
    },
    {
      question: "Como garantem a originalidade da minha música?",
      answer: "Cada música é criada exclusivamente para você, baseada nas informações que nos fornece. Não utilizamos templates ou músicas pré-compostas. Nossa equipe cria cada composição do zero, garantindo que sua música seja única e original, assim como sua história.",
      icon: Sparkles,
      color: "violet"
    },
    {
      question: "Quais formas de pagamento são aceitas?",
      answer: "Aceitamos pagamentos via PIX, boleto bancário e cartões de crédito (podendo parcelar em até 12x com juros). Também oferecemos descontos para pagamentos à vista via PIX. Todas as transações são processadas por plataformas seguras como Mercado Pago.",
      icon: CreditCard,
      color: "emerald"
    },
    {
      question: "E se eu não gostar do resultado final?",
      answer: "Nossa prioridade é sua satisfação. Se você não estiver completamente satisfeito com o resultado, oferecemos uma revisão gratuita para ajustar a música de acordo com seu feedback. Caso ainda não esteja satisfeito, temos uma política de devolução que pode ser acionada em casos específicos dentro de 7 dias após a entrega final.",
      icon: Heart,
      color: "red"
    },
    {
      question: "Posso escolher o gênero musical da minha canção?",
      answer: "Absolutamente! Durante o preenchimento do formulário, você pode indicar suas preferências de gênero musical. Trabalhamos com uma ampla variedade de estilos, desde pop, rock, MPB, sertanejo até bossa nova, reggae e muitos outros. Caso tenha dúvidas sobre qual estilo se adequaria melhor à sua história, nossa equipe pode oferecer sugestões personalizadas.",
      icon: Headphones,
      color: "blue"
    },
    // Novas perguntas adicionadas
    {
      question: "Preciso ter conhecimento musical para pedir uma música?",
      answer: "Absolutamente não! Nosso sistema foi desenhado para ser acessível a todos, independentemente do seu conhecimento musical. Você só precisa compartilhar sua história e sentimentos - nossa equipe cuidará de todos os aspectos técnicos e musicais para transformar sua narrativa em uma bela canção.",
      icon: Lightbulb,
      color: "yellow"
    },
    {
      question: "Como faço para apresentar a música como presente?",
      answer: "Temos diversas opções! Além do arquivo digital que pode ser enviado por mensagem ou e-mail, oferecemos o pacote com Quadro Musical com QR Code que torna a experiência ainda mais especial. O quadro decorativo contém um código QR que, quando escaneado, reproduz a música - perfeito para presentear em ocasiões importantes.",
      icon: Gift,
      color: "pink"
    },
    {
      question: "Posso escolher a voz do cantor ou cantora?",
      answer: "Sim! Durante o preenchimento do formulário de pedido, você pode indicar suas preferências quanto ao tipo de voz (masculina, feminina ou ambas) e até mesmo especificar um estilo vocal específico. Contamos com diversos cantores e cantoras com diferentes timbres e estilos para melhor atender à sua solicitação.",
      icon: Mic2,
      color: "purple"
    },
    {
      question: "A música personalizada tem direitos autorais?",
      answer: "Sim. Após a finalização e pagamento, você recebe uma licença de uso pessoal da música, podendo reproduzi-la e compartilhá-la em contextos pessoais. Os direitos autorais da composição permanecem com o Música Perfeita, mas você tem garantia de exclusividade - sua música nunca será vendida ou oferecida para outra pessoa.",
      icon: ShieldCheck,
      color: "green"
    },
    {
      question: "Qual a qualidade do arquivo de música que receberei?",
      answer: "Entregamos sua música em formato MP3 de alta qualidade (320kbps), adequado para reprodução em qualquer dispositivo com excelente fidelidade sonora. Se precisar de formatos específicos como WAV ou FLAC para aplicações profissionais, podemos fornecê-los mediante solicitação.",
      icon: MusicIcon,
      color: "blue"
    },
    {
      question: "Consigo ouvir exemplos antes de pedir minha música?",
      answer: "Sim! Você pode ouvir diversos exemplos de nossas criações na página 'Nossas Músicas'. Lá você encontrará músicas de diferentes estilos e gêneros que criamos para outros clientes, dando uma boa ideia da qualidade e variedade do nosso trabalho.",
      icon: Headphones,
      color: "indigo"
    },
    {
      question: "É possível incluir instrumentos específicos na música?",
      answer: "Certamente! Durante o preenchimento do pedido, você pode mencionar quais instrumentos gostaria que fossem destacados na composição (guitarra, piano, violão, etc.). Nossa equipe fará o possível para atender às suas preferências, desde que façam sentido musical com o gênero e estilo escolhidos.",
      icon: Music,
      color: "orange"
    },
    {
      question: "Posso pedir uma música em outro idioma?",
      answer: "Sim, podemos criar músicas em diferentes idiomas. Além do português, produzimos regularmente em inglês e espanhol. Para outros idiomas, fazemos uma avaliação caso a caso para garantir a qualidade da pronúncia e interpretação. Informe sua preferência de idioma ao preencher o formulário de pedido.",
      icon: Languages,
      color: "sky"
    },
    {
      question: "Preciso pagar antecipadamente pelo serviço?",
      answer: "Não! Uma das grandes vantagens do Música Perfeita é que você só paga depois de aprovar sua música. Após preencher o formulário, iniciamos o processo de produção e você recebe uma prévia. Somente após sua aprovação é que realizamos o pagamento, garantindo sua total satisfação com o resultado.",
      icon: DollarSign,
      color: "green"
    },
    {
      question: "Como faço para acompanhar o andamento da minha música?",
      answer: "Após fazer seu pedido, você receberá acesso à sua área de cliente onde poderá acompanhar cada etapa da produção. Além disso, enviamos atualizações por e-mail e WhatsApp sobre o progresso da sua música, mantendo-o informado durante todo o processo criativo.",
      icon: Smartphone,
      color: "slate"
    },
    {
      question: "Posso solicitar uma música para uma data específica?",
      answer: "Sim, mas recomendamos que faça seu pedido com antecedência. Informe a data desejada no formulário e faremos o possível para atender ao prazo. Em períodos de alta demanda (como Dia dos Namorados, Dia das Mães, etc.), sugerimos solicitar com pelo menos 3 semanas de antecedência para garantir a entrega a tempo.",
      icon: Calendar,
      color: "rose"
    },
    {
      question: "É possível criar músicas para eventos corporativos?",
      answer: "Sim! Além das músicas para ocasiões pessoais, também criamos composições para empresas, eventos corporativos, jingles e músicas temáticas. Entre em contato diretamente conosco para discutir projetos corporativos, pois estes têm um processo de cotação específico baseado nas necessidades do cliente.",
      icon: Award,
      color: "blue"
    },
    {
      question: "Vocês oferecem alguma garantia de satisfação?",
      answer: "Sim! Oferecemos garantia de satisfação em todas as nossas músicas. Se você não estiver satisfeito com o resultado, terá direito a uma revisão gratuita. Além disso, caso realmente não fique satisfeito após a revisão, oferecemos política de reembolso em condições específicas, detalhadas em nossos Termos e Condições.",
      icon: Star,
      color: "amber"
    },
    {
      question: "Como funciona o atendimento ao cliente?",
      answer: "Nosso atendimento está disponível por WhatsApp, e-mail e através da área do cliente no site. Respondemos mensagens em horário comercial, de segunda a sexta, das 9h às 18h, e aos sábados das 9h às 13h. Para dúvidas urgentes, recomendamos o contato via WhatsApp para respostas mais rápidas.",
      icon: Phone,
      color: "green"
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mb-4 shadow-md">
              <HelpCircle className="h-12 w-12 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
              Dúvidas Frequentes
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Respostas para as perguntas mais comuns sobre nosso serviço de músicas personalizadas
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 mb-8">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <FaqItem
                  key={index}
                  question={item.question}
                  answer={item.answer}
                  icon={item.icon}
                  color={item.color}
                />
              ))}
            </Accordion>
          </div>

          <div className="mt-10 text-center bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-purple-700">Ainda tem dúvidas?</h3>
            <p className="text-gray-600 mb-4">
              Entre em contato conosco por WhatsApp ou e-mail. Estamos aqui para ajudar!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="https://wa.link/opvb86" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                <Phone className="h-5 w-5 mr-2" />
                Falar no WhatsApp
              </a>
              <a 
                href="mailto:contato.musicaperfeita@gmail.com"
                className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                <Mail className="h-5 w-5 mr-2" />
                Enviar E-mail
              </a>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-purple-800">Pronto para criar sua música?</h3>
                <p className="text-gray-700">
                  Transforme seus sentimentos em uma música inesquecível. Promoção por tempo limitado!
                </p>
              </div>
              <Link to="/cadastro">
                <Button className="bg-purple-600 hover:bg-purple-700 whitespace-nowrap">
                  Criar Música <ArrowRight className="ml-2 h-4 w-4" />
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

export default FAQ;
