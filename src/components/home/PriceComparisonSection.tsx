
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, ExternalLink, AlertTriangle, Clock, Music } from "lucide-react";
import { cn } from "@/lib/utils";

// Dados estruturados dos serviços
const services = [
  {
    id: 1,
    name: "Música Perfeita",
    price: "R$ 100,00",
    isOurService: true,
    link: null,
    color: "green",
    features: {
      composicao: true,
      arranjo: true,
      letra: true,
      gravacao: true,
      mixagem: true,
      masterizacao: true,
      vozes: true,
      instrumentos: true,
      revisoes: true,
      entregaRapida: true,
      transparencia: true
    }
  },
  {
    id: 2,
    name: "Melody Studio",
    price: "R$ 150,00",
    isOurService: false,
    link: "https://example.com/melody-studio",
    color: "blue",
    features: {
      composicao: true,
      arranjo: true,
      letra: false,
      gravacao: true,
      mixagem: true,
      masterizacao: true,
      vozes: false,
      instrumentos: true,
      revisoes: false,
      entregaRapida: false,
      transparencia: false
    }
  },
  {
    id: 3,
    name: "SongFinch",
    price: "R$ 990,00",
    isOurService: false,
    link: "https://songfinch.com",
    color: "purple",
    features: {
      composicao: true,
      arranjo: true,
      letra: true,
      gravacao: true,
      mixagem: true,
      masterizacao: false,
      vozes: true,
      instrumentos: true,
      revisoes: false,
      entregaRapida: false,
      transparencia: false
    }
  },
  {
    id: 4,
    name: "Custom Songs",
    price: "R$ 1.200,00",
    isOurService: false,
    link: "https://example.com/custom-songs",
    color: "orange",
    features: {
      composicao: true,
      arranjo: true,
      letra: true,
      gravacao: true,
      mixagem: true,
      masterizacao: true,
      vozes: true,
      instrumentos: true,
      revisoes: false,
      entregaRapida: false,
      transparencia: false
    }
  },
];

// Lista dos recursos para exibir na tabela
const featuresList = [
  { id: "composicao", name: "Composição musical", icon: "Music" },
  { id: "arranjo", name: "Arranjo profissional", icon: "Music" },
  { id: "letra", name: "Letra personalizada", icon: "Music" },
  { id: "gravacao", name: "Gravação em estúdio", icon: "Music" },
  { id: "mixagem", name: "Mixagem", icon: "Music" },
  { id: "masterizacao", name: "Masterização", icon: "Music" },
  { id: "vozes", name: "Vocais profissionais", icon: "Music" },
  { id: "instrumentos", name: "Instrumentos de qualidade", icon: "Music" },
  { id: "revisoes", name: "Revisões ilimitadas", icon: "Music" },
  { id: "entregaRapida", name: "Entrega em até 7 dias", icon: "Clock" },
  { id: "transparencia", name: "Preço transparente", icon: "AlertTriangle" },
];

const PriceComparisonSection = () => {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comparação de Serviços
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Descubra por que o Música Perfeita é a melhor escolha para sua canção personalizada
          </p>
          <p className="text-sm text-gray-500 max-w-3xl mx-auto italic">
            A maioria dos serviços de música personalizada não divulga preços antecipadamente, 
            revelando os valores somente após longas negociações. No Música Perfeita, você 
            conhece todos os detalhes e preços antes mesmo de contratar, e só paga depois 
            de se emocionar com o resultado!
          </p>
        </div>

        {/* Versão desktop da tabela comparativa */}
        <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 shadow mb-8">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-6 font-medium text-gray-700">Serviço</th>
                {services.map(service => (
                  <th 
                    key={service.id} 
                    className={cn(
                      "py-4 px-6 font-medium text-center",
                      service.isOurService ? "bg-green-50" : ""
                    )}
                  >
                    <span className={`text-${service.color}-600 font-semibold block mb-1 text-lg`}>
                      {service.name}
                    </span>
                    <span className={`text-${service.color}-700 font-bold text-xl block mb-2`}>
                      {service.price}
                    </span>
                    {service.isOurService && (
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        Recomendado
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {featuresList.map((feature, index) => (
                <tr key={feature.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="py-3 px-6 font-medium flex items-center gap-2">
                    {feature.icon === "Music" ? (
                      <Music className="h-4 w-4 text-indigo-500" />
                    ) : feature.icon === "Clock" ? (
                      <Clock className="h-4 w-4 text-amber-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-purple-500" />
                    )}
                    {feature.name}
                  </td>
                  {services.map(service => (
                    <td 
                      key={`${service.id}-${feature.id}`} 
                      className={cn(
                        "py-3 px-6 text-center",
                        service.isOurService ? "bg-green-50" : ""
                      )}
                    >
                      {service.features[feature.id as keyof typeof service.features] ? (
                        <Check className={`h-5 w-5 mx-auto text-${service.isOurService ? 'green' : 'blue'}-500`} />
                      ) : (
                        <X className="h-5 w-5 mx-auto text-red-500" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-gray-100">
                <td className="py-4 px-6 font-medium">Saiba mais</td>
                {services.map(service => (
                  <td 
                    key={`action-${service.id}`} 
                    className={cn(
                      "py-4 px-6 text-center",
                      service.isOurService ? "bg-green-50" : ""
                    )}
                  >
                    {service.isOurService ? (
                      <Button 
                        className="bg-green-600 hover:bg-green-700 text-white font-medium"
                        onClick={() => window.location.href = "/cadastro"}
                      >
                        Comece Agora
                      </Button>
                    ) : (
                      <a 
                        href={service.link || "#"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button 
                          variant="outline" 
                          className={`text-${service.color}-600 border-${service.color}-600 hover:bg-${service.color}-50`}
                        >
                          Ver <ExternalLink className="ml-1 h-4 w-4" />
                        </Button>
                      </a>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Versão mobile com cards */}
        <div className="md:hidden grid grid-cols-1 gap-6">
          {services.map(service => (
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
                  Recomendado
                </div>
              )}
              <CardContent className="pt-8 px-4 pb-6 flex flex-col items-center">
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 ${
                    service.isOurService
                      ? "bg-green-500/10 text-green-600"
                      : `bg-${service.color}-500/10 text-${service.color}-600`
                  }`}
                >
                  <Music className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                <p className="text-2xl font-bold mb-4">{service.price}</p>
                
                <div className="w-full space-y-2 mb-6">
                  {featuresList.map(feature => (
                    <div key={`mobile-${service.id}-${feature.id}`} className="flex items-center justify-between">
                      <span className="text-sm">{feature.name}</span>
                      {service.features[feature.id as keyof typeof service.features] ? (
                        <Check className={`h-4 w-4 text-${service.isOurService ? 'green' : 'blue'}-500`} />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  ))}
                </div>

                {!service.isOurService && service.link && (
                  <a 
                    href={service.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-auto w-full"
                  >
                    <Button 
                      variant="outline" 
                      className={`w-full text-${service.color}-600 border-${service.color}-600 hover:bg-${service.color}-50`}
                    >
                      Ver <ExternalLink className="ml-1 h-4 w-4" />
                    </Button>
                  </a>
                )}
                
                {service.isOurService && (
                  <Button 
                    onClick={() => window.location.href = "/cadastro"}
                    className="mt-auto w-full bg-green-600 hover:bg-green-700 text-white font-medium"
                  >
                    Comece Agora
                  </Button>
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
