
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MusicPreviewPlayerProps {
  previewUrl: string;
  fullSongUrl: string | null;
  isCompleted: boolean;
}

const MusicPreviewPlayer = ({ previewUrl, fullSongUrl, isCompleted }: MusicPreviewPlayerProps) => {
  const navigate = useNavigate();

  const handleDownload = () => {
    if (!isCompleted || !fullSongUrl) {
      toast({
        title: "Música não disponível",
        description: "A versão completa da música ainda não está disponível para download.",
        variant: "destructive",
      });
      return;
    }
    
    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = fullSongUrl;
    link.download = "sua_musica_perfeita.mp3";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download iniciado",
      description: "Sua música está sendo baixada."
    });
  };

  const handleShare = () => {
    if (!isCompleted || !previewUrl) {
      toast({
        title: "Compartilhamento não disponível",
        description: "A prévia da música ainda não está disponível para compartilhamento.",
        variant: "destructive",
      });
      return;
    }
    
    // If Web Share API is available
    if (navigator.share) {
      navigator.share({
        title: 'Minha Música Perfeita',
        text: 'Ouça a música que foi criada especialmente para mim!',
        url: window.location.href,
      })
      .then(() => {
        toast({
          title: "Compartilhado com sucesso",
          description: "Sua música foi compartilhada!"
        });
      })
      .catch((error) => {
        console.error('Erro ao compartilhar:', error);
        toast({
          title: "Erro ao compartilhar",
          description: "Não foi possível compartilhar sua música.",
          variant: "destructive",
        });
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copiado",
        description: "Link da sua música copiado para a área de transferência."
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Ouça 1/3 da sua música!</h2>
      <audio controls className="w-full mb-4" disabled={!isCompleted}>
        <source src={previewUrl} type="audio/mpeg" />
        Seu navegador não suporta áudio HTML5.
      </audio>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <Button 
          className="flex-1 bg-pink-500 hover:bg-pink-600" 
          onClick={() => navigate("/pagamento")}
          disabled={!isCompleted}
        >
          Pagar Agora
        </Button>
        
        <Button 
          variant="outline" 
          className="flex-1 border-purple-500 text-purple-700 hover:bg-purple-50"
          onClick={handleDownload}
          disabled={!isCompleted || !fullSongUrl}
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        
        <Button 
          variant="outline"
          className="flex-1 border-indigo-500 text-indigo-700 hover:bg-indigo-50"
          onClick={handleShare}
          disabled={!isCompleted}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Compartilhar
        </Button>
      </div>
      
      {!isCompleted && (
        <p className="text-gray-500 text-sm text-center mt-4">
          Os botões serão habilitados quando a música estiver pronta.
        </p>
      )}
    </div>
  );
};

export default MusicPreviewPlayer;
