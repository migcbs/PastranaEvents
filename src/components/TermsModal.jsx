import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";
import { useSiteConfig } from "../context/SiteConfigContext";
import { useLanguage } from "../context/LanguageContext";

export default function TermsModal({ open, onClose }) {
  const { content } = useSiteConfig();
  const { lang } = useLanguage();
  const terms = content[lang].terms;
  const [openId, setOpenId] = useState(null);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 py-8 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${terms.headingLine1} ${terms.headingLine2}`}
          className="w-full max-w-lg bg-base border border-edge/10 rounded-2xl p-8 relative my-auto max-h-[85vh] overflow-y-auto"
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute top-4 right-4 w-8 h-8 rounded-full border border-edge/10 flex items-center justify-center hover:border-edge/30 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            <X size={16} />
          </button>

          <p className="font-mono text-xs tracking-widest text-muted mb-3">{terms.label}</p>
          <h2 className="font-black uppercase tracking-tight text-2xl pr-8">
            {terms.headingLine1} {terms.headingLine2}
          </h2>
          <p className="text-sm text-muted mt-2">{terms.subheading}</p>

          <div className="mt-6 flex flex-col divide-y divide-edge/10 border-y border-edge/10">
            {terms.items.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div key={item.id}>
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center gap-3 py-4 text-left focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                  >
                    <span className="w-8 h-8 rounded-full border border-edge/20 flex items-center justify-center text-[11px] font-mono text-muted flex-shrink-0">
                      {item.number}
                    </span>
                    <h3 className="font-black uppercase text-sm tracking-tight flex-1">{item.title}</h3>
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={16} className="text-muted flex-shrink-0" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-muted leading-relaxed pb-4 pl-11 pr-2">{item.body}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
