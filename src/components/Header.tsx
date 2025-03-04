
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
        <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-green-400 bg-clip-text text-transparent">
          Musicaperfeita
        </span>
      </div>
      <Navigation />
    </header>
  );
};

export default Header;
