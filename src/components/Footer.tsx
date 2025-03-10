
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Globe, Lock, HelpCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value;
    
    // In a real application, this would send the email to a backend service
    toast({
      title: "Inscrição recebida!",
      description: `Obrigado por se inscrever com o email: ${email}`,
    });
    
    form.reset();
  };

  return (
    <footer className="bg-gray-100 text-gray-800 border-t border-gray-200">
      {/* Top section with newsletter */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center mb-8 pb-8 border-b border-gray-200">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800">Fique por dentro das novidades!</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Receba inspirações, dicas exclusivas e promoções especiais.
            </p>
          </div>
          <div>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
              <Input 
                type="email" 
                name="email"
                placeholder="Seu melhor e-mail" 
                className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-gray-400 w-full"
                required
              />
              <Button type="submit" className="bg-gray-800 hover:bg-gray-700 text-white whitespace-nowrap">
                Inscrever <HelpCircle className="h-4 w-4 ml-1" />
              </Button>
            </form>
          </div>
        </div>
        
        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* About column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/a-circular-logo-with-the-text-musica-per_lTHz7DfkRDyfkfvtzn6fig_aeKfBaktQAqReJjqARN5jQ-removebg-preview-1.png" 
                alt="Musicaperfeita Logo" 
                className="h-10"
              />
              <span className="text-xl font-bold text-gray-800">Musicaperfeita</span>
            </div>
            <p className="text-sm text-gray-600">
              Transformamos histórias de amor e carinho em canções únicas e emocionantes, criadas especialmente para momentos especiais.
            </p>
            <a 
              href="https://www.musicaperfeita.com.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium mt-2"
            >
              <Globe className="h-4 w-4 mr-1" />
              www.musicaperfeita.com.br
            </a>
          </div>
          
          {/* Links column */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">
                  Página Inicial
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-blue-600 hover:text-blue-800 transition-colors">
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link to="/cadastro" className="text-blue-600 hover:text-blue-800 transition-colors">
                  Cadastre-se
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-blue-600 hover:text-blue-800 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/nossas-musicas" className="text-blue-600 hover:text-blue-800 transition-colors">
                  Nossas Músicas
                </Link>
              </li>
              <li>
                <Link to="/depoimentos" className="text-blue-600 hover:text-blue-800 transition-colors">
                  Depoimentos
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact column */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <a 
                  href="https://wa.link/opvb86"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
                >
                  <MessageCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="inline-block">(32) 998847713 (WhatsApp)</span>
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 inline-block">contato.musicaperfeita@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 inline-block">Santos Dumont, MG - Brasil</span>
              </li>
            </ul>
          </div>
          
          {/* Social and cards column */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Siga-nos</h4>
            <div className="flex gap-3 mb-6">
              <a href="#" className="bg-pink-500 p-2 rounded-full hover:bg-pink-600 transition-colors">
                <Instagram className="h-5 w-5 text-white" />
              </a>
              <a href="#" className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors">
                <Facebook className="h-5 w-5 text-white" />
              </a>
              <a href="#" className="bg-blue-400 p-2 rounded-full hover:bg-blue-500 transition-colors">
                <Twitter className="h-5 w-5 text-white" />
              </a>
              <a href="#" className="bg-red-600 p-2 rounded-full hover:bg-red-700 transition-colors">
                <Youtube className="h-5 w-5 text-white" />
              </a>
            </div>
            
            <h4 className="text-lg font-semibold mb-2 text-gray-800">Formas de Pagamento</h4>
            <div className="mt-2">
              <img 
                src="https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/chamada-pix-mercado-pago__1_-removebg-preview.png" 
                alt="Formas de Pagamento" 
                className="h-12 object-contain"
              />
            </div>
          </div>
        </div>
        
        {/* Bottom copyright section */}
        <div className="pt-8 mt-8 border-t border-gray-200 text-center text-gray-600">
          <p>&copy; {currentYear} Musicaperfeita. Todos os direitos reservados.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm">
            <Link to="/termos-condicoes" className="text-blue-600 hover:text-blue-800">Termos de Uso</Link>
            <Link to="/politica-privacidade" className="text-blue-600 hover:text-blue-800">Política de Privacidade</Link>
            <Link to="/faq" className="text-blue-600 hover:text-blue-800 flex items-center">
              <HelpCircle className="h-3.5 w-3.5 mr-1" /> FAQ
            </Link>
          </div>
          <div className="mt-3 flex flex-col items-center">
            <a 
              href="https://www.musicaperfeita.com.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-amber-600 hover:text-amber-700 transition-colors font-medium"
            >
              Visite nosso site oficial: www.musicaperfeita.com.br
            </a>
            <Link 
              to="/admin-login"
              className="mt-2 inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Área de administração"
            >
              <Lock className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
