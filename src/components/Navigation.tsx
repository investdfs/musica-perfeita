
import { Home, UserPlus, Info, LogIn } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navigation = ({ className }: { className?: string }) => {
  const location = useLocation();
  
  // Helper function to determine if a link is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={cn("flex items-center space-x-6", className)}>
      <Link 
        to="/" 
        className={cn(
          "flex items-center gap-1 transition-colors",
          isActive("/") 
            ? "text-primary font-medium" 
            : "hover:text-primary/80"
        )}
      >
        <Home className="h-4 w-4" />
        <span>Home</span>
      </Link>
      <Link 
        to="/cadastro" 
        className={cn(
          "flex items-center gap-1 transition-colors",
          isActive("/cadastro") 
            ? "text-primary font-medium" 
            : "hover:text-primary/80"
        )}
      >
        <UserPlus className="h-4 w-4" />
        <span>Cadastro</span>
      </Link>
      <Link 
        to="/login" 
        className={cn(
          "flex items-center gap-1 transition-colors",
          isActive("/login") 
            ? "text-primary font-medium" 
            : "hover:text-primary/80"
        )}
      >
        <LogIn className="h-4 w-4" />
        <span>Login</span>
      </Link>
      <Link 
        to="/sobre" 
        className={cn(
          "flex items-center gap-1 transition-colors",
          isActive("/sobre") 
            ? "text-primary font-medium" 
            : "hover:text-primary/80"
        )}
      >
        <Info className="h-4 w-4" />
        <span>Sobre o Projeto</span>
      </Link>
    </nav>
  );
};

export default Navigation;
