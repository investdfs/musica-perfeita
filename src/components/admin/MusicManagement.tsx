import { useState, useEffect } from "react";
import { Music } from "@/types/music";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Music2, Plus, Trash2, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";

const MusicManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [musicList, setMusicList] = useState<Music[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    artist: "Música Perfeita",
    genre: "",
    duration: 180,
    coverUrl: "",
    audioUrl: "",
  });
  
  const fetchMusicList = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('music_catalog')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        setMusicList(data as Music[]);
      }
    } catch (error) {
      console.error("Erro ao carregar músicas:", error);
      toast({
        title: "Erro ao carregar músicas",
        description: "Não foi possível carregar a lista de músicas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMusicList();
    
    const musicChannel = supabase
      .channel('admin_music_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'music_catalog' 
      }, () => {
        console.log('Music catalog changed, refreshing admin list...');
        fetchMusicList();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(musicChannel);
    };
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [minutes, seconds] = e.target.value.split(':').map(Number);
    const totalSeconds = (minutes * 60) + (seconds || 0);
    setFormData(prev => ({ ...prev, duration: totalSeconds }));
  };
  
  const resetForm = () => {
    setFormData({
      title: "",
      artist: "Música Perfeita",
      genre: "",
      duration: 180,
      coverUrl: "",
      audioUrl: "",
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.genre || !formData.coverUrl || !formData.audioUrl) {
      toast({
        title: "Formulário incompleto",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('music_catalog')
        .insert([
          {
            title: formData.title,
            artist: formData.artist,
            genre: formData.genre,
            duration: formData.duration,
            coverUrl: formData.coverUrl,
            audioUrl: formData.audioUrl,
            plays: 0,
          }
        ])
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Música adicionada",
        description: "A música foi adicionada com sucesso ao catálogo",
      });
      
      resetForm();
      setShowAddForm(false);
    } catch (error) {
      console.error("Erro ao adicionar música:", error);
      toast({
        title: "Erro ao adicionar música",
        description: "Não foi possível adicionar a música ao catálogo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta música?")) return;
    
    try {
      const { error } = await supabase
        .from('music_catalog')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Música excluída",
        description: "A música foi removida do catálogo",
      });
      
      setMusicList(prev => prev.filter(music => music.id !== id));
    } catch (error) {
      console.error("Erro ao excluir música:", error);
      toast({
        title: "Erro ao excluir música",
        description: "Não foi possível remover a música do catálogo",
        variant: "destructive",
      });
    }
  };
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const openMusicPage = () => {
    window.open('/nossas-musicas', '_blank');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gerenciar Músicas</h2>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
          >
            {showAddForm ? "Cancelar" : <>
              <Plus className="h-4 w-4 mr-1" />
              Nova Música
            </>}
          </Button>
          
          <Button
            variant="outline"
            onClick={openMusicPage}
            className="flex items-center gap-1"
          >
            <ExternalLink className="h-4 w-4" />
            Ver Página
          </Button>
        </div>
      </div>
      
      {showAddForm && (
        <div className="rounded-lg border p-4 shadow-sm bg-white">
          <h3 className="text-lg font-medium mb-4">Adicionar Nova Música</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Música</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ex: Declaração de Amor"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="artist">Artista</Label>
                <Input
                  id="artist"
                  name="artist"
                  value={formData.artist}
                  onChange={handleInputChange}
                  placeholder="Ex: Música Perfeita"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="genre">Gênero</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("genre", value)}
                  value={formData.genre}
                >
                  <SelectTrigger id="genre">
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Romântica">Romântica</SelectItem>
                    <SelectItem value="Celebração">Celebração</SelectItem>
                    <SelectItem value="Aniversário">Aniversário</SelectItem>
                    <SelectItem value="Casamento">Casamento</SelectItem>
                    <SelectItem value="Amizade">Amizade</SelectItem>
                    <SelectItem value="Motivacional">Motivacional</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duração (minutos:segundos)</Label>
                <Input
                  id="duration"
                  name="duration"
                  placeholder="Ex: 3:30"
                  value={formatDuration(formData.duration)}
                  onChange={handleDurationChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="coverUrl">URL da Capa</Label>
                <Input
                  id="coverUrl"
                  name="coverUrl"
                  value={formData.coverUrl}
                  onChange={handleInputChange}
                  placeholder="https://exemplo.com/imagem.jpg"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="audioUrl">URL do Áudio</Label>
                <Input
                  id="audioUrl"
                  name="audioUrl"
                  value={formData.audioUrl}
                  onChange={handleInputChange}
                  placeholder="https://exemplo.com/audio.mp3"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adicionando...
                  </>
                ) : (
                  <>Adicionar Música</>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
      
      <div className="rounded-lg border shadow-sm bg-white overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-medium">Lista de Músicas</h3>
        </div>
        
        {isLoading && musicList.length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : musicList.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
            <Music2 className="h-12 w-12 mb-2 opacity-30" />
            <p>Nenhuma música no catálogo</p>
            <p className="text-sm mt-1">Adicione sua primeira música usando o botão acima</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Título</th>
                  <th className="px-6 py-3">Artista</th>
                  <th className="px-6 py-3">Gênero</th>
                  <th className="px-6 py-3">Duração</th>
                  <th className="px-6 py-3">Plays</th>
                  <th className="px-6 py-3">Data de Adição</th>
                  <th className="px-6 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {musicList.map((music) => (
                  <tr key={music.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={music.coverUrl} 
                          alt={music.title}
                          className="h-8 w-8 rounded-sm mr-3"
                        />
                        <span className="text-sm font-medium text-gray-900">{music.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {music.artist}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {music.genre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDuration(music.duration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {music.plays}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {music.created_at ? new Date(music.created_at).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(music.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicManagement;
