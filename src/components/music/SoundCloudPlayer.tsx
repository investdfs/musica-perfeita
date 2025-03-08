
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface SoundCloudPlayerProps {
  musicUrl: string;
  downloadUrl?: string;
  limitPlayTime?: boolean;
  playTimeLimit?: number;
}

declare global {
  interface Window {
    SC: {
      Widget: (iframe: HTMLIFrameElement) => {
        bind: (event: string, callback: () => void) => void;
        pause: () => void;
        play: () => void;
      };
      Widget: {
        Events: {
          PLAY: string;
          PAUSE: string;
          FINISH: string;
        };
      };
    };
  }
}

const SoundCloudPlayer = ({
  musicUrl,
  downloadUrl,
  limitPlayTime = false,
  playTimeLimit = 30000
}: SoundCloudPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Verificar se a API do SoundCloud foi carregada
    const checkSCLoaded = () => {
      if (window.SC && iframeRef.current) {
        setIsReady(true);
        setupPlayer();
      } else {
        setTimeout(checkSCLoaded, 500);
      }
    };

    checkSCLoaded();

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const setupPlayer = () => {
    if (!iframeRef.current || !window.SC) return;

    const widget = window.SC.Widget(iframeRef.current);

    widget.bind(window.SC.Widget.Events.PLAY, () => {
      console.log("Música começou a tocar");
      setIsPlaying(true);
      
      // Se limitPlayTime for true, configurar o timeout para pausar após o tempo definido
      if (limitPlayTime && playTimeLimit) {
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = window.setTimeout(() => {
          widget.pause();
          console.log(`Música pausada após ${playTimeLimit/1000} segundos`);
        }, playTimeLimit);
      }
    });

    widget.bind(window.SC.Widget.Events.PAUSE, () => {
      console.log("Música pausada");
      setIsPlaying(false);
      
      // Limpar o timeout se a música for pausada manualmente
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    });

    widget.bind(window.SC.Widget.Events.FINISH, () => {
      console.log("Música finalizada");
      setIsPlaying(false);
      
      // Limpar o timeout se a música terminar
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    });
  };

  const embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(musicUrl)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`;

  return (
    <div className="flex flex-col items-center space-y-4 max-w-2xl mx-auto">
      <div className="w-full border-4 border-pink-500 rounded-lg overflow-hidden shadow-lg">
        <iframe
          ref={iframeRef}
          title="SoundCloud Player"
          width="100%"
          height="300"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={embedUrl}
          className="bg-white"
        ></iframe>
      </div>
      
      {limitPlayTime && (
        <div className="text-center text-indigo-600 bg-indigo-100 p-2 rounded-md w-full">
          <p>Esta é uma prévia limitada a 30 segundos.</p>
        </div>
      )}
      
      {downloadUrl && (
        <Button 
          onClick={() => window.open(downloadUrl, '_blank')}
          className="bg-pink-500 hover:bg-pink-600 flex items-center gap-2 px-6 py-2.5"
        >
          <Download className="h-5 w-5" />
          Baixar Música Completa
        </Button>
      )}
    </div>
  );
};

export default SoundCloudPlayer;
