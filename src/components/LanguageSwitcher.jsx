import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { getLanguage, setLanguage, getAvailableLanguages, t } from '../utils/i18n';

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState(getLanguage());
  const [isOpen, setIsOpen] = useState(false);
  const languages = getAvailableLanguages();

  useEffect(() => {
    const handleLanguageChange = (e) => {
      setCurrentLang(e.detail.language);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  const handleLanguageSelect = (langCode) => {
    setLanguage(langCode);
    setCurrentLang(langCode);
    setIsOpen(false);
    // Reload page to apply translations (simple approach)
    window.location.reload();
  };

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 sm:px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100 min-h-[44px]"
        aria-label={`Current language: ${currentLanguage.name}. Click to change language.`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLanguage.native}</span>
        <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 min-w-[180px] sm:bottom-auto sm:top-full sm:mt-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                  currentLang === lang.code
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{lang.native}</span>
                {currentLang === lang.code && (
                  <span className="text-gray-400 text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

