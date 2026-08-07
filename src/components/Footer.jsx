import { InstagramIcon, FacebookIcon, TikTokIcon } from "./icons/SocialIcons";
import { useSiteConfig } from "../context/SiteConfigContext";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { content } = useSiteConfig();
  const { lang } = useLanguage();
  const c = content[lang];
  const { footer, contact, socials, nav } = c;

  const SOCIALS = [
    { icon: InstagramIcon, label: "Instagram", href: socials.instagram },
    { icon: FacebookIcon, label: "Facebook", href: socials.facebook },
    { icon: TikTokIcon, label: "TikTok", href: socials.tiktok },
  ];

  return (
    <footer className="py-16 px-6 md:px-12 border-t border-edge/5">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12">
        <div>
          <p className="font-black text-2xl tracking-widest">PASTRANA EVENTS</p>
          <p className="text-xs text-muted tracking-widest uppercase mt-1">{footer.tagline}</p>
          <div className="flex gap-3 mt-6">
            {SOCIALS.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full border border-edge/10 hover:border-accent/50 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                >
                  <Icon size={16} className="text-ink" aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="hidden md:block">
          <p className="font-mono text-[10px] tracking-widest text-muted mb-4">{footer.navLabel}</p>
          <ul className="flex flex-col gap-2">
            {nav.links.map((link) => (
              <li key={link.key}>
                <a
                  href={`#${link.key}`}
                  className="text-sm text-muted hover:text-ink transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono text-[10px] tracking-widest text-muted mb-4">{footer.contactLabel}</p>
          <a
            href={`mailto:${contact.email}`}
            className="text-sm block hover:text-ink focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded"
          >
            {contact.email}
          </a>
          <p className="text-sm text-muted mt-2">{contact.phone}</p>
          <p className="text-xs text-muted mt-2">{contact.location}</p>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-edge/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-muted">{footer.copyright}</p>
        <p className="text-xs text-muted">{footer.credits}</p>
      </div>
    </footer>
  );
}
