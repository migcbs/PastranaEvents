import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, CheckCircle2 } from "lucide-react";
import { useSiteConfig } from "../context/SiteConfigContext";
import { useLanguage } from "../context/LanguageContext";
import { useTestimonialsData } from "../context/TestimonialsDataContext";

export default function TestimonialForm({ open, onClose }) {
  const { content } = useSiteConfig();
  const { lang } = useLanguage();
  const { submitTestimonial } = useTestimonialsData();
  const t = content[lang].testimonials;

  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await submitTestimonial({ name, rating, message, lang });
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleClose = () => {
    setName("");
    setRating(5);
    setMessage("");
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 py-8 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t.formTitle}
          className="w-full max-w-md bg-base border border-edge/10 rounded-2xl p-8 relative my-auto"
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar"
            className="absolute top-4 right-4 w-8 h-8 rounded-full border border-edge/10 flex items-center justify-center hover:border-edge/30 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            <X size={16} />
          </button>

          {!submitted ? (
            <>
              <h2 className="font-black uppercase tracking-tight text-xl pr-8">{t.formTitle}</h2>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-mono tracking-widest uppercase text-muted">
                    {t.ratingLabel}
                  </span>
                  <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        onMouseEnter={() => setHoverRating(n)}
                        aria-label={`${n} ${n === 1 ? "estrella" : "estrellas"}`}
                        className="focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded"
                      >
                        <Star
                          size={26}
                          className={
                            n <= (hoverRating || rating)
                              ? "fill-accent text-accent"
                              : "text-muted"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-mono tracking-widest uppercase text-muted">
                    {t.nameLabel}
                  </span>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="jp-input"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-mono tracking-widest uppercase text-muted">
                    {t.messageLabel}
                  </span>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="jp-input resize-none"
                  />
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 bg-accent hover:bg-accent-dim disabled:opacity-60 text-white font-bold text-xs tracking-widest px-6 py-4 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                >
                  {submitting ? "…" : t.submitText}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <CheckCircle2 size={32} className="text-accent mx-auto" />
              <h2 className="font-black uppercase tracking-tight text-lg mt-4">{t.submittedTitle}</h2>
              <p className="text-sm text-muted mt-2">{t.submittedText}</p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-6 text-xs text-muted hover:text-ink tracking-widest uppercase focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded"
              >
                Cerrar
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
