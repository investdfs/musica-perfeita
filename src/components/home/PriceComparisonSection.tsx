
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, ExternalLink, AlertTriangle, Clock, Music, Mic, PenTool, BookOpen, Sparkles, Repeat, Zap, Heart } from "lucide-react";
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
      vocais: true,
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

// Lista dos recursos para exibir na tabela com ícones coloridos
const featuresList = [
  { id: "composicao", name: "Composição musical", icon: <Music className="h-5 w-5 text-purple-500" /> },
  { id: "arranjo", name: "Arranjo profissional", icon: <Sparkles className="h-5 w-5 text-amber-500" /> },
  { id: "letra", name: "Letra personalizada", icon: <PenTool className="h-5 w-5 text-blue-500" /> },
  { id: "gravacao", name: "Gravação em estúdio", icon: <Mic className="h-5 w-5 text-pink-500" /> },
  { id: "mixagem", name: "Mixagem profissional", icon: <Music className="h-5 w-5 text-indigo-500" /> },
  { id: "masterizacao", name: "Masterização de qualidade", icon: <Sparkles className="h-5 w-5 text-violet-500" /> },
  { id: "vozes", name: "Vocais profissionais", icon: <Mic className="h-5 w-5 text-rose-500" /> },
  { id: "instrumentos", name: "Instrumentos de qualidade", icon: <Music className="h-5 w-5 text-cyan-500" /> },
  { id: "revisoes", name: "Revisões ilimitadas", icon: <Repeat className="h-5 w-5 text-emerald-500" /> },
  { id: "entregaRapida", name: "Entrega em até 7 dias", icon: <Zap className="h-5 w-5 text-amber-500" /> },
  { id: "transparencia", name: "Preço transparente", icon: <Heart className="h-5 w-5 text-red-500" /> },
];

