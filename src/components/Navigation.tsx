
import { Home, UserPlus, Info, LogIn, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const Navigation = ({ className }: { className?: string }) => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Helper function to determine if a link is active
  const isActive = (path: string) => location.pathname === path;

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("musicaperfeita_user");
    setIsLoggedIn(!!storedUser);
  }, [location.pathname]); // Re-check when route changes

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("musicaperfeita_user");
    window.location.href = "/"; // Redirect to home after logout
  };

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
      
      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 transition-colors text-red-600 hover:text-red-800"
        >
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </button>
      ) : (
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
      )}
      
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
