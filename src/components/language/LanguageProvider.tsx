
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations } from "./translations";

export type Language = "pt" | "en" | "es";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "pt",
  setLanguage: () => {},
  t: (key) => key,
});

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>("pt");
  
  // Carrega o idioma salvo do localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("musicaperfeita_language") as Language | null;
    if (savedLanguage && ["pt", "en", "es"].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);
  
  // Salva o idioma no localStorage quando muda
  useEffect(() => {
    localStorage.setItem("musicaperfeita_language", language);
  }, [language]);
  
  // Função para traduzir textos
  const t = (key: string): string => {
    const keys = key.split(".");
    let current: any = translations[language];
    
    for (const k of keys) {
      if (current && current[k]) {
        current = current[k];
      } else {
        // Fallback para o idioma padrão (português)
        current = getFallbackTranslation(key);
        break;
      }
    }
    
    return typeof current === "string" ? current : key;
  };
  
  // Fallback para o idioma padrão
  const getFallbackTranslation = (key: string): string => {
    const keys = key.split(".");
    let current: any = translations["pt"];
    
    for (const k of keys) {
      if (current && current[k]) {
        current = current[k];
      } else {
        return key;
      }
    }
    
    return typeof current === "string" ? current : key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
