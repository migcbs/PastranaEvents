import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { isAuthenticated, checking, login, error } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (checking) return null;
  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await login(username, password);
    setSubmitting(false);
    if (ok) navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-base text-ink flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-surface border border-edge/10 rounded-2xl p-8">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-4">
          <Lock size={18} className="text-accent" />
        </div>
        <h1 className="font-black uppercase tracking-tight text-xl">Panel de administrador</h1>
        <p className="text-xs text-muted mt-2">Acceso restringido.</p>

        <div className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-mono tracking-widest uppercase text-muted">Usuario</span>
            <input
              autoFocus
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="jp-input"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-mono tracking-widest uppercase text-muted">Contraseña</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="jp-input"
            />
          </label>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="bg-accent hover:bg-accent-dim disabled:opacity-60 text-white font-bold text-xs tracking-widest px-6 py-3 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            {submitting ? "…" : "INICIAR SESIÓN"}
          </button>
        </div>
      </form>
    </div>
  );
}
