import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Images, Download } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StoryViewer from "../components/StoryViewer";
import { useSiteConfig } from "../context/SiteConfigContext";
import { useLanguage } from "../context/LanguageContext";

export default function GalleriesPage() {
  const { content } = useSiteConfig();
  const { lang } = useLanguage();
  const gallery = content[lang].gallery;
  const [viewer, setViewer] = useState(null);

  return (
    <div className="bg-base text-ink font-sans min-h-screen">
      <Navbar />

      <main className="px-6 md:px-12 pt-32 pb-24">
        <Link
          to="/#galeria"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-muted hover:text-ink focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded"
        >
          <ArrowLeft size={14} />
          {lang === "es" ? "Volver al sitio" : "Back to site"}
        </Link>

        <p className="font-mono text-xs tracking-widest text-muted mt-8 mb-4">{gallery.label}</p>
        <h1
          className="font-black uppercase tracking-tighter"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 0.9 }}
        >
          {gallery.ctaAll}
        </h1>
        <p className="text-muted mt-4">{gallery.subheading}</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {gallery.galleries.map((g) => {
            const cover = g.images[0];
            return (
              <button
                key={g.id}
                type="button"
                onClick={() =>
                  setViewer({ images: g.images, startIndex: 0, title: g.title, downloadable: g.downloadable })
                }
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface border border-edge/5 text-left focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
              >
                {cover?.url ? (
                  <img
                    src={cover.url}
                    alt={cover.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-accent/20 to-surface" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                {g.downloadable !== false && (
                  <span className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center">
                    <Download size={13} className="text-white" />
                  </span>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-2 text-white/80 text-[10px] font-mono tracking-widest uppercase mb-1">
                    <Images size={12} />
                    {g.images.length} {lang === "es" ? "fotos" : "photos"}
                  </div>
                  <h3 className="text-white font-black uppercase text-lg tracking-tight">{g.title}</h3>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      <Footer />

      {viewer && (
        <StoryViewer
          images={viewer.images}
          startIndex={viewer.startIndex}
          title={viewer.title}
          onClose={() => setViewer(null)}
          downloadable={viewer.downloadable}
          downloadLabel={gallery.downloadLabel}
          downloadingLabel={gallery.downloadingLabel}
          downloadErrorLabel={gallery.downloadErrorLabel}
        />
      )}
    </div>
  );
}
