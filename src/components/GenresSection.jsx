import { motion } from "framer-motion";
import { Music, Radio, Mic2, Headphones, Waves, Star, Disc3 } from "lucide-react";
import { fadeUp } from "../motionVariants";
import { useInView } from "../hooks/useInView";
import { useSiteConfig } from "../context/SiteConfigContext";
import { useLanguage } from "../context/LanguageContext";

const ICONS = { Music, Radio, Mic2, Headphones, Waves, Star, Disc3 };

export default function GenresSection() {
  const [ref, inView] = useInView();
  const { content } = useSiteConfig();
  const { lang } = useLanguage();
  const genres = content[lang].genres;

  return (
    <section id="generos" ref={ref} className="py-24 md:py-32 px-6 md:px-12 bg-surface">
      <p className="font-mono text-xs tracking-widest text-muted mb-8">{genres.label}</p>
      <h2
        className="font-black uppercase tracking-tighter"
        style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 0.9 }}
      >
        {genres.headingLine1}
        <br />
        {genres.headingLine2}
      </h2>
      <p className="text-muted mt-6">{genres.subheading}</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-16">
        {genres.items.map((genre, i) => {
          const Icon = ICONS[genre.icon] || Music;
          return (
            <motion.div
              key={`${genre.name}-${i}`}
              className="bg-surface-2 border border-edge/5 rounded-2xl p-6 hover:border-accent/40 transition-all cursor-default group"
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={i}
            >
              <Icon size={24} className="text-ink group-hover:text-accent transition-colors" aria-hidden="true" />
              <h3 className="font-black uppercase text-lg tracking-tight mt-4">{genre.name}</h3>
              <p className="text-xs text-muted mt-1">{genre.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
