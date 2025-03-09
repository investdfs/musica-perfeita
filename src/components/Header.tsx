
import { Link, useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useTheme } from "./theme/ThemeProvider";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <header className={`w-full py-3 px-4 sm:py-4 sm:px-6 flex items-center justify-between ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-sm sticky top-0 z-50`}>
      <div 
        onClick={handleLogoClick}
        className="flex items-center cursor-pointer"
      >
        <img 
          src="https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/a-circular-logo-with-the-text-musica-per_lTHz7DfkRDyfkfvtzn6fig_aeKfBaktQAqReJjqARN5jQ-removebg-preview-1.png" 
          alt="Musicaperfeita Logo" 
          className="h-8 sm:h-10 mr-2"
        />
        <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-green-400 bg-clip-text text-transparent">
          Música Perfeita
        </span>
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <Navigation />
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="px-2">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="pt-10">
            <div className="flex flex-col space-y-4">
              <Navigation className="flex-col items-start space-y-6 space-x-0" />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
