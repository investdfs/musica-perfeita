
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import { Bell } from "lucide-react";

// Lista de nomes fictícios
const fakeNames = [
  "Ana Luíza", "Carlos Eduardo", "Mariana", "João Pedro", "Camila", 
  "Rafael", "Bianca", "Gabriel", "Juliana", "Thiago", "Fernanda", 
  "Lucas", "Amanda", "Felipe", "Larissa", "Bruno", "Natália"
];

// Lista de cidades
const fakeCities = [
  "São Paulo - SP", "Rio de Janeiro - RJ", "Belo Horizonte - MG",
  "Salvador - BA", "Fortaleza - CE", "Brasília - DF", "Curitiba - PR",
  "Recife - PE", "Porto Alegre - RS", "Manaus - AM", "Florianópolis - SC",
  "Goiânia - GO", "Natal - RN", "Campinas - SP", "Vitória - ES"
];

// Lista de ações
const fakeActions = [
  "acabou de encomendar uma música personalizada.",
  "enviou uma música para produção. :-)",
  "acabou de receber sua música personalizada!",
  "está ouvindo a demo da sua música.",
  "adorou a música que recebeu!",
  "presenteou alguém com uma música.",
  "está criando sua primeira música.",
  "fez um pedido de música romântica."
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
        </div>
      ),
      duration: 5000, // 5 segundos
      className: "fake-notification-toast",
      icon: <Bell className="h-5 w-5 text-blue-500" />
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
    
    // Tempo inicial antes da primeira notificação (3-7 segundos)
    const initialDelay = Math.floor(Math.random() * 4000) + 3000;
    
    const initialTimer = setTimeout(() => {
      showNotification();
      
      // Configurar o intervalo recorrente (5-15 segundos)
      const intervalId = setInterval(() => {
        const randomDelay = Math.floor(Math.random() * 10000) + 5000; // 5-15 segundos
        
        setTimeout(() => {
          showNotification();
        }, randomDelay);
      }, 15000); // Base interval
      
      return () => clearInterval(intervalId);
    }, initialDelay);
    
    return () => clearTimeout(initialTimer);
  }, [isLoggedIn, location.pathname]);
  
  return null; // Componente não renderiza nada visualmente
};

export default FakeNotifications;
