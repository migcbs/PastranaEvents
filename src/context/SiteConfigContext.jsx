import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { defaultContent, defaultSettings, FONT_OPTIONS } from "./defaultContent";

const STORAGE_KEY = "jp_site_content_v4";
const SiteConfigContext = createContext(null);

function hexToRgbTriplet(hex) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r} ${g} ${b}`;
}

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      es: { ...defaultContent.es, ...parsed.es },
      en: { ...defaultContent.en, ...parsed.en },
      settings: { ...defaultSettings, ...parsed.settings },
    };
  } catch {
    return null;
  }
}

function applySettingsToDom(settings) {
  const root = document.documentElement;
  root.style.setProperty("--color-accent", hexToRgbTriplet(settings.accent));
  root.style.setProperty("--color-accent-dim", hexToRgbTriplet(settings.accentDim));
  const fontDef = FONT_OPTIONS.find((f) => f.id === settings.font) || FONT_OPTIONS[0];
  root.style.setProperty("--font-sans", fontDef.stack);

  const linkId = "jp-google-font";
  let link = document.getElementById(linkId);
  if (!link) {
    link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  const family = fontDef.id.replace(/ /g, "+");
  link.href = `https://fonts.googleapis.com/css2?family=${family}:wght@300;400;500;600;700;800;900&display=swap`;
}

export function SiteConfigProvider({ children }) {
  const [content, setContent] = useState(() => loadStored() || { ...defaultContent, settings: defaultSettings });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    applySettingsToDom(content.settings);
  }, [content]);

  // El admin y el sitio pueden estar abiertos en pestañas distintas; sin esto,
  // guardar un cambio en /admin no se reflejaba en una pestaña del sitio ya
  // abierta hasta recargarla manualmente.
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      const next = loadStored();
      if (next) setContent(next);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const updateSection = useCallback((lang, section, value) => {
    setContent((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [section]: value },
    }));
  }, []);

  const updateSettings = useCallback((partial) => {
    setContent((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...partial },
    }));
  }, []);

  const resetSection = useCallback((lang, section) => {
    setContent((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [section]: defaultContent[lang][section] },
    }));
  }, []);

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setContent({ ...defaultContent, settings: defaultSettings });
  }, []);

  return (
    <SiteConfigContext.Provider
      value={{ content, updateSection, updateSettings, resetSection, resetAll }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) throw new Error("useSiteConfig must be used within SiteConfigProvider");
  return ctx;
}
