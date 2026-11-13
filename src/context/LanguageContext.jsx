import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  translations,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
} from '../data/translations';

const STORAGE_KEY = 'weddingLanguage';

const VALID_CODES = new Set(SUPPORTED_LANGUAGES.map((l) => l.code));

function getStoredLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && VALID_CODES.has(stored)) {
      return stored;
    }
  } catch {
    // Storage access may be restricted
  }
  return DEFAULT_LANGUAGE;
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children, initialLanguage = null }) {
  const [language, setLanguageState] = useState(() => {
    if (initialLanguage && VALID_CODES.has(initialLanguage)) {
      return initialLanguage;
    }
    return getStoredLanguage();
  });

  // Sync document language attribute
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = useCallback((newLang) => {
    if (!VALID_CODES.has(newLang)) return;
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {}
  }, []);

  // Safe resolver for nested translation keys e.g. "hero.explore" or "events.items"
  const t = useCallback(
    (keyPath, fallback = '') => {
      if (!keyPath) return fallback;
      const keys = keyPath.split('.');

      // 1. Try selected language
      let current = translations[language];
      for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
          current = current[k];
        } else {
          current = undefined;
          break;
        }
      }
      if (current !== undefined) return current;

      // 2. Fall back to default language (Telugu)
      if (language !== DEFAULT_LANGUAGE) {
        let defCurrent = translations[DEFAULT_LANGUAGE];
        for (const k of keys) {
          if (defCurrent && typeof defCurrent === 'object' && k in defCurrent) {
            defCurrent = defCurrent[k];
          } else {
            defCurrent = undefined;
            break;
          }
        }
        if (defCurrent !== undefined) return defCurrent;
      }

      return fallback;
    },
    [language]
  );

  const currentLanguage = useMemo(() => {
    return (
      SUPPORTED_LANGUAGES.find((l) => l.code === language) ||
      SUPPORTED_LANGUAGES[0]
    );
  }, [language]);

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      languages: SUPPORTED_LANGUAGES,
      currentLanguage,
    }),
    [language, setLanguage, t, currentLanguage]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}

export default LanguageContext;

