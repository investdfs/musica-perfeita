
import { Music, Gift, Headphones, CheckCircle, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "1",
    title: "cadastre-se",
    description: (
      <>
        Crie a sua conta <a href="/cadastro" className="text-purple-600 font-medium hover:underline">gratuitamente</a>.
      </>
    ),
    icon: <Gift className="h-8 w-8 text-purple-500" />,
    color: "border-purple-500",
    bgColor: "bg-purple-50",
    textColor: "text-purple-500",
  },
  {
    number: "2",
    title: "conte",
    description: "Conte sua história com o máximo de detalhes, em um texto ou por áudio.",
    icon: <Music className="h-8 w-8 text-pink-500" />,
    color: "border-pink-500",
    bgColor: "bg-pink-50",
    textColor: "text-pink-500",
  },
  {
    number: "3",
    title: "aguarde",
    description: "Segure a ansiedade e aguarde enquanto a gente produz a versão com o arranjo final!",
    icon: <Headphones className="h-8 w-8 text-teal-500" />,
    color: "border-teal-500",
    bgColor: "bg-teal-50",
    textColor: "text-teal-500",
  },
  {
    number: "4",
    title: "aprove",
    description: "Você receberá um corte da Canção para aprovação de música e letra.",
    icon: <CheckCircle className="h-8 w-8 text-blue-500" />,
    color: "border-blue-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-500",
  },
  {
    number: "5",
    title: "emocione",
    description: "Aprovada a música, faça o pagamento! Agora é só emocionar a pessoa homenageada.",
    icon: <Heart className="h-8 w-8 text-red-500" />,
    color: "border-red-500",
    bgColor: "bg-red-50",
    textColor: "text-red-500",
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
                step.color,
                step.bgColor
              )}
            >
              <div className="relative mb-4">
                <div className={`${step.textColor} font-bold text-6xl`} style={{ fontFamily: 'cursive' }}>
                  {step.number}
                </div>
                {/* Ajuste na posição do ícone para não encobrir o número */}
                <div className="absolute -top-3 -right-4 transform translate-x-1/2 bg-white p-2 rounded-full shadow-sm">
                  {step.icon}
                </div>
              </div>
              
              <h3 className={`${step.textColor} font-bold text-xl mb-2`}>{step.title}</h3>
              
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
