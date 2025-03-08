
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, ExternalLink } from "lucide-react";

const services = [
  {
    id: 1,
    name: "Música Perfeita",
    icon: "Music",
    price: "R$ 100,00",
    isOurService: true,
    link: null,
  },
  {
    id: 2,
    name: "Melody Studio",
    icon: "Music",
    price: "R$ 150,00",
    isOurService: false,
    link: "https://example.com/melody-studio",
  },
  {
    id: 3,
    name: "SongFinch",
    icon: "Music",
    price: "R$ 990,00",
    isOurService: false,
    link: "https://songfinch.com",
  },
  {
    id: 4,
    name: "Custom Songs",
    icon: "Music",
    price: "R$ 1.200,00",
    isOurService: false,
    link: "https://example.com/custom-songs",
  },
];

const PriceComparisonSection = () => {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Por que nosso preço é imbatível?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compare nosso preço com os principais serviços do mercado e veja a economia!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Card
              key={service.id}
              className={`relative overflow-hidden card-hover-effect transition-all ${
                service.isOurService
                  ? "border-2 border-green-500 shadow-lg"
                  : "border border-gray-200"
              }`}
            >
              {service.isOurService && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-semibold py-1 px-3 rounded-bl-lg">
                  Melhor Escolha
                </div>
              )}
              <CardContent className="pt-8 px-4 pb-6 flex flex-col items-center">
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 ${
                    service.isOurService
                      ? "bg-green-500/10 text-green-600"
                      : "bg-blue-500/10 text-blue-600"
                  }`}
                >
                  <Music className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                <p className="text-2xl font-bold mb-4">{service.price}</p>
                
                {!service.isOurService && service.link && (
                  <a 
                    href={service.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-auto"
                  >
                    <Button 
                      variant="outline" 
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      Ver <ExternalLink className="ml-1 h-4 w-4" />
                    </Button>
                  </a>
                )}
                
                {service.isOurService && (
                  <div className="mt-auto h-9 invisible">
                    {/* Espaço reservado para manter o alinhamento */}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PriceComparisonSection;
