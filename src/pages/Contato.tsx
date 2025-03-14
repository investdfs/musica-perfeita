
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const Contato = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulando envio do formulário
    setTimeout(() => {
      toast({
        title: "Mensagem enviada!",
        description: "Agradecemos seu contato. Responderemos em breve.",
      });
      setIsSubmitting(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-purple-800">Entre em Contato</h1>
          
          <div className="grid md:grid-cols-2 gap-10 bg-white p-8 rounded-lg shadow-sm">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Fale Conosco</h2>
              <p className="text-gray-600 mb-6">
                Tem alguma dúvida sobre nossos serviços ou precisa de ajuda? Entre em contato conosco
                e teremos o prazer em ajudar.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Assunto
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Informações de Contato</h2>
              
              <div className="space-y-6 mt-8">
                <div className="flex items-start">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">E-mail</h3>
                    <p className="text-gray-600">contato.musicaperfeita@gmail.com</p>
                    <p className="text-gray-500 text-sm mt-1">Responderemos em até 24 horas em dias úteis</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">WhatsApp</h3>
                    <p className="text-gray-600">(32) 99884-7713</p>
                    <p className="text-gray-500 text-sm mt-1">Disponível de segunda a sexta, das 9h às 18h</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Localização</h3>
                    <p className="text-gray-600">Minas Gerais, Brasil</p>
                    <p className="text-gray-500 text-sm mt-1">Atendemos todo o Brasil</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 bg-purple-50 p-6 rounded-lg">
                <h3 className="font-medium text-lg text-purple-800 mb-3">Horário de Atendimento</h3>
                <p className="text-gray-700">
                  Nossa equipe está disponível para atendimento de segunda a sexta-feira, das 9h às 18h.
                  Responderemos todas as mensagens o mais rápido possível.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contato;
