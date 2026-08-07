import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import BioSection from "../components/BioSection";
import GenresSection from "../components/GenresSection";
import StatsSection from "../components/StatsSection";
import GalleryMarquee from "../components/GalleryMarquee";
import TestimonialsSection from "../components/TestimonialsSection";
import PackagesSection from "../components/PackagesSection";
import BookingCTA from "../components/BookingCTA";
import Footer from "../components/Footer";
import { useSiteConfig } from "../context/SiteConfigContext";
import { useLanguage } from "../context/LanguageContext";

export default function MainSite() {
  const { content } = useSiteConfig();
  const { lang } = useLanguage();
  const c = content[lang];

  return (
    <div className="bg-base text-ink font-sans min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <BioSection />
        <GenresSection />
        <StatsSection />
        <GalleryMarquee />
        <TestimonialsSection />
        <PackagesSection />
        <BookingCTA />
      </main>
      <Footer />

      <motion.div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="bg-surface/90 backdrop-blur-md border border-edge/10 rounded-full px-6 py-3 flex items-center gap-4 shadow-xl">
          <span className="font-black text-accent text-sm">PE</span>
          <span className="w-[1px] h-4 bg-edge/10" />
          <a
            href="#reservar"
            className="bg-accent hover:bg-accent-dim text-white text-xs font-bold tracking-widest px-5 py-2 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            {c.bottomNav.cta}
          </a>
        </div>
      </motion.div>
    </div>
  );
}
