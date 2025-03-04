
import { Home, UserPlus, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navigation = ({ className }: { className?: string }) => {
  return (
    <nav className={cn("flex items-center space-x-6", className)}>
      <Link to="/" className="flex items-center gap-1 hover:text-primary/80 transition-colors">
        <Home className="h-4 w-4" />
        <span>Home</span>
      </Link>
      <Link to="/cadastro" className="flex items-center gap-1 hover:text-primary/80 transition-colors">
        <UserPlus className="h-4 w-4" />
        <span>Cadastro</span>
      </Link>
      <Link to="/sobre" className="flex items-center gap-1 hover:text-primary/80 transition-colors">
        <Info className="h-4 w-4" />
        <span>Sobre o Projeto</span>
      </Link>
    </nav>
  );
};

export default Navigation;
