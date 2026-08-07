import { useState } from "react";
import { Link } from "react-router-dom";
import { Disc3, Images } from "lucide-react";
import { useSiteConfig } from "../context/SiteConfigContext";
import { useLanguage } from "../context/LanguageContext";
import StoryViewer from "./StoryViewer";

function GalleryCard({ image, galleryTitle, viewFullLabel, onOpen }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="relative h-[220px] md:h-[320px] w-[260px] md:w-[380px] flex-shrink-0 mx-3 rounded-2xl overflow-hidden bg-surface border border-edge/5 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none text-left"
      aria-label={`${viewFullLabel} — ${galleryTitle}`}
    >
      {image.url ? (
        <img src={image.url} alt={image.alt} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-accent/20 to-surface flex items-center justify-center">
          <Disc3 size={32} className="text-accent" aria-hidden="true" />
          <span className="sr-only">{image.alt}</span>
        </div>
      )}

      <div
        className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 transition-opacity duration-200 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <Images size={22} className="text-white" aria-hidden="true" />
        <span className="text-white text-xs font-bold tracking-widest uppercase text-center px-4">
          {viewFullLabel}
        </span>
        <span className="text-white/70 text-[10px] tracking-widest uppercase">{galleryTitle}</span>
      </div>
    </button>
  );
}

function MarqueeRow({ images, reverse, viewFullLabel, onOpen }) {
  return (
    <div className="flex overflow-hidden">
      <div className={reverse ? "flex animate-marquee-reverse" : "flex animate-marquee"}>
        {images.map((entry) => (
          <GalleryCard
            key={`a-${entry.image.id}`}
            image={entry.image}
            galleryTitle={entry.galleryTitle}
            viewFullLabel={viewFullLabel}
            onOpen={() => onOpen(entry)}
          />
        ))}
        {images.map((entry) => (
          <GalleryCard
            key={`b-${entry.image.id}`}
            image={entry.image}
            galleryTitle={entry.galleryTitle}
            viewFullLabel={viewFullLabel}
            onOpen={() => onOpen(entry)}
          />
        ))}
      </div>
    </div>
  );
}

export default function GalleryMarquee() {
  const { content } = useSiteConfig();
  const { lang } = useLanguage();
  const gallery = content[lang].gallery;
  const [viewer, setViewer] = useState(null);

  const flatEntries = gallery.galleries.flatMap((g) =>
    g.images.map((image, imageIndex) => ({
      image,
      galleryId: g.id,
      galleryTitle: g.title,
      galleryImages: g.images,
      galleryDownloadable: g.downloadable,
      imageIndex,
    }))
  );
  const half = Math.ceil(flatEntries.length / 2);
  const rowA = flatEntries.slice(0, half);
  const rowB = flatEntries.slice(half);

  const openViewer = (entry) => {
    setViewer({
      images: entry.galleryImages,
      startIndex: entry.imageIndex,
      title: entry.galleryTitle,
      downloadable: entry.galleryDownloadable,
    });
  };

  return (
    <section id="galeria" className="py-24 md:py-32 overflow-hidden">
      <div className="px-6 md:px-12 mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-mono text-xs tracking-widest text-muted mb-8">{gallery.label}</p>
          <h2
            className="font-black uppercase tracking-tighter"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 0.9 }}
          >
            {gallery.heading}
          </h2>
          <p className="text-muted mt-6">{gallery.subheading}</p>
        </div>

        <Link
          to="/galerias"
          className="flex items-center gap-2 border border-edge/10 hover:border-accent/60 text-ink text-xs font-bold tracking-widest px-5 py-3 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none flex-shrink-0"
        >
          <Images size={16} />
          {gallery.ctaAll}
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        <MarqueeRow images={rowA.length ? rowA : flatEntries} viewFullLabel={gallery.viewFull} onOpen={openViewer} />
        <MarqueeRow
          images={rowB.length ? rowB : flatEntries}
          reverse
          viewFullLabel={gallery.viewFull}
          onOpen={openViewer}
        />
      </div>

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
    </section>
  );
}
