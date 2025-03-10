
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone, ArrowRight, Globe, Lock } from "lucide-react";
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
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      {/* Top section with newsletter */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center mb-8 pb-8 border-b border-white/10">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Fique por dentro das novidades!</h3>
            <p className="text-white/80 text-sm sm:text-base">
              Receba inspirações, dicas exclusivas e promoções especiais.
            </p>
          </div>
          <div>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
              <Input 
                type="email" 
                name="email"
                placeholder="Seu melhor e-mail" 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white w-full"
                required
              />
              <Button type="submit" className="bg-gray-700 hover:bg-gray-600 text-white whitespace-nowrap">
                Inscrever <ArrowRight className="h-4 w-4 ml-1" />
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
              <span className="text-xl font-bold">Musicaperfeita</span>
            </div>
            <p className="text-sm text-white/80">
              Transformamos histórias de amor e carinho em canções únicas e emocionantes, criadas especialmente para momentos especiais.
            </p>
            <a 
              href="https://www.musicaperfeita.com.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-gray-300 hover:text-gray-100 transition-colors font-medium mt-2"
            >
              <Globe className="h-4 w-4 mr-1" />
              www.musicaperfeita.com.br
            </a>
          </div>
          
          {/* Links column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/70 hover:text-white transition-colors">
                  Página Inicial
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-white/70 hover:text-white transition-colors">
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link to="/cadastro" className="text-white/70 hover:text-white transition-colors">
                  Cadastre-se
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-white/70 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/nossas-musicas" className="text-white/70 hover:text-white transition-colors">
                  Nossas Músicas
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                <span className="text-white/70">(32) 998847713 (somente WhatsApp)</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <span className="text-white/70 break-all">contato.musicaperfeita@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <span className="text-white/70">São Paulo, SP - Brasil</span>
              </li>
            </ul>
          </div>
          
          {/* Social and cards column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Siga-nos</h4>
            <div className="flex gap-3 mb-6">
              <a href="#" className="bg-white/5 p-2 rounded-full hover:bg-white/10 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/5 p-2 rounded-full hover:bg-white/10 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/5 p-2 rounded-full hover:bg-white/10 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/5 p-2 rounded-full hover:bg-white/10 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            
            <h4 className="text-lg font-semibold mb-2">Formas de Pagamento</h4>
            <div className="grid grid-cols-3 gap-1">
              <Card className="p-1 bg-white/5 border-white/5">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 object-contain mx-auto" />
              </Card>
              <Card className="p-1 bg-white/5 border-white/5">
                <img src="https://logodownload.org/wp-content/uploads/2016/10/visa-logo.png" alt="Visa" className="h-6 object-contain mx-auto" />
              </Card>
              <Card className="p-1 bg-white/5 border-white/5">
                <img src="https://logodownload.org/wp-content/uploads/2018/09/mercado-pago-logo.png" alt="Mercado Pago" className="h-6 object-contain mx-auto" />
              </Card>
            </div>
          </div>
        </div>
        
        {/* Bottom copyright section */}
        <div className="pt-8 mt-8 border-t border-white/10 text-center text-white/60">
          <p>&copy; {currentYear} Musicaperfeita. Todos os direitos reservados.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm">
            <Link to="#" className="hover:text-white">Termos de Uso</Link>
            <Link to="#" className="hover:text-white">Política de Privacidade</Link>
            <Link to="#" className="hover:text-white">FAQ</Link>
          </div>
          <div className="mt-3 flex flex-col items-center">
            <a 
              href="https://www.musicaperfeita.com.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
            >
              Visite nosso site oficial: www.musicaperfeita.com.br
            </a>
            <Link 
              to="/admin-login"
              className="mt-2 inline-flex items-center text-gray-500 hover:text-gray-300 transition-colors"
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
