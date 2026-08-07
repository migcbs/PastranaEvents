import { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "jp_theme";
const SITE_CONTENT_KEY = "jp_site_content_v2";
const ThemeContext = createContext(null);

function getInitialTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return stored;
  try {
    const raw = localStorage.getItem(SITE_CONTENT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.settings?.defaultTheme) return parsed.settings.defaultTheme;
    }
  } catch {
    // ignore malformed storage, fall back to light
  }
  return "light";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