const PriceComparisonSection = () => {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comparação de Serviços
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Descubra por que o Música Perfeita é a melhor escolha para sua canção personalizada
          </p>
          <div className="bg-amber-100 border-l-4 border-amber-500 p-4 rounded-r-lg max-w-3xl mx-auto text-left mb-6">
            <p className="text-amber-800">
              <strong>Você sabia?</strong> A maioria dos serviços de música personalizada não divulga preços 
              antecipadamente, revelando valores somente após longas negociações. No <strong>Música Perfeita</strong>, 
              você conhece todos os detalhes e preços antes mesmo de contratar, e só paga depois de se 
              emocionar com o resultado!
            </p>
          </div>
        </div>

        {/* Versão desktop da tabela comparativa */}
        <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200 shadow-lg mb-8">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gradient-to-r from-purple-50 to-indigo-50">
                <th className="py-5 px-6 font-semibold text-gray-700 text-base">Serviços</th>
                {services.map(service => (
                  <th 
                    key={service.id} 
                    className={cn(
                      "py-6 px-6 font-medium text-center",
                      service.isOurService ? "bg-gradient-to-b from-green-50 to-emerald-100" : ""
                    )}
                  >
                    {service.isOurService && (
                      <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2 inline-block animate-pulse">
                        Recomendado
                      </span>
                    )}
                    <span className={`text-${service.isOurService ? 'green-600' : service.color === 'blue' ? 'blue-600' : service.color === 'purple' ? 'purple-600' : 'orange-600'} font-semibold block mb-1 text-lg`}>
                      {service.name}
                    </span>
                    <span className={`text-${service.isOurService ? 'green-700' : service.color === 'blue' ? 'blue-700' : service.color === 'purple' ? 'purple-700' : 'orange-700'} font-bold text-xl block mb-2`}>
                      {service.price}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {featuresList.map((feature, index) => (
                <tr 
                  key={feature.id} 
                  className={index % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"}
                  style={{transition: "all 0.2s ease"}}
                >
                  <td className="py-4 px-6 font-medium flex items-center gap-2">
                    {feature.icon}
                    {feature.name}
                  </td>
                  {services.map(service => (
                    <td 
                      key={`${service.id}-${feature.id}`} 
                      className={cn(
                        "py-4 px-6 text-center",
                        service.isOurService ? "bg-green-50" : ""
                      )}
                    >
                      {service.features[feature.id as keyof typeof service.features] ? (
                        <div className="flex justify-center">
                          <div className={`rounded-full p-1 ${service.isOurService ? 'bg-green-100' : 'bg-blue-100'}`}>
                            <Check className={`h-5 w-5 ${service.isOurService ? 'text-green-600' : 'text-blue-600'}`} />
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <div className="rounded-full p-1 bg-red-100">
                            <X className="h-5 w-5 text-red-500" />
                          </div>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-gradient-to-r from-gray-100 to-gray-50">
                <td className="py-5 px-6 font-semibold">Contrate agora</td>
                {services.map(service => (
                  <td 
                    key={`action-${service.id}`} 
                    className={cn(
                      "py-5 px-6 text-center",
                      service.isOurService ? "bg-green-50" : ""
                    )}
                  >
                    {service.isOurService ? (
                      <Button 
                        className="bg-green-600 hover:bg-green-700 text-white font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
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
                          className={`border ${
                            service.color === 'blue' ? 'border-blue-600 text-blue-600 hover:bg-blue-50' :
                            service.color === 'purple' ? 'border-purple-600 text-purple-600 hover:bg-purple-50' :
                            'border-orange-600 text-orange-600 hover:bg-orange-50'
                          }`}
                        >
                          Ver Serviço <ExternalLink className="ml-1 h-4 w-4" />
                        </Button>
                      </a>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Versão tablet para telas médias */}
        <div className="hidden md:block lg:hidden grid grid-cols-2 gap-6 mb-8">
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
                      ? "bg-green-100 text-green-600"
                      : service.color === 'blue' ? "bg-blue-100 text-blue-600" :
                        service.color === 'purple' ? "bg-purple-100 text-purple-600" :
                        "bg-orange-100 text-orange-600"
                  }`}
                >
                  <Music className="w-8 h-8" />
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  service.isOurService
                    ? "text-green-700"
                    : service.color === 'blue' ? "text-blue-700" :
                      service.color === 'purple' ? "text-purple-700" :
                      "text-orange-700"
                }`}>{service.name}</h3>
                <p className="text-2xl font-bold mb-4">{service.price}</p>
                
                <div className="w-full space-y-3 mb-6">
                  {featuresList.map(feature => (
                    <div key={`tablet-${service.id}-${feature.id}`} className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {service.features[feature.id as keyof typeof service.features] ? (
                          <div className={`rounded-full p-1 ${service.isOurService ? 'bg-green-100' : 'bg-blue-100'}`}>
                            <Check className={`h-4 w-4 ${service.isOurService ? 'text-green-600' : 'text-blue-600'}`} />
                          </div>
                        ) : (
                          <div className="rounded-full p-1 bg-red-100">
                            <X className="h-4 w-4 text-red-500" />
                          </div>
                        )}
                      </div>
                      <span className="text-sm">{feature.name}</span>
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
                      className={`w-full border ${
                        service.color === 'blue' ? 'border-blue-600 text-blue-600 hover:bg-blue-50' :
                        service.color === 'purple' ? 'border-purple-600 text-purple-600 hover:bg-purple-50' :
                        'border-orange-600 text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      Ver Serviço <ExternalLink className="ml-1 h-4 w-4" />
                    </Button>
                  </a>
                )}
                
                {service.isOurService && (
                  <Button 
                    onClick={() => window.location.href = "/cadastro"}
                    className="mt-auto w-full bg-green-600 hover:bg-green-700 text-white font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    Comece Agora
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
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
                      ? "bg-green-100 text-green-600"
                      : service.color === 'blue' ? "bg-blue-100 text-blue-600" :
                        service.color === 'purple' ? "bg-purple-100 text-purple-600" :
                        "bg-orange-100 text-orange-600"
                  }`}
                >
                  <Music className="w-8 h-8" />
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  service.isOurService
                    ? "text-green-700"
                    : service.color === 'blue' ? "text-blue-700" :
                      service.color === 'purple' ? "text-purple-700" :
                      "text-orange-700"
                }`}>{service.name}</h3>
                <p className="text-2xl font-bold mb-4">{service.price}</p>
                
                <div className="w-full space-y-3 mb-6">
                  {featuresList.map(feature => (
                    <div key={`mobile-${service.id}-${feature.id}`} className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {service.features[feature.id as keyof typeof service.features] ? (
                          <div className={`rounded-full p-1 ${service.isOurService ? 'bg-green-100' : 'bg-blue-100'}`}>
                            <Check className={`h-4 w-4 ${service.isOurService ? 'text-green-600' : 'text-blue-600'}`} />
                          </div>
                        ) : (
                          <div className="rounded-full p-1 bg-red-100">
                            <X className="h-4 w-4 text-red-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {feature.icon}
                        <span className="text-sm">{feature.name}</span>
                      </div>
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
                      className={`w-full border ${
                        service.color === 'blue' ? 'border-blue-600 text-blue-600 hover:bg-blue-50' :
                        service.color === 'purple' ? 'border-purple-600 text-purple-600 hover:bg-purple-50' :
                        'border-orange-600 text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      Ver Serviço <ExternalLink className="ml-1 h-4 w-4" />
                    </Button>
                  </a>
                )}
                
                {service.isOurService && (
                  <Button 
                    onClick={() => window.location.href = "/cadastro"}
                    className="mt-auto w-full bg-green-600 hover:bg-green-700 text-white font-medium shadow-md hover:shadow-lg transition-all"
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
