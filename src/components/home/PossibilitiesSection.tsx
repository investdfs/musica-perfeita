
const PossibilitiesSection = () => {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          O que você pode fazer com sua música?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-yellow-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4 text-center">💍</div>
            <h3 className="text-xl font-semibold mb-3 text-center">Para Momentos Especiais</h3>
            <p className="text-gray-700">
              Surpreenda no casamento ou noivado com uma serenata única.
            </p>
          </div>
          
          <div className="bg-pink-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4 text-center">🎂</div>
            <h3 className="text-xl font-semibold mb-3 text-center">Celebre Aniversários</h3>
            <p className="text-gray-700">
              Celebre aniversários com uma canção feita só pra ela/ele.
            </p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4 text-center">🎁</div>
            <h3 className="text-xl font-semibold mb-3 text-center">Presente Inesquecível</h3>
            <p className="text-gray-700">
              Dê um presente especial em datas como Dia dos Namorados ou Natal.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="max-w-md mx-auto h-40 bg-gradient-to-r from-yellow-100 via-pink-100 to-green-100 rounded-lg flex items-center justify-center">
            <div className="text-4xl">💃 🕺</div>
          </div>
          <p className="mt-4 text-gray-500 italic">Casal dançando ao som da música personalizada</p>
        </div>
      </div>
    </section>
  );
};

export default PossibilitiesSection;
