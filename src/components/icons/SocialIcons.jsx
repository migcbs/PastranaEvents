// lucide-react ya no incluye iconos de marca (Instagram, Facebook, TikTok,
// etc.) por temas de licencia. Estos son iconos de línea propios, minimales,
// consistentes con el resto del set de iconos del sitio.

export function InstagramIcon({ size = 16, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function FacebookIcon({ size = 16, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M14.5 8.5h2V5.5h-2c-2.2 0-4 1.8-4 4v2h-2v3h2v6.5h3V14.5h2.4l.6-3h-3V9.5c0-.6.4-1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TikTokIcon({ size = 16, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M14 4v10.2a2.8 2.8 0 1 1-2.4-2.77M14 4c.3 2 1.7 3.4 3.7 3.6M14 4h-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
