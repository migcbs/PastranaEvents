import { motion } from "framer-motion";
import { fadeUp } from "../motionVariants";
import { useInView } from "../hooks/useInView";
import { useSiteConfig } from "../context/SiteConfigContext";
import { useLanguage } from "../context/LanguageContext";

export default function StatsSection() {
  const [ref, inView] = useInView();
  const { content } = useSiteConfig();
  const { lang } = useLanguage();
  const stats = content[lang].stats.items;

  return (
    <section ref={ref} className="py-24 md:py-32 px-6 md:px-12 bg-base border-y border-edge/5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-edge/10">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="flex flex-col items-center md:items-start px-8 py-4"
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={i}
          >
            <span
              className="font-black text-ink"
              style={{ fontSize: "clamp(3rem, 8vw, 6rem)", lineHeight: 1 }}
            >
              {stat.isPercent ? (
                `${stat.value}%`
              ) : (
                <>
                  <span className="text-accent">+</span>
                  {stat.value}
                </>
              )}
            </span>
            <span className="text-[11px] font-mono tracking-widest uppercase text-muted mt-2">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
