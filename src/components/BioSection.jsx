import { motion } from "framer-motion";
import { Disc3 } from "lucide-react";
import { fadeUp } from "../motionVariants";
import { useInView } from "../hooks/useInView";
import { useSiteConfig } from "../context/SiteConfigContext";
import { useLanguage } from "../context/LanguageContext";

export default function BioSection() {
  const [ref, inView] = useInView();
  const { content } = useSiteConfig();
  const { lang } = useLanguage();
  const bio = content[lang].bio;

  return (
    <section id="historia" ref={ref} className="py-24 md:py-32 px-6 md:px-12">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0}
        >
          <p className="font-mono text-xs tracking-widest text-muted mb-8">{bio.label}</p>
          <h2
            className="font-black uppercase tracking-tighter"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 0.9 }}
          >
            {bio.headingLine1}
            <br />
            {bio.headingLine2}
          </h2>
          <div className="w-16 h-[2px] bg-accent my-8" />
          <p className="text-base text-muted leading-relaxed mb-4">{bio.paragraph1}</p>
          <p className="text-base text-muted leading-relaxed">{bio.paragraph2}</p>
          <a
            href="#reservar"
            className="inline-block mt-8 text-accent font-bold text-sm tracking-widest uppercase hover:underline focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded"
          >
            {bio.ctaText}
          </a>
        </motion.div>

        <motion.div
          className="relative"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={1}
        >
          <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-surface border border-edge/5">
            {bio.photoUrl ? (
              <img
                src={bio.photoUrl}
                alt="Foto de Pastrana Events"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div
                className="w-full h-full bg-gradient-to-br from-accent/30 to-surface"
                role="img"
                aria-label="Foto de Pastrana Events"
              />
            )}
          </div>
          <div className="absolute bottom-6 left-6 bg-base/90 backdrop-blur-md border border-edge/10 rounded-xl p-4 flex items-center gap-3">
            <Disc3 size={20} className="text-accent" aria-hidden="true" />
            <span className="text-xs text-muted">{bio.badgeText}</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
