
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import { Bell } from "lucide-react";

// Lista ampliada de nomes fictícios
const fakeNames = [
  "Ana Luíza", "Carlos Eduardo", "Mariana", "João Pedro", "Camila", 
  "Rafael", "Bianca", "Gabriel", "Juliana", "Thiago", "Fernanda", 
  "Lucas", "Amanda", "Felipe", "Larissa", "Bruno", "Natália",
  "Ricardo", "Patrícia", "Alexandre", "Isabela", "Gustavo", "Daniela",
  "Leonardo", "Marcela", "Henrique", "Beatriz", "Rodrigo", "Aline",
  "Fernando", "Júlia", "Renato", "Carla", "André", "Viviane", "Diego",
  "Priscila", "Paulo", "Sandra", "Eduardo", "Vanessa", "Luciano", 
  "Tatiana", "Roberto", "Cristina", "Marcos", "Fabiana", "Sérgio",
  "Adriana", "Fábio", "Letícia", "Vitor", "Carolina", "José", "Regina"
];

// Lista ampliada de cidades
const fakeCities = [
  "São Paulo - SP", "Rio de Janeiro - RJ", "Belo Horizonte - MG",
  "Salvador - BA", "Fortaleza - CE", "Brasília - DF", "Curitiba - PR",
  "Recife - PE", "Porto Alegre - RS", "Manaus - AM", "Florianópolis - SC",
  "Goiânia - GO", "Natal - RN", "Campinas - SP", "Vitória - ES",
  "Belém - PA", "São Luís - MA", "João Pessoa - PB", "Campo Grande - MS",
  "Teresina - PI", "Aracaju - SE", "Ribeirão Preto - SP", "Uberlândia - MG",
  "Sorocaba - SP", "Londrina - PR", "Joinville - SC", "Niterói - RJ",
  "Santos - SP", "Juiz de Fora - MG", "Maringá - PR", "Caxias do Sul - RS",
  "Maceió - AL", "Bauru - SP", "São José dos Campos - SP", "Pelotas - RS",
  "Foz do Iguaçu - PR", "Blumenau - SC", "Jundiaí - SP", "Franca - SP",
  "Palmas - TO", "Petrópolis - RJ", "Uberaba - MG", "Caruaru - PE",
  "Divinópolis - MG", "Governador Valadares - MG", "Volta Redonda - RJ",
  "Ipatinga - MG", "Santa Maria - RS", "Mossoró - RN", "Anápolis - GO"
];

// Lista ampliada de ações
const fakeActions = [
  "acabou de encomendar uma música personalizada.",
  "enviou uma música para produção. :-)",
  "acabou de receber sua música personalizada!",
  "está ouvindo a demo da sua música.",
  "adorou a música que recebeu!",
  "presenteou alguém com uma música.",
  "está criando sua primeira música.",
  "fez um pedido de música romântica.",
  "escolheu uma música no estilo sertanejo.",
  "está escrevendo uma história emocionante para sua música.",
  "selecionou a voz feminina para sua composição.",
  "optou por um tom alegre para sua música.",
  "comemorou aniversário de casamento com uma música personalizada.",
  "surpreendeu os pais com uma canção especial.",
  "está aguardando a finalização de sua música com ansiedade.",
  "compartilhou sua música nas redes sociais.",
  "escolheu o gênero MPB para sua composição.",
  "adicionou fotos especiais na capa de sua música.",
  "presenteou o(a) filho(a) com uma música de aniversário.",
  "fez um pedido para comemorar bodas de prata.",
  "está feliz com a composição recebida!",
  "está escolhendo entre voz masculina ou feminina.",
  "recomendou nosso serviço para amigos.",
  "declarou seu amor através de uma música personalizada.",
  "pediu uma música para seu casamento.",
  "emocionou-se ao ouvir sua composição pela primeira vez.",
  "acaba de finalizar seu pagamento.",
  "está decidindo qual história contar em sua música.",
  "fez uma homenagem musical para sua mãe."
];

const FakeNotifications = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [isActive, setIsActive] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Verificar se o usuário está logado
  const isLoggedIn = localStorage.getItem("musicaperfeita_user") !== null;
  
  // Criar referência de áudio
  useEffect(() => {
    audioRef.current = new Audio("/notification-sound.mp3");
    audioRef.current.volume = 0.2; // Volume baixo (20%)
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  const showNotification = () => {
    if (!isActive || isLoggedIn) return;
    
    const randomName = fakeNames[Math.floor(Math.random() * fakeNames.length)];
    const randomCity = fakeCities[Math.floor(Math.random() * fakeCities.length)];
    const randomAction = fakeActions[Math.floor(Math.random() * fakeActions.length)];
    
    // Reproduzir som
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.error("Erro ao reproduzir som:", err));
    }
    
    // Mostrar notificação
    toast({
      title: `${randomName}`,
      description: (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">{randomCity}</p>
          <p>{randomAction}</p>
          <div className="mt-2">
            <Bell className="h-5 w-5 text-blue-500 inline-block mr-2" />
          </div>
        </div>
      ),
      duration: 5000, // 5 segundos
      className: "fake-notification-toast"
    });
  };
  
  useEffect(() => {
    // Apenas mostrar notificações se o usuário não estiver logado
    if (isLoggedIn) return;
    
    // Não mostrar notificações em algumas páginas
    const excludedPaths = ['/login', '/cadastro', '/admin-login'];
    if (excludedPaths.includes(location.pathname)) {
      setIsActive(false);
      return;
    } else {
      setIsActive(true);
    }
    
    // Tempo inicial antes da primeira notificação (5-15 segundos)
    const initialDelay = Math.floor(Math.random() * 10000) + 5000;
    
    const initialTimer = setTimeout(() => {
      showNotification();
      
      // Configurar o intervalo recorrente com mais tempo entre notificações (15-30 segundos)
      const intervalId = setInterval(() => {
        const randomDelay = Math.floor(Math.random() * 15000) + 15000; // 15-30 segundos
        
        setTimeout(() => {
          showNotification();
        }, randomDelay);
      }, 30000); // Base interval aumentado para 30 segundos
      
      return () => clearInterval(intervalId);
    }, initialDelay);
    
    return () => clearTimeout(initialTimer);
  }, [isLoggedIn, location.pathname]);
  
  return null; // Componente não renderiza nada visualmente
};

export default FakeNotifications;
