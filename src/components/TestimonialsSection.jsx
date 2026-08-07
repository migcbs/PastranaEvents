import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, MessageSquarePlus } from "lucide-react";
import { useSiteConfig } from "../context/SiteConfigContext";
import { useLanguage } from "../context/LanguageContext";
import { useTestimonialsData } from "../context/TestimonialsDataContext";
import TestimonialForm from "./TestimonialForm";

function StarRow({ rating }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? "fill-accent text-accent" : "text-muted"}
        />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const { content } = useSiteConfig();
  const { lang } = useLanguage();
  const { approved, fetchApproved } = useTestimonialsData();
  const testimonials = content[lang].testimonials;

  const [formOpen, setFormOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    fetchApproved();
  }, [fetchApproved]);

  const items = useMemo(() => {
    const curated = testimonials.items.map((item, i) => ({
      id: `curated-${i}`,
      quote: item.quote,
      name: item.name,
      role: item.role,
      rating: item.rating || 5,
    }));
    const submitted = approved
      .filter((t) => t.lang === lang)
      .map((t) => ({
        id: t.id,
        quote: t.message,
        name: t.name,
        role: testimonials.verifiedClient,
        rating: t.rating,
      }));
    return [...curated, ...submitted];
  }, [testimonials, approved, lang]);

  useEffect(() => {
    setActiveIndex(0);
  }, [lang]);

  useEffect(() => {
    if (isHovered || items.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % items.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered, items.length]);

  const next = () => setActiveIndex((i) => (i + 1) % items.length);
  const prev = () => setActiveIndex((i) => (i - 1 + items.length) % items.length);

  const testimonial = items[activeIndex] || items[0];
  if (!testimonial) return null;

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-surface">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="font-mono text-xs tracking-widest text-muted mb-8">{testimonials.label}</p>
          <div className="flex items-center gap-3 flex-wrap">
            <h2
              className="font-black uppercase tracking-tighter"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 0.9 }}
            >
              {testimonials.headingLine1}
              <br />
              {testimonials.headingLine2}
            </h2>
            <div className="flex gap-1" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={20} className="fill-accent text-accent" />
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 border border-edge/10 hover:border-accent/60 text-ink text-xs font-bold tracking-widest px-5 py-3 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none flex-shrink-0"
        >
          <MessageSquarePlus size={16} />
          {testimonials.ctaButton}
        </button>
      </div>

      <div
        className="mt-16 flex items-center gap-6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          type="button"
          onClick={prev}
          aria-label="Testimonio anterior"
          className="hidden md:flex w-10 h-10 rounded-full border border-edge/10 hover:border-edge/30 items-center justify-center flex-shrink-0 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <ChevronLeft size={18} className="text-ink" />
        </button>

        <div className="w-full md:w-[560px] flex-shrink-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${lang}-${testimonial.id}`}
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-surface-2 border border-edge/5 rounded-2xl p-8"
            >
              <StarRow rating={testimonial.rating} />
              <p className="text-base text-muted leading-relaxed mt-4">{testimonial.quote}</p>
              <div className="flex items-center gap-3 mt-8">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/40 to-surface" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-sm text-ink">{testimonial.name}</p>
                  <p className="text-xs text-muted">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Siguiente testimonio"
          className="hidden md:flex w-10 h-10 rounded-full border border-edge/10 hover:border-edge/30 items-center justify-center flex-shrink-0 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <ChevronRight size={18} className="text-ink" />
        </button>
      </div>

      <div className="flex md:hidden gap-4 justify-center mt-6">
        <button
          type="button"
          onClick={prev}
          aria-label="Testimonio anterior"
          className="w-10 h-10 rounded-full border border-edge/10 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <ChevronLeft size={18} className="text-ink" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Siguiente testimonio"
          className="w-10 h-10 rounded-full border border-edge/10 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <ChevronRight size={18} className="text-ink" />
        </button>
      </div>

      <TestimonialForm open={formOpen} onClose={() => setFormOpen(false)} />
    </section>
  );
}
