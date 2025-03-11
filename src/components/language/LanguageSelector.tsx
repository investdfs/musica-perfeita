
import { Globe, ChevronDown } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type Language = "pt" | "en" | "es";

const languageNames = {
  pt: "Português",
  en: "English",
  es: "Español",
};

const flagEmojis = {
  pt: "🇧🇷",
  en: "🇺🇸",
  es: "🇪🇸",
};

const LanguageSelector = ({ className }: { className?: string }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn("flex items-center gap-1", className)}>
        <span className="text-xl">{flagEmojis[language]}</span>
        <ChevronDown className="h-3 w-3 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {Object.entries(languageNames).map(([code, name]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLanguage(code as Language)}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              language === code && "font-bold bg-gray-100"
            )}
          >
            <span className="text-lg">{flagEmojis[code as Language]}</span>
            <span>{name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
