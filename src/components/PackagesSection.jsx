import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { fadeUp } from "../motionVariants";
import { useInView } from "../hooks/useInView";
import { useSiteConfig } from "../context/SiteConfigContext";
import { useLanguage } from "../context/LanguageContext";

export default function PackagesSection() {
  const [ref, inView] = useInView();
  const { content } = useSiteConfig();
  const { lang } = useLanguage();
  const packages = content[lang].packages;

  return (
    <section id="paquetes" ref={ref} className="py-24 md:py-32 px-6 md:px-12 bg-base">
      <p className="font-mono text-xs tracking-widest text-muted mb-8">{packages.label}</p>
      <h2
        className="font-black uppercase tracking-tighter"
        style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 0.9 }}
      >
        {packages.headingLine1}
        <br />
        {packages.headingLine2}
      </h2>
      <p className="text-muted mt-6">{packages.subheading}</p>

      <div className="grid md:grid-cols-3 gap-6 mt-16 items-stretch">
        {packages.items.map((pkg, i) => {
          const featured = i === 1;
          return (
            <motion.div
              key={pkg.id}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={i}
              className={`relative rounded-2xl p-8 flex flex-col ${
                featured
                  ? "bg-surface border-2 border-accent"
                  : "bg-surface border border-edge/5"
              }`}
            >
              {featured && (
                <span className="absolute -top-3 left-8 bg-accent text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                  {lang === "es" ? "Más popular" : "Most popular"}
                </span>
              )}

              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 rounded-full border border-edge/20 flex items-center justify-center text-xs font-mono text-muted flex-shrink-0">
                  {pkg.number}
                </span>
                <h3 className="font-black uppercase text-lg tracking-tight leading-tight">{pkg.title}</h3>
              </div>

              <ul className="flex flex-col gap-3 flex-1">
                {pkg.features.map((feature, fi) => (
                  <li key={fi} className="flex items-start gap-2 text-sm text-muted">
                    <Check size={16} className="text-accent flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 border border-edge/15 rounded-xl px-5 py-4 text-center">
                <span className="text-[10px] font-mono tracking-widest uppercase text-muted">
                  {packages.totalLabel}
                </span>
                <p className="font-black text-3xl tracking-tight mt-1">{pkg.total}</p>
              </div>

              <a
                href="#reservar"
                className={`mt-6 text-center text-xs font-bold tracking-widest uppercase px-6 py-3 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
                  featured
                    ? "bg-accent hover:bg-accent-dim text-white"
                    : "border border-edge/15 hover:border-accent/60 text-ink"
                }`}
              >
                {content[lang].nav.cta}
              </a>
            </motion.div>
          );
        })}
      </div>

      <p className="text-xs text-muted mt-8 italic">{packages.footnote}</p>
    </section>
  );
}
