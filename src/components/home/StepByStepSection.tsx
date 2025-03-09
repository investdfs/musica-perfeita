
import { Music, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "1",
    title: "contrate",
    description: (
      <>
        Escolha <a href="/cadastro" className="text-amber-600 font-medium hover:underline">como a Canção será entregue</a> e a forma de pagamento.
      </>
    ),
    icon: <Gift className="h-6 w-6 text-amber-500" />,
    color: "border-amber-500",
  },
  {
    number: "2",
    title: "conte",
    description: "Conte sua história com o máximo de detalhes, em um texto ou por áudio.",
    icon: <Music className="h-6 w-6 text-amber-500" />,
    color: "border-amber-500",
  },
  {
    number: "3",
    title: "aprove",
    description: "Você recebe uma versão simples da Canção para aprovação de música e letra.",
    icon: <Music className="h-6 w-6 text-amber-500" />,
    color: "border-amber-500",
  },
  {
    number: "4",
    title: "aguarde",
    description: "Segure a ansiedade e aguarde enquanto a gente produz a versão com o arranjo final!",
    icon: <Music className="h-6 w-6 text-amber-500" />,
    color: "border-amber-500",
  },
  {
    number: "5",
    title: "emocione",
    description: "Receba a Canção da forma como escolheu e emocione quem você ama!",
    icon: <Music className="h-6 w-6 text-amber-500" />,
    color: "border-amber-500",
  },
];

const StepByStepSection = () => {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Como Funciona
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Processo simples em 5 passos para criar sua música personalizada
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={cn(
                "flex flex-col items-center text-center p-6 bg-white rounded-lg border-t-4 shadow-md hover:shadow-lg transition-shadow",
                step.color
              )}
            >
              <div className="relative mb-4">
                <div className="text-amber-700 font-bold text-6xl" style={{ fontFamily: 'cursive' }}>
                  {step.number}
                </div>
                <div className="absolute -top-1 right-0 transform translate-x-1/4">
                  {step.icon}
                </div>
              </div>
              
              <h3 className="text-amber-700 font-bold text-xl mb-2">{step.title}</h3>
              
              <p className="text-gray-600 text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepByStepSection;
