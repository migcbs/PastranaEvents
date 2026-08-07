import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { LogOut, ExternalLink, RotateCcw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSiteConfig } from "../context/SiteConfigContext";
import {
  AppearanceSection,
  HeroSectionAdmin,
  BioSectionAdmin,
  GenresSectionAdmin,
  StatsSectionAdmin,
  GallerySectionAdmin,
  TestimonialsSectionAdmin,
  UserReviewsSection,
  PackagesSectionAdmin,
  TermsSectionAdmin,
  BookingSectionAdmin,
  ContactSectionAdmin,
  FooterSectionAdmin,
  LeadsSection,
} from "./sections";

const TABS = [
  { id: "appearance", label: "Apariencia" },
  { id: "hero", label: "Hero" },
  { id: "bio", label: "Historia" },
  { id: "genres", label: "Géneros" },
  { id: "stats", label: "Estadísticas" },
  { id: "gallery", label: "Galería" },
  { id: "testimonials", label: "Testimonios" },
  { id: "reviews", label: "Recomendaciones" },
  { id: "packages", label: "Paquetes" },
  { id: "terms", label: "Términos" },
  { id: "booking", label: "Reservas" },
  { id: "contact", label: "Contacto y redes" },
  { id: "footer", label: "Footer" },
  { id: "leads", label: "Solicitudes" },
];

export default function AdminDashboard() {
  const { isAuthenticated, checking, logout } = useAuth();
  const { resetAll } = useSiteConfig();
  const [editingLang, setEditingLang] = useState("es");
  const [activeTab, setActiveTab] = useState("appearance");

  if (checking) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-base text-ink font-sans">
      <header className="sticky top-0 z-30 bg-base/90 backdrop-blur-md border-b border-edge/5 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-black tracking-widest text-sm">PASTRANA EVENTS · ADMIN</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center border border-edge/10 rounded-full p-1">
            <button
              type="button"
              onClick={() => setEditingLang("es")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold ${editingLang === "es" ? "bg-accent text-white" : "text-muted"}`}
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => setEditingLang("en")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold ${editingLang === "en" ? "bg-accent text-white" : "text-muted"}`}
            >
              EN
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("¿Restablecer todo el contenido a los valores por defecto?")) resetAll();
            }}
            className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase border border-edge/10 rounded-full px-3 py-2 hover:border-edge/30"
          >
            <RotateCcw size={12} /> Restablecer todo
          </button>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase border border-edge/10 rounded-full px-3 py-2 hover:border-edge/30"
          >
            <ExternalLink size={12} /> Ver sitio
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase bg-surface-2 rounded-full px-3 py-2 hover:text-red-500"
          >
            <LogOut size={12} /> Salir
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        <nav className="lg:w-56 flex-shrink-0 px-4 py-6 lg:px-4 lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)] overflow-x-auto lg:overflow-y-auto">
          <div className="flex lg:flex-col gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`text-left text-xs font-bold tracking-widest uppercase px-4 py-3 rounded-xl whitespace-nowrap transition-colors ${
                  activeTab === tab.id ? "bg-accent text-white" : "text-muted hover:bg-surface-2"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        <main className="flex-1 px-6 py-6 max-w-4xl">
          {activeTab === "appearance" && <AppearanceSection />}
          {activeTab === "hero" && <HeroSectionAdmin lang={editingLang} />}
          {activeTab === "bio" && <BioSectionAdmin lang={editingLang} />}
          {activeTab === "genres" && <GenresSectionAdmin lang={editingLang} />}
          {activeTab === "stats" && <StatsSectionAdmin lang={editingLang} />}
          {activeTab === "gallery" && <GallerySectionAdmin lang={editingLang} />}
          {activeTab === "testimonials" && <TestimonialsSectionAdmin lang={editingLang} />}
          {activeTab === "reviews" && <UserReviewsSection />}
          {activeTab === "packages" && <PackagesSectionAdmin lang={editingLang} />}
          {activeTab === "terms" && <TermsSectionAdmin lang={editingLang} />}
          {activeTab === "booking" && <BookingSectionAdmin lang={editingLang} />}
          {activeTab === "contact" && <ContactSectionAdmin lang={editingLang} />}
          {activeTab === "footer" && <FooterSectionAdmin lang={editingLang} />}
          {activeTab === "leads" && <LeadsSection />}
        </main>
      </div>
    </div>
  );
}
