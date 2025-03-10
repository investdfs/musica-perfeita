
import { Home, UserPlus, Info, LogIn, LogOut, User, Music, MessageSquareHeart } from "lucide-react";
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
        className="flex items-center gap-1 transition-colors text-black hover:opacity-80"
      >
        <Home className="h-4 w-4 text-blue-500" />
        <span>Home</span>
      </Link>
      
      <Link 
        to="/nossas-musicas" 
        className="flex items-center gap-1 transition-colors text-black hover:opacity-80"
      >
        <Music className="h-4 w-4 text-purple-500" />
        <span>Nossas Músicas</span>
      </Link>
      
      <Link 
        to="/depoimentos" 
        className="flex items-center gap-1 transition-colors text-black hover:opacity-80"
      >
        <MessageSquareHeart className="h-4 w-4 text-pink-500" />
        <span>Depoimentos</span>
      </Link>
      
      <Link 
        to="/sobre" 
        className="flex items-center gap-1 transition-colors text-black hover:opacity-80"
      >
        <Info className="h-4 w-4 text-amber-500" />
        <span>Sobre</span>
      </Link>
      
      {!isLoggedIn && (
        <Link 
          to="/cadastro" 
          className="flex items-center gap-1 transition-colors text-black hover:opacity-80"
        >
          <UserPlus className="h-4 w-4 text-green-500" />
          <span>Cadastro</span>
        </Link>
      )}
      
      {isLoggedIn ? (
        <Link
          to="/dashboard"
          className="flex items-center gap-1 transition-colors text-black hover:opacity-80"
        >
          <User className="h-4 w-4 text-teal-500" />
          <span>Minha Conta</span>
        </Link>
      ) : (
        <Link 
          to="/login" 
          className="flex items-center gap-1 transition-colors text-black hover:opacity-80"
        >
          <LogIn className="h-4 w-4 text-indigo-500" />
          <span>Login</span>
        </Link>
      )}
      
      {isLoggedIn && (
        <a
          href="/"
          onClick={handleLogout}
          className="flex items-center gap-1 transition-colors text-red-600 hover:text-red-800"
        >
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </a>
      )}
    </nav>
  );
};

export default Navigation;
