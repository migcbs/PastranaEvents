import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "../motionVariants";
import { useInView } from "../hooks/useInView";
import { useSiteConfig } from "../context/SiteConfigContext";
import { useLanguage } from "../context/LanguageContext";
import { buildWhatsappLink, buildSmsLink, buildEmailLink } from "../utils/contactLinks";
import BookingModal from "./BookingModal";
import TermsModal from "./TermsModal";

export default function BookingCTA() {
  const [ref, inView] = useInView();
  const { content } = useSiteConfig();
  const { lang } = useLanguage();
  const c = content[lang];
  const { booking, contact, terms } = c;
  const [modalOpen, setModalOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  const genericMessage =
    lang === "es"
      ? "Hola, me gustaría cotizar a Pastrana Events para mi evento."
      : "Hi, I'd like to get a quote from Pastrana Events for my event.";

  const channels = [
    { label: booking.whatsappLabel, href: buildWhatsappLink(contact.whatsappNumber, genericMessage) },
    { label: booking.smsLabel, href: buildSmsLink(contact.smsNumber, genericMessage) },
    { label: booking.emailLabel, href: buildEmailLink(contact.email, "Cotización DJ", genericMessage) },
  ];

  return (
    <section id="reservar" ref={ref} className="relative py-32 md:py-40 px-6 md:px-12 overflow-hidden">
      <div className="absolute w-[600px] h-[600px] rounded-full bg-accent/10 blur-[120px] -z-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.p
          className="font-mono text-xs tracking-widest text-muted"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0}
        >
          {booking.label}
        </motion.p>

        <motion.h2
          className="font-black uppercase tracking-tighter mt-6"
          style={{ fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 0.9 }}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={1}
        >
          {booking.headingLine1}
          <br />
          {booking.headingLine2}
        </motion.h2>

        <motion.p
          className="text-sm text-muted tracking-widest uppercase mt-6 mb-12"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={2}
        >
          {booking.subheading}
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4 justify-center"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={3}
        >
          {channels.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              target={channel.label === booking.whatsappLabel ? "_blank" : undefined}
              rel={channel.label === booking.whatsappLabel ? "noopener noreferrer" : undefined}
              className="border border-edge/10 hover:border-accent/60 text-muted hover:text-ink text-xs font-bold tracking-widest px-6 py-3 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              {channel.label}
            </a>
          ))}
        </motion.div>

        <motion.button
          type="button"
          onClick={() => setModalOpen(true)}
          className="bg-accent hover:bg-accent-dim text-white font-black text-sm tracking-widest px-12 py-5 rounded-full mt-8 inline-block transition-all shadow-[0_0_40px_rgba(139,49,255,0.4)] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={4}
        >
          {booking.ctaText}
        </motion.button>

        <motion.p
          className="text-xs text-muted mt-3"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={5}
        >
          {terms.acceptanceNote}{" "}
          <button
            type="button"
            onClick={() => setTermsOpen(true)}
            className="text-accent font-semibold hover:underline focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded"
          >
            {terms.linkLabel}
          </button>
          .
        </motion.p>

        <motion.p
          className="text-xs text-muted mt-4"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={6}
        >
          {booking.note}
        </motion.p>
      </div>

      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
    </section>
  );
}
