import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { fadeUp, clipReveal } from "../motionVariants";
import { useSiteConfig } from "../context/SiteConfigContext";
import { useLanguage } from "../context/LanguageContext";

export default function HeroSection() {
  const { content } = useSiteConfig();
  const { lang } = useLanguage();
  const hero = content[lang].hero;
  const ctas = Array.isArray(hero.ctas) ? hero.ctas : [];
  const stats = Array.isArray(hero.stats) ? hero.stats : [];

  return (
    <section id="top" className="relative min-h-screen flex flex-col overflow-hidden">
      <img
        src={hero.photoUrl}
        alt="Foto de Pastrana Events en cabina, mezclando en vivo"
        className="absolute inset-0 w-full h-full object-cover z-0"
        loading="eager"
      />
      {/*
        Scrim siempre oscuro sobre la foto, independiente del tema del sitio:
        el hero usa texto blanco fijo, así que el contraste debe garantizarse
        sin depender de si el usuario tiene tema claro u oscuro activado.
      */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-black/70 z-[1]" />
      <div className="absolute inset-0 bg-black/10 z-[1]" />

      <div className="relative z-10 flex flex-col min-h-screen px-6 md:px-12">
        <div className="h-[76px]" />

        <div className="flex-1 flex items-end pb-12 md:pb-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between w-full gap-10">
            <div className="max-w-[560px]">
              <p className="font-mono text-[10px] tracking-widest text-white/80 mb-6">
                {hero.label}
              </p>

              <h1
                className="font-black uppercase tracking-tighter text-white"
                style={{ fontSize: "clamp(4rem, 12vw, 10rem)", lineHeight: 0.88, textShadow: "0 4px 24px rgba(0,0,0,0.35)" }}
              >
                {hero.words.map((word, i) => (
                  <span key={`${word}-${i}`} className="block overflow-hidden">
                    <motion.span
                      className="block"
                      variants={clipReveal}
                      initial="hidden"
                      animate="visible"
                      custom={i}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </h1>

              <motion.p
                className="text-sm text-white/80 tracking-widest uppercase mt-6 mb-8"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={3}
              >
                {hero.subheading}
              </motion.p>

              <div className="flex flex-wrap gap-4">
                {ctas.map((cta, i) => (
                  <motion.a
                    key={cta.id}
                    href={cta.href}
                    className={
                      cta.style === "primary"
                        ? "bg-accent hover:bg-accent-dim text-white font-bold text-xs tracking-widest px-8 py-4 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                        : "border border-white/30 hover:border-white/70 text-white font-semibold text-xs tracking-widest px-8 py-4 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                    }
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={4 + i}
                  >
                    {cta.label}
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="hidden md:flex flex-col items-end gap-3">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.id}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={i + 2}
                >
                  <span className="text-accent font-black text-sm">{stat.value}</span>
                  <span className="text-[10px] text-white/80 tracking-widest uppercase">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="pb-8 flex items-center justify-between">
          <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center">
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown size={16} className="text-white" aria-hidden="true" />
            </motion.span>
          </div>
          <span className="font-mono text-[10px] text-white/80 tracking-widest">{hero.location}</span>
        </div>
      </div>
    </section>
  );
}
