import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Smartphone, Mail, CheckCircle2 } from "lucide-react";
import { useSiteConfig } from "../context/SiteConfigContext";
import { useLanguage } from "../context/LanguageContext";
import { useLeads } from "../context/LeadsContext";
import {
  buildLeadMessage,
  buildWhatsappLink,
  buildSmsLink,
  buildEmailLink,
} from "../utils/contactLinks";

const EMPTY_LEAD = {
  name: "",
  phone: "",
  email: "",
  eventType: "",
  eventDate: "",
  location: "",
  guests: "",
  packageInterest: "",
  details: "",
};

export default function BookingModal({ open, onClose }) {
  const { content } = useSiteConfig();
  const { lang } = useLanguage();
  const { createLead } = useLeads();
  const c = content[lang];
  const [lead, setLead] = useState(EMPTY_LEAD);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleChange = (field) => (e) => {
    setLead((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await createLead(lead);
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleClose = () => {
    setLead(EMPTY_LEAD);
    setSubmitted(false);
    onClose();
  };

  const message = buildLeadMessage(lead, c.booking.fields);
  const whatsappHref = buildWhatsappLink(c.contact.whatsappNumber, message);
  const smsHref = buildSmsLink(c.contact.smsNumber, message);
  const emailHref = buildEmailLink(c.contact.email, `Solicitud de reserva — ${lead.name}`, message);

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
          aria-label={c.booking.formTitle}
          className="w-full max-w-lg bg-base border border-edge/10 rounded-2xl p-8 relative my-auto"
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleClose}
            aria-label={c.booking.closeText}
            className="absolute top-4 right-4 w-8 h-8 rounded-full border border-edge/10 flex items-center justify-center hover:border-edge/30 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            <X size={16} />
          </button>

          {!submitted ? (
            <>
              <h2 className="font-black uppercase tracking-tight text-2xl pr-8">{c.booking.formTitle}</h2>
              <p className="text-sm text-muted mt-2">{c.booking.formSubtitle}</p>

              <form onSubmit={handleSubmit} className="mt-6 grid sm:grid-cols-2 gap-4">
                <Field label={c.booking.fields.name} required>
                  <input
                    required
                    value={lead.name}
                    onChange={handleChange("name")}
                    className="jp-input"
                  />
                </Field>
                <Field label={c.booking.fields.phone} required>
                  <input
                    required
                    type="tel"
                    value={lead.phone}
                    onChange={handleChange("phone")}
                    className="jp-input"
                  />
                </Field>
                <Field label={c.booking.fields.email}>
                  <input
                    type="email"
                    value={lead.email}
                    onChange={handleChange("email")}
                    className="jp-input"
                  />
                </Field>
                <Field label={c.booking.fields.eventType} required>
                  <select
                    required
                    value={lead.eventType}
                    onChange={handleChange("eventType")}
                    className="jp-input"
                  >
                    <option value="" disabled>
                      —
                    </option>
                    {c.booking.eventTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={c.booking.fields.eventDate} required>
                  <input
                    required
                    type="date"
                    value={lead.eventDate}
                    onChange={handleChange("eventDate")}
                    className="jp-input"
                  />
                </Field>
                <Field label={c.booking.fields.guests}>
                  <input
                    type="number"
                    min="0"
                    value={lead.guests}
                    onChange={handleChange("guests")}
                    className="jp-input"
                  />
                </Field>
                <Field label={c.booking.fields.packageInterest}>
                  <select
                    value={lead.packageInterest}
                    onChange={handleChange("packageInterest")}
                    className="jp-input"
                  >
                    <option value="">{c.booking.packageNotSure}</option>
                    {c.packages.items.map((pkg) => (
                      <option key={pkg.id} value={pkg.title}>
                        {pkg.title} ({pkg.total})
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={c.booking.fields.location} full required>
                  <input
                    required
                    value={lead.location}
                    onChange={handleChange("location")}
                    className="jp-input"
                  />
                </Field>
                <Field label={c.booking.fields.details} full>
                  <textarea
                    rows={3}
                    value={lead.details}
                    onChange={handleChange("details")}
                    className="jp-input resize-none"
                  />
                </Field>

                <button
                  type="submit"
                  disabled={submitting}
                  className="sm:col-span-2 mt-2 bg-accent hover:bg-accent-dim disabled:opacity-60 text-white font-bold text-xs tracking-widest px-6 py-4 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                >
                  {submitting ? "…" : c.booking.submitText}
                </button>
              </form>
            </>
          ) : (
            <div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={28} className="text-accent" />
                <h2 className="font-black uppercase tracking-tight text-xl">{c.booking.successTitle}</h2>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 rounded-xl px-5 py-4 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                >
                  <MessageCircle size={20} className="text-[#25D366]" />
                  {c.booking.sendWhatsapp}
                </a>
                <a
                  href={smsHref}
                  className="flex items-center gap-3 bg-surface hover:bg-surface-2 border border-edge/10 rounded-xl px-5 py-4 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                >
                  <Smartphone size={20} className="text-ink" />
                  {c.booking.sendSms}
                </a>
                <a
                  href={emailHref}
                  className="flex items-center gap-3 bg-surface hover:bg-surface-2 border border-edge/10 rounded-xl px-5 py-4 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                >
                  <Mail size={20} className="text-ink" />
                  {c.booking.sendEmail}
                </a>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="mt-6 text-xs text-muted hover:text-ink tracking-widest uppercase focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded"
              >
                {c.booking.closeText}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Field({ label, children, full, required }) {
  return (
    <label className={`flex flex-col gap-1 text-left ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-[11px] font-mono tracking-widest uppercase text-muted">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      {children}
    </label>
  );
}
