
import { useEffect, useState } from 'react';

const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState<number>(5);

  useEffect(() => {
    // Inicializa com um número aleatório entre 2 e 13
    setVisitorCount(Math.floor(Math.random() * 11) + 2);

    // Atualiza o contador a cada 30-45 segundos
    const interval = setInterval(() => {
      // Gera um número aleatório entre 2 e 13
      const randomCount = Math.floor(Math.random() * 11) + 2;
      setVisitorCount(randomCount);
    }, 30000 + Math.random() * 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-xs text-gray-500 flex items-center">
      <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
      <span>{visitorCount} visitantes online agora</span>
    </div>
  );
};

export default VisitorCounter;
