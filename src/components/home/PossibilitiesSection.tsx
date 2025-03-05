
import { Music, Cake, Gift, Heart, Leaf, Baby, Sparkles, Award, PartyPopper } from "lucide-react";

const PossibilitiesSection = () => {
  return (
    <section className="py-16 px-6 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-6 text-purple-800">
          Deixe que a magia da música personalize suas emoções e momentos
        </h2>
        
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto text-lg">
          Cada momento especial merece uma trilha sonora única. Descubra como nossa música personalizada 
          pode tornar suas ocasiões inesquecíveis.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: Dias Comemorativos */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:translate-y-[-5px] border border-purple-100">
            <div className="flex justify-center mb-4">
              <div className="bg-purple-700 p-4 rounded-full">
                <Music className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center text-purple-700">Dias Comemorativos</h3>
            <p className="text-gray-600 text-center">
              Dia dos Pais, Dia das Mães, Dia do Amigo e outros: Celebre essas datas especiais com uma música 
              personalizada que expressa todo o amor e carinho que você sente.
            </p>
          </div>
          
          {/* Card 2: Aniversários */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:translate-y-[-5px] border border-purple-100">
            <div className="flex justify-center mb-4">
              <div className="bg-purple-700 p-4 rounded-full">
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
              <div className="bg-purple-700 p-4 rounded-full">
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
              <div className="bg-purple-700 p-4 rounded-full">
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
              <div className="bg-purple-700 p-4 rounded-full">
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
              <div className="bg-purple-700 p-4 rounded-full">
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

        <div className="mt-12 text-center">
          <p className="text-xl text-purple-800 font-medium mb-8">Eternize seus sentimentos em melodias únicas</p>
          <div className="max-w-4xl mx-auto h-[300px] bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center overflow-hidden shadow-md">
            <img 
              src="/lovable-uploads/efa43e31-1060-4bd1-bbb2-706856632d39.png" 
              alt="Deixe que a magia da música personalize suas emoções e momentos"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PossibilitiesSection;
