import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Download, Loader2 } from "lucide-react";
import { downloadGalleryZip } from "../utils/downloadGalleryZip";

const DURATION_MS = 15000;

export default function StoryViewer({
  images,
  startIndex = 0,
  title,
  onClose,
  downloadable = false,
  downloadLabel = "Download",
  downloadingLabel = "Preparing…",
  downloadErrorLabel = "Couldn't download.",
}) {
  const [index, setIndex] = useState(startIndex);
  const [paused, setPaused] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);

  useEffect(() => {
    setIndex(startIndex);
  }, [startIndex, images]);

  const goNext = () => {
    setIndex((i) => {
      if (i >= images.length - 1) {
        onClose();
        return i;
      }
      return i + 1;
    });
  };

  const goPrev = () => {
    setIndex((i) => Math.max(0, i - 1));
  };

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadError(false);
    setPaused(true);
    try {
      await downloadGalleryZip({ title, images });
    } catch {
      setDownloadError(true);
    } finally {
      setDownloading(false);
      setPaused(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  if (!images.length) return null;
  const current = images[index];

  return (
    <div
      className="fixed inset-0 z-[80] bg-black flex items-center justify-center select-none"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute top-0 left-0 right-0 z-20 px-4 pt-4">
        <div className="flex gap-1.5">
          {images.map((img, i) => (
            <div key={img.id} className="h-[3px] flex-1 rounded-full bg-white/25 overflow-hidden">
              <div
                className="h-full bg-white rounded-full"
                style={{
                  width: i < index ? "100%" : i > index ? "0%" : undefined,
                  animationName: i === index ? "story-progress" : "none",
                  animationDuration: `${DURATION_MS}ms`,
                  animationTimingFunction: "linear",
                  animationFillMode: "forwards",
                  animationPlayState: paused ? "paused" : "running",
                }}
                onAnimationEnd={i === index ? goNext : undefined}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-white text-xs font-bold tracking-widest uppercase drop-shadow">
            {title} · {index + 1}/{images.length}
          </span>
          <div className="flex items-center gap-2">
            {downloadable && (
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                aria-label={downloadLabel}
                title={downloadLabel}
                className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center text-white disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
              >
                {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center text-white focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        {downloading && (
          <p className="text-white/80 text-[11px] mt-2 text-right">{downloadingLabel}</p>
        )}
        {downloadError && (
          <p className="text-red-400 text-[11px] mt-2 text-right">{downloadErrorLabel}</p>
        )}
      </div>

      <img
        key={current.id}
        src={current.url}
        alt={current.alt}
        className="max-h-full max-w-full w-full h-full object-contain md:object-cover"
      />

      <button
        type="button"
        aria-label="Anterior"
        onClick={goPrev}
        onMouseDown={() => setPaused(true)}
        onMouseUp={() => setPaused(downloading)}
        className="absolute left-0 top-0 h-full w-1/3 flex items-center justify-start pl-3 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
      >
        <ChevronLeft size={28} className="text-white/0 md:text-white/70 hover:md:text-white transition-colors" />
      </button>
      <button
        type="button"
        aria-label="Siguiente"
        onClick={goNext}
        onMouseDown={() => setPaused(true)}
        onMouseUp={() => setPaused(downloading)}
        className="absolute right-0 top-0 h-full w-1/3 flex items-center justify-end pr-3 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
      >
        <ChevronRight size={28} className="text-white/0 md:text-white/70 hover:md:text-white transition-colors" />
      </button>
    </div>
  );
}
