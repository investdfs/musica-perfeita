
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>("light");
  
  // Detectar preferência do sistema
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    // Verificar se há uma preferência salva
    const savedTheme = localStorage.getItem("musicaperfeita_theme") as Theme | null;
    
    // Forçar tema claro para garantir legibilidade
    setTheme("light");
    
    // Salvar preferência
    localStorage.setItem("musicaperfeita_theme", "light");
  }, []);
  
  // Aplicar tema no documento
  useEffect(() => {
    // Sempre remover classe dark para garantir modo claro
    document.documentElement.classList.remove("dark");
    
    // Salvar preferência
    localStorage.setItem("musicaperfeita_theme", "light");
  }, [theme]);
  
  const toggleTheme = () => {
    // Desativado temporariamente para manter consistência de cores
    // setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
    toast({
      title: "Modo escuro desativado",
      description: "O modo escuro está temporariamente desativado para garantir legibilidade."
    });
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
