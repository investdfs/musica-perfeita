
import { Link, useNavigate } from "react-router-dom";
import Navigation from "./Navigation";

const Header = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <header className="w-full py-4 px-6 flex items-center justify-between bg-white shadow-sm sticky top-0 z-10">
      <div 
        onClick={handleLogoClick}
        className="flex items-center cursor-pointer"
      >
        <img 
          src="https://wp.novaenergiamg.com.br/wp-content/uploads/2025/03/a-circular-logo-with-the-text-musica-per_lTHz7DfkRDyfkfvtzn6fig_aeKfBaktQAqReJjqARN5jQ-removebg-preview-1.png" 
          alt="Musicaperfeita Logo" 
          className="h-10 mr-2"
        />
        <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-green-400 bg-clip-text text-transparent">
          Musicaperfeita
        </span>
      </div>
      <Navigation />
    </header>
  );
};

export default Header;
