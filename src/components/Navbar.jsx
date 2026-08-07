import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, Sun, Moon, LayoutDashboard } from "lucide-react";
import { fadeDown } from "../motionVariants";
import { useSiteConfig } from "../context/SiteConfigContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { content } = useSiteConfig();
  const { lang, toggleLang, ui } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const c = content[lang];
  const navLinks = c.nav.links;

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !menuRef.current) return;
      const focusable = menuRef.current.querySelectorAll('a[href], button:not([disabled])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-base/80 backdrop-blur-md border-b border-edge/5">
        <nav className="px-6 md:px-12 py-5 flex justify-between items-center">
          <motion.a
            href="#top"
            className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded"
            variants={fadeDown}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <span className="text-sm font-black tracking-widest text-ink">PASTRANA EVENTS</span>
            <span className="w-[6px] h-[6px] rounded-full bg-accent" />
          </motion.a>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.key}
                href={`#${link.key}`}
                className="text-[11px] font-semibold tracking-widest uppercase text-muted hover:text-ink transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded"
                variants={fadeDown}
                initial="hidden"
                animate="visible"
                custom={i + 1}
              >
                {link.label}
              </motion.a>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <motion.button
              type="button"
              onClick={toggleLang}
              aria-label="Cambiar idioma"
              className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full border border-edge/10 text-[11px] font-bold tracking-widest hover:border-edge/30 transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
              variants={fadeDown}
              initial="hidden"
              animate="visible"
              custom={navLinks.length + 1}
            >
              {lang === "es" ? "EN" : "ES"}
            </motion.button>

            <motion.button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "light" ? ui.themeToDark : ui.themeToLight}
              className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full border border-edge/10 hover:border-edge/30 transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
              variants={fadeDown}
              initial="hidden"
              animate="visible"
              custom={navLinks.length + 2}
            >
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </motion.button>

            {isAuthenticated && (
              <motion.button
                type="button"
                onClick={() => navigate("/admin")}
                aria-label="Ir al panel de administrador"
                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full border border-accent/40 text-accent hover:bg-accent/10 transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                variants={fadeDown}
                initial="hidden"
                animate="visible"
                custom={navLinks.length + 3}
              >
                <LayoutDashboard size={15} />
              </motion.button>
            )}

            <motion.a
              href="#reservar"
              className="hidden md:inline-block bg-accent text-white text-xs font-bold tracking-widest px-5 py-2 rounded-full hover:bg-accent-dim transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
              variants={fadeDown}
              initial="hidden"
              animate="visible"
              custom={navLinks.length + 4}
            >
              {c.nav.cta}
            </motion.a>

            <motion.button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Abrir menú de navegación"
              aria-expanded={open}
              className="md:hidden w-9 h-9 rounded-full bg-surface-2 flex flex-col items-center justify-center gap-[5px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
              variants={fadeDown}
              initial="hidden"
              animate="visible"
              custom={navLinks.length + 4}
            >
              <span className="w-4 h-[1.5px] bg-ink" />
              <span className="w-4 h-[1.5px] bg-ink" />
              <span className="w-4 h-[1.5px] bg-ink" />
            </motion.button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            className="fixed inset-0 z-[60] bg-base flex flex-col px-6 py-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-black tracking-widest text-ink">PASTRANA EVENTS</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú de navegación"
                className="w-9 h-9 rounded-full border border-edge/10 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
              >
                <X size={18} className="text-ink" />
              </button>
            </div>

            <div className="flex flex-col gap-8 mt-16">
              {navLinks.map((link) => (
                <a
                  key={link.key}
                  href={`#${link.key}`}
                  onClick={() => setOpen(false)}
                  className="text-4xl font-black uppercase tracking-tight text-ink focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleLang}
                  className="flex-1 border border-edge/10 rounded-full py-3 text-xs font-bold tracking-widest focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                >
                  {ui.switchToLangLabel}
                </button>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex-1 border border-edge/10 rounded-full py-3 text-xs font-bold tracking-widest flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                >
                  {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
                  {theme === "light" ? ui.darkLabel : ui.lightLabel}
                </button>
              </div>

              {isAuthenticated && (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="border border-accent/40 text-accent rounded-full py-3 text-center text-xs font-bold tracking-widest focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                >
                  {ui.adminPanel}
                </Link>
              )}

              <a
                href="#reservar"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 bg-accent text-white text-xs font-bold tracking-widest px-5 py-3 rounded-full hover:bg-accent-dim transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
              >
                {c.nav.cta}
                <ArrowUpRight size={16} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
