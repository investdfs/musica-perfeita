
import { Link } from "react-router-dom";
import Navigation from "./Navigation";

const Header = () => {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between bg-white shadow-sm">
      <Link to="/" className="flex items-center">
        <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-green-400 bg-clip-text text-transparent">
          Musicaperfeita
        </span>
      </Link>
      <Navigation />
    </header>
  );
};

export default Header;
