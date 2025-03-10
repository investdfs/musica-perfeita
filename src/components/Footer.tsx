
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-xl font-semibold mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-indigo-400 mr-2" />
                <a href="https://wa.me/5532998414247" className="text-blue-400 hover:text-blue-300" target="_blank" rel="noopener noreferrer">
                  (32) 99841-4247
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-indigo-400 mr-2" />
                <a href="mailto:contato@musicaperfeita.com.br" className="text-blue-400 hover:text-blue-300">
                  contato@musicaperfeita.com.br
                </a>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-xl font-semibold mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-blue-400 hover:text-blue-300">
                  Página Inicial
                </Link>
              </li>
              <li>
                <Link to="/como-funciona" className="text-blue-400 hover:text-blue-300">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link to="/depoimentos" className="text-blue-400 hover:text-blue-300">
                  Depoimentos
                </Link>
              </li>
              <li>
                <Link to="/precos" className="text-blue-400 hover:text-blue-300">
                  Preços
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-xl font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/termos-de-uso" className="text-blue-400 hover:text-blue-300">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/politica-de-privacidade" className="text-blue-400 hover:text-blue-300">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-xl font-semibold mb-4">Siga-nos</h3>
            <div className="flex space-x-4 mb-6">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                <Facebook className="h-6 w-6 text-indigo-400 hover:text-indigo-300" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                <Instagram className="h-6 w-6 text-indigo-400 hover:text-indigo-300" />
              </a>
            </div>
            
            <h3 className="text-xl font-semibold mb-4">Formas de Pagamento</h3>
            <img 
              src="https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/chamada-pix-mercado-pago__1_-removebg-preview.png" 
              alt="Formas de Pagamento" 
              className="h-12"
            />
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p>
            &copy; {new Date().getFullYear()} Música Perfeita | Santos Dumont-MG | Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
