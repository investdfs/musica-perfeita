
import { Music, Cake, Gift, Heart, Leaf, Baby, Sparkles, Award, PartyPopper, GraduationCap, Diamond } from "lucide-react";

const PossibilitiesSection = () => {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6 text-purple-800">
          Deixe que a magia da música personalize suas emoções e momentos
        </h2>
        
        <p className="text-center text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto text-base sm:text-lg">
          Cada momento especial merece uma trilha sonora única. Descubra como nossa música personalizada 
          pode tornar suas ocasiões inesquecíveis.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: Dias Comemorativos */}
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:translate-y-[-5px] border border-purple-100">
            <div className="flex justify-center mb-4">
              <div className="bg-pink-500 p-3 sm:p-4 rounded-full">
                <Music className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-center text-purple-700">Dias Comemorativos</h3>
            <p className="text-gray-600 text-center text-sm sm:text-base">
              Dia dos Pais, Dia das Mães, Dia do Amigo e outros: Celebre essas datas especiais com uma música 
              personalizada que expressa todo o amor e carinho que você sente.
            </p>
          </div>
          
          {/* Card 2: Aniversários */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:translate-y-[-5px] border border-purple-100">
            <div className="flex justify-center mb-4">
              <div className="bg-pink-500 p-4 rounded-full">
                <Cake className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center text-purple-700">Aniversários</h3>
            <p className="text-gray-600 text-center">
              Transforme o dia de alguém querido em uma ocasião inesquecível com uma canção feita 
              exclusivamente para celebrar sua vida.
            </p>
          </div>
          
          {/* Card 3: Celebração do Nascimento */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:translate-y-[-5px] border border-purple-100">
            <div className="flex justify-center mb-4">
              <div className="bg-pink-500 p-4 rounded-full">
                <Baby className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center text-purple-700">Celebração do Nascimento</h3>
            <p className="text-gray-600 text-center">
              Marque a chegada de um novo bebê com uma melodia suave e encantadora, feita para celebrar o 
              início de uma nova vida.
            </p>
          </div>
          
          {/* Card 4: Casamento */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:translate-y-[-5px] border border-purple-100">
            <div className="flex justify-center mb-4">
              <div className="bg-pink-500 p-4 rounded-full">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center text-purple-700">Casamento</h3>
            <p className="text-gray-600 text-center">
              Crie a trilha sonora perfeita para o seu grande dia, com uma música personalizada que 
              capture cada momento de amor e felicidade.
            </p>
          </div>
          
          {/* Card 5: Homenagens */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:translate-y-[-5px] border border-purple-100">
            <div className="flex justify-center mb-4">
              <div className="bg-pink-500 p-4 rounded-full">
                <Award className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center text-purple-700">Homenagens</h3>
            <p className="text-gray-600 text-center">
              Honre a memória de alguém especial com uma canção que eternize suas lembranças e 
              toque o coração de todos.
            </p>
          </div>
          
          {/* Card 6: Chá Revelação */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:translate-y-[-5px] border border-purple-100">
            <div className="flex justify-center mb-4">
              <div className="bg-pink-500 p-4 rounded-full">
                <PartyPopper className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center text-purple-700">Chá Revelação</h3>
            <p className="text-gray-600 text-center">
              Anuncie a chegada do seu bebê de uma forma mágica e musical, com uma melodia que traga 
              emoção e alegria para este momento único.
            </p>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 text-center">
          <h3 className="text-xl text-purple-800 font-medium mb-5 sm:mb-6">Mais ocasiões para eternizar com música</h3>
          
          <div className="max-w-4xl mx-auto bg-pink-50 rounded-lg p-5 sm:p-8 shadow-md">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
              <div className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div className="bg-pink-500 p-2 rounded-full mb-2">
                  <Gift className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-purple-800 text-sm text-center">Bodas de Casamento</span>
              </div>
              
              <div className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div className="bg-pink-500 p-2 rounded-full mb-2">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-purple-800 text-sm text-center">Formatura</span>
              </div>
              
              <div className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div className="bg-pink-500 p-2 rounded-full mb-2">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-purple-800 text-sm text-center">Pedido de Namoro</span>
              </div>
              
              <div className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div className="bg-pink-500 p-2 rounded-full mb-2">
                  <Diamond className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-purple-800 text-sm text-center">Pedido de Noivado</span>
              </div>
              
              <div className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div className="bg-pink-500 p-2 rounded-full mb-2">
                  <Music className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-purple-800 text-sm text-center">Jubileu</span>
              </div>
              
              <div className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div className="bg-pink-500 p-2 rounded-full mb-2">
                  <Cake className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-purple-800 text-sm text-center">Bodas de Ouro</span>
              </div>
              
              <div className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div className="bg-pink-500 p-2 rounded-full mb-2">
                  <Gift className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-purple-800 text-sm text-center">Homenagem a amigos</span>
              </div>
              
              <div className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div className="bg-pink-500 p-2 rounded-full mb-2">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-purple-800 text-sm text-center">Pedido de Desculpas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PossibilitiesSection;
