
import { Home, UserPlus, Info, LogIn, LogOut, User, Music } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

const Navigation = ({ className }: { className?: string }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Helper function to determine if a link is active
  const isActive = (path: string) => location.pathname === path;

  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = () => {
      const storedUser = localStorage.getItem("musicaperfeita_user");
      setIsLoggedIn(!!storedUser);
    };
    
    checkLoginStatus();
    
    // Adiciona um evento de storage para detectar mudanças no localStorage
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, [location.pathname]); // Re-check when route changes

  // Handle logout
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("musicaperfeita_user");
    localStorage.removeItem("redirect_after_login");
    setIsLoggedIn(false); // Atualiza o estado imediatamente
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta com sucesso."
    });
    navigate("/"); // Redirect to home after logout
  };

  return (
    <nav className={cn("flex items-center space-x-6", className)}>
      <Link 
        to="/" 
        className={cn(
          "flex items-center gap-1 transition-colors",
          isActive("/") 
            ? "text-primary font-semibold border-b-2 border-primary py-1" 
            : "hover:text-primary/80"
        )}
      >
        <Home className="h-4 w-4" />
        <span>Home</span>
      </Link>
      
      <Link 
        to="/nossas-musicas" 
        className={cn(
          "flex items-center gap-1 transition-colors",
          isActive("/nossas-musicas") 
            ? "text-primary font-semibold border-b-2 border-primary py-1" 
            : "hover:text-primary/80"
        )}
      >
        <Music className="h-4 w-4" />
        <span>Nossas Músicas</span>
      </Link>
      
      {!isLoggedIn && (
        <Link 
          to="/cadastro" 
          className={cn(
            "flex items-center gap-1 transition-colors",
            isActive("/cadastro") 
              ? "text-primary font-semibold border-b-2 border-primary py-1" 
              : "hover:text-primary/80"
          )}
        >
          <UserPlus className="h-4 w-4" />
          <span>Cadastro</span>
        </Link>
      )}
      
      {isLoggedIn ? (
        <>
          <Link
            to="/dashboard"
            className={cn(
              "flex items-center gap-1 transition-colors",
              isActive("/dashboard") 
                ? "text-primary font-semibold border-b-2 border-primary py-1" 
                : "hover:text-primary/80"
            )}
          >
            <User className="h-4 w-4" />
            <span>Minha Conta</span>
          </Link>
          
          <a
            href="/"
            onClick={handleLogout}
            className="flex items-center gap-1 transition-colors text-red-600 hover:text-red-800"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </a>
        </>
      ) : (
        <Link 
          to="/login" 
          className={cn(
            "flex items-center gap-1 transition-colors",
            isActive("/login") 
              ? "text-primary font-semibold border-b-2 border-primary py-1" 
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
            ? "text-primary font-semibold border-b-2 border-primary py-1" 
            : "hover:text-primary/80"
        )}
      >
        <Info className="h-4 w-4" />
        <span>Sobre</span>
      </Link>
    </nav>
  );
};

export default Navigation;
