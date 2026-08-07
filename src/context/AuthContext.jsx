import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../utils/api";

const TOKEN_KEY = "jp_admin_token";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) {
      setChecking(false);
      return;
    }
    api
      .me()
      .then((data) => {
        setIsAuthenticated(true);
        setUsername(data.username);
      })
      .catch(() => {
        sessionStorage.removeItem(TOKEN_KEY);
        setIsAuthenticated(false);
      })
      .finally(() => setChecking(false));
  }, []);

  const login = useCallback(async (usernameInput, password) => {
    setError("");
    try {
      const data = await api.login(usernameInput, password);
      sessionStorage.setItem(TOKEN_KEY, data.token);
      setIsAuthenticated(true);
      setUsername(data.username);
      return true;
    } catch (err) {
      setError(
        api.isApiUnavailableError(err)
          ? "No se pudo conectar con el servidor. Verifica que el backend (server/) esté corriendo."
          : err.message || "Usuario o contraseña incorrectos."
      );
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // si el servidor no responde, igual cerramos sesión localmente
    }
    sessionStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
    setUsername(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, checking, username, login, logout, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
