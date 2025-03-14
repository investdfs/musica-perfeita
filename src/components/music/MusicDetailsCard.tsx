
import { Music, Clock, Heart, AlertTriangle, User, Mic, Sparkles, Music2, BookOpen, Tag, Bookmark, Hash } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { MusicRequest } from "@/types/database.types";
import { formatDate } from "@/lib/utils";

interface MusicDetailsCardProps {
  requestData: MusicRequest | null;
}

const MusicDetailsCard = ({ requestData }: MusicDetailsCardProps) => {
  // Se não houver dados do pedido, mostra uma versão simplificada do card
  if (!requestData) {
    return (
      <Card className="bg-gray-800/95 shadow-lg rounded-xl border border-gray-700 mb-8">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Music className="h-5 w-5 text-indigo-400 mr-2" />
              <CardTitle className="text-xl font-semibold text-gray-200">Detalhes da Música</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-yellow-500/20 px-3 py-1 rounded-full">
                <AlertTriangle className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-xs font-medium text-yellow-300">Prévia Limitada</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900/90 p-4 rounded-lg border border-gray-700">
            <h3 className="text-lg font-medium text-gray-200 mb-3">Instruções</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              <li>Esta é apenas uma prévia limitada a 40 segundos da sua música.</li>
              <li>Para acessar a versão completa, faça o pagamento.</li>
              <li>A música foi criada exclusivamente para você.</li>
              <li>Após o pagamento, você poderá baixar a música em alta qualidade.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const isPaid = requestData.payment_status === 'completed';
  
  return (
    <Card className="bg-gray-800/95 shadow-lg rounded-xl border border-gray-700 mb-8">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Music className="h-5 w-5 text-indigo-400 mr-2" />
            <CardTitle className="text-xl font-semibold text-gray-200">Detalhes da Música</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {requestData.order_number && (
              <div className="flex items-center bg-blue-500/20 px-3 py-1 rounded-full">
                <Hash className="h-4 w-4 text-blue-300 mr-1" />
                <span className="text-xs font-medium text-blue-200">{requestData.order_number}</span>
              </div>
            )}
            {!isPaid && (
              <div className="flex items-center bg-yellow-500/20 px-3 py-1 rounded-full">
                <AlertTriangle className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-xs font-medium text-yellow-300">Prévia Limitada</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Imagem de capa, se disponível */}
        {requestData.cover_image_url && (
          <div className="mb-4 rounded-lg overflow-hidden border border-gray-700 max-h-48">
            <img 
              src={requestData.cover_image_url} 
              alt="Imagem de capa" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg border border-gray-700 bg-gray-900/90">
            <div className="flex items-center mb-2">
              <Heart className="h-4 w-4 text-indigo-400 mr-2" />
              <p className="text-sm text-gray-400">Criada para</p>
            </div>
            <p className="text-gray-200 font-medium">{requestData.honoree_name || "Você"}</p>
          </div>
          
          <div className="bg-gray-900/90 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center mb-2">
              <User className="h-4 w-4 text-indigo-400 mr-2" />
              <p className="text-sm text-gray-400">Relacionamento</p>
            </div>
            <p className="text-gray-200 font-medium">
              {requestData.relationship_type === 'other' 
                ? requestData.custom_relationship 
                : requestData.relationship_type || "Não especificado"}
            </p>
          </div>
          
          <div className="bg-gray-900/90 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center mb-2">
              <Music2 className="h-4 w-4 text-indigo-400 mr-2" />
              <p className="text-sm text-gray-400">Gênero Musical</p>
            </div>
            <p className="text-gray-200 font-medium">
              {requestData.music_genre || "Não especificado"}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg border border-gray-700 bg-gray-900/90">
            <div className="flex items-center mb-2">
              <Mic className="h-4 w-4 text-indigo-400 mr-2" />
              <p className="text-sm text-gray-400">Voz</p>
            </div>
            <p className="text-gray-200 font-medium">{requestData.voice_type || "Padrão"}</p>
          </div>
          
          <div className="bg-gray-900/90 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center mb-2">
              <Sparkles className="h-4 w-4 text-indigo-400 mr-2" />
              <p className="text-sm text-gray-400">Tom da Música</p>
            </div>
            <p className="text-gray-200 font-medium">
              {requestData.music_tone || "Não especificado"}
            </p>
          </div>
          
          <div className="bg-gray-900/90 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center mb-2">
              <Clock className="h-4 w-4 text-indigo-400 mr-2" />
              <p className="text-sm text-gray-400">Duração</p>
            </div>
            <p className="text-gray-200 font-medium">
              {isPaid ? "Versão completa" : "Prévia de 40 segundos"}
            </p>
          </div>
        </div>
        
        {requestData.story && (
          <div className="bg-gray-900/90 p-4 rounded-lg border border-gray-700 mb-6">
            <div className="flex items-center mb-2">
              <BookOpen className="h-4 w-4 text-indigo-400 mr-2" />
              <p className="text-sm text-gray-400">Sua História</p>
            </div>
            <p className="text-gray-200 text-sm italic">
              "{requestData.story}"
            </p>
          </div>
        )}
        
        {requestData.include_names && requestData.names_to_include && (
          <div className="bg-gray-900/90 p-4 rounded-lg border border-gray-700 mb-6">
            <div className="flex items-center mb-2">
              <Tag className="h-4 w-4 text-indigo-400 mr-2" />
              <p className="text-sm text-gray-400">Nomes Incluídos</p>
            </div>
            <p className="text-gray-200 font-medium">{requestData.names_to_include}</p>
          </div>
        )}
        
        {(requestData.music_focus || requestData.happy_memory || requestData.sad_memory) && (
          <div className="bg-gray-900/90 p-4 rounded-lg border border-gray-700 mb-6">
            <div className="flex items-center mb-3">
              <Bookmark className="h-4 w-4 text-indigo-400 mr-2" />
              <p className="text-sm text-gray-400">Detalhes Adicionais</p>
            </div>
            
            {requestData.music_focus && (
              <div className="mb-3">
                <p className="text-xs text-indigo-300 mb-1">Foco da Música:</p>
                <p className="text-gray-300 text-sm">{requestData.music_focus}</p>
              </div>
            )}
            
            {requestData.happy_memory && (
              <div className="mb-3">
                <p className="text-xs text-indigo-300 mb-1">Memória Feliz:</p>
                <p className="text-gray-300 text-sm">{requestData.happy_memory}</p>
              </div>
            )}
            
            {requestData.sad_memory && (
              <div>
                <p className="text-xs text-indigo-300 mb-1">Memória Triste:</p>
                <p className="text-gray-300 text-sm">{requestData.sad_memory}</p>
              </div>
            )}
          </div>
        )}
        
        <div className="bg-gray-900/90 p-4 rounded-lg border border-gray-700">
          <h3 className="text-lg font-medium text-gray-200 mb-3">
            {isPaid ? "Informações da Música" : "Instruções"}
          </h3>
          {isPaid ? (
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              <li>Sua música já está disponível em versão completa e alta qualidade.</li>
              <li>Você pode baixar, compartilhar e usar sua música como desejar.</li>
              <li>A música foi criada exclusivamente para você, com base nas informações fornecidas.</li>
              <li>Para qualquer dúvida ou ajuste, entre em contato com nosso suporte.</li>
            </ul>
          ) : (
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              <li>Esta é apenas uma prévia limitada a 40 segundos da sua música.</li>
              <li>Para acessar a versão completa, faça o pagamento.</li>
              <li>A música foi criada exclusivamente para você, com base nas informações que você forneceu.</li>
              <li>Após o pagamento, você poderá baixar a música em alta qualidade.</li>
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicDetailsCard;
