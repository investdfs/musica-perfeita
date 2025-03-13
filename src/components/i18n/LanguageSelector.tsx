
import React from 'react';
import { useLanguage } from './LanguageProvider';
import { cn } from '@/lib/utils';

type LanguageOption = {
  code: string;
  name: string;
  flag: string;
};

const languages: LanguageOption[] = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
];

const LanguageSelector = ({ className }: { className?: string }) => {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={cn(
            "flex items-center justify-center rounded-full w-8 h-8 text-xl transition-all",
            language === lang.code
              ? "ring-2 ring-blue-500 ring-offset-1"
              : "opacity-60 hover:opacity-100"
          )}
          title={lang.name}
        >
          <span role="img" aria-label={lang.name}>
            {lang.flag}
          </span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
