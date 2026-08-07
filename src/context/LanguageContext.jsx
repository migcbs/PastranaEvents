import { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "jp_lang";
const LanguageContext = createContext(null);

const UI_STRINGS = {
  es: {
    adminLink: "Admin",
    langName: "ES",
    switchToLangLabel: "ENGLISH",
    themeToLight: "Cambiar a tema claro",
    themeToDark: "Cambiar a tema oscuro",
    lightLabel: "CLARO",
    darkLabel: "OSCURO",
    login: "INICIAR SESIÓN",
    adminPanel: "PANEL ADMIN",
  },
  en: {
    adminLink: "Admin",
    langName: "EN",
    switchToLangLabel: "ESPAÑOL",
    themeToLight: "Switch to light theme",
    themeToDark: "Switch to dark theme",
    lightLabel: "LIGHT",
    darkLabel: "DARK",
    login: "LOG IN",
    adminPanel: "ADMIN PANEL",
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem(STORAGE_KEY) || "es");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang((l) => (l === "es" ? "en" : "es"));
  }, []);

  const ui = UI_STRINGS[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, ui }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
