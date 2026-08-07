const img = (id, w = 1200) => `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

const DJ_PORTRAIT = "photo-1516873240891-4bf014598ab4";
const DJ_BOOTH = "photo-1470225620780-dba8ba36b745";

const PHOTO_IDS = {
  boda: [
    "photo-1583939411023-14783179e581",
    "photo-1482575832494-771f74bf6857",
    "photo-1629219219925-ea8de62f2d68",
    "photo-1639330693395-0944b5bef0c7",
    "photo-1614267468123-e35653e4a632",
    "photo-1613256253373-352901921b9c",
  ],
  festival: [
    "photo-1533174072545-7a4b6ad7a6c3",
    "photo-1470229722913-7c0e2dbbafd3",
    "photo-1603190287605-e6ade32fa852",
    "photo-1619229725920-ac8b63b0631a",
    "photo-1459749411175-04bf5292ceea",
    "photo-1501386761578-eac5c94b800a",
  ],
  antro: [
    "photo-1545128485-c400e7702796",
    "photo-1574155376612-bfa4ed8aabfd",
    "photo-1544785316-6e58aed68a50",
    "photo-1578736641330-3155e606cd40",
    "photo-1687511844598-165c1fc387cc",
    DJ_BOOTH,
  ],
  corporativo: [
    "photo-1531058020387-3be344556be6",
    "photo-1545150665-c72a8f0cf311",
    "photo-1651065698373-f310e3b99326",
    "photo-1603985863797-97ded9ac5eda",
    "photo-1556125574-d7f27ec36a06",
  ],
};

const buildGalleries = (titles, altText) =>
  Object.entries(PHOTO_IDS).map(([key, ids], gi) => ({
    id: key,
    title: titles[key],
    downloadable: true,
    images: ids.map((photoId, i) => ({
      id: `${key}-${i}`,
      url: img(photoId),
      alt: `${altText} — ${titles[key]}`,
    })),
  }));

export const defaultContent = {
  es: {
    meta: {
      title: "Pastrana Events | DJ · Productor · Live Sets",
    },
    nav: {
      links: [
        { key: "historia", label: "HISTORIA" },
        { key: "generos", label: "GÉNEROS" },
        { key: "galeria", label: "GALERÍA" },
        { key: "paquetes", label: "PAQUETES" },
        { key: "reservar", label: "RESERVAR" },
      ],
      cta: "RESERVAR FECHA",
    },
    hero: {
      label: "[ DJ · PRODUCTOR · LIVE SETS ]",
      words: ["SIENTE", "EL", "RITMO"],
      subheading: "Bodas · Antros · Festivales · Eventos Corporativos",
      ctas: [
        { id: "cta-1", label: "RESERVAR FECHA", href: "#reservar", style: "primary" },
        { id: "cta-2", label: "VER PAQUETES", href: "#paquetes", style: "secondary" },
      ],
      stats: [
        { id: "stat-1", value: "+150", label: "SHOWS" },
        { id: "stat-2", value: "+20", label: "AÑOS" },
        { id: "stat-3", value: "+20", label: "CIUDADES" },
      ],
      location: "SANTA BARBARA, CA",
      photoUrl:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600&auto=format&fit=crop",
    },
    bio: {
      label: "[ 01 ] HISTORIA",
      headingLine1: "Música que",
      headingLine2: "mueve masas",
      paragraph1:
        "Pastrana Events es una empresa líder de DJ y entretenimiento bilingüe que atiende con orgullo la Costa Central de California. Nos especializamos en bodas, eventos corporativos, quinceañeras, fiestas privadas y otras celebraciones especiales, ofreciendo un entretenimiento excepcional adaptado a la visión única de cada cliente.",
      paragraph2:
        "Desde recepciones elegantes y sofisticadas hasta celebraciones llenas de energía, ofrecemos música personalizada, sonido premium, iluminación profesional y una coordinación impecable del evento para crear una experiencia inolvidable de principio a fin. Con más de 20 años de experiencia en la industria del entretenimiento, nuestro compromiso es superar las expectativas creando momentos memorables que tú y tus invitados atesorarán por años.",
      ctaText: "RESERVAR FECHA →",
      badgeText: "Disponible para tu evento",
      photoUrl: img(DJ_PORTRAIT),
    },
    genres: {
      label: "[ 02 ] GÉNEROS",
      headingLine1: "SETS &",
      headingLine2: "GÉNEROS",
      subheading: "Cada evento es único. Cada set, irrepetible.",
      items: [
        { icon: "Music", name: "HOUSE", desc: "Progressive · Tech · Deep" },
        { icon: "Radio", name: "REGGAETÓN", desc: "Old School · New Era" },
        { icon: "Mic2", name: "HIP HOP", desc: "Latin · Trap" },
        { icon: "Headphones", name: "ELECTRÓNICA", desc: "EDM · Techno · Trance" },
        { icon: "Waves", name: "POP LATINO", desc: "Hits · Mashups" },
        { icon: "Star", name: "SHOW LIVE", desc: "Sets en vivo · Fusión" },
      ],
    },
    stats: {
      items: [
        { value: "150", label: "Eventos realizados", isPercent: false },
        { value: "20", label: "Años de experiencia", isPercent: false },
        { value: "20", label: "Ciudades", isPercent: false },
        { value: "100", label: "Clientes satisfechos", isPercent: true },
      ],
    },
    gallery: {
      label: "[ 03 ] GALERÍA",
      heading: "GALERÍA",
      subheading: "Momentos que definen cada evento",
      ctaAll: "VER TODAS LAS GALERÍAS",
      viewFull: "Ver galería completa",
      downloadLabel: "Descargar galería (ZIP)",
      downloadingLabel: "Preparando ZIP…",
      downloadErrorLabel: "No se pudo descargar. Intenta de nuevo.",
      galleries: buildGalleries(
        { boda: "Bodas", festival: "Festivales", antro: "Antros & Clubs", corporativo: "Eventos Corporativos" },
        "Foto de evento de Pastrana Events"
      ),
    },
    testimonials: {
      label: "[ 04 ] TESTIMONIOS",
      headingLine1: "LO QUE DICEN",
      headingLine2: "LOS CLIENTES",
      items: [
        {
          quote:
            "Pastrana Events convirtió nuestra boda en una experiencia que nuestros invitados siguen recordando. Leyeron perfectamente el ambiente en todo momento.",
          name: "María G.",
          role: "Organizadora de bodas",
          rating: 5,
        },
        {
          quote:
            "Contratar a Pastrana Events para nuestro evento corporativo fue la mejor decisión. Profesionales, puntuales y con una energía increíble.",
          name: "Carlos R.",
          role: "Director de Marketing",
          rating: 5,
        },
        {
          quote:
            "¡Hizo que mi fiesta fuera un sueño! Todos bailaron toda la noche, exactamente lo que quería.",
          name: "Laura M.",
          role: "Quinceañera",
          rating: 5,
        },
        {
          quote:
            "Llevamos 3 temporadas trabajando juntos. El público siempre vuelve cuando Pastrana Events está en la cabina.",
          name: "Diego A.",
          role: "Promotor de antro",
          rating: 5,
        },
        {
          quote:
            "Puntual, flexible y con una selección musical impecable. Lo recomendamos a todos nuestros clientes.",
          name: "Ana P.",
          role: "Coordinadora de eventos",
          rating: 5,
        },
      ],
      formLabel: "[ DEJA TU RECOMENDACIÓN ]",
      formTitle: "Comparte tu experiencia",
      ratingLabel: "Tu calificación",
      nameLabel: "Tu nombre",
      messageLabel: "Tu recomendación",
      submitText: "Enviar recomendación",
      submittedTitle: "¡Gracias por tu recomendación!",
      submittedText: "La revisaremos y se publicará en el sitio muy pronto.",
      ctaButton: "DEJAR RECOMENDACIÓN",
      verifiedClient: "Cliente verificado",
    },
    packages: {
      label: "[ 05 ] PAQUETES",
      headingLine1: "Elige tu",
      headingLine2: "paquete",
      subheading: "Cada paquete se adapta a las necesidades de tu evento.",
      totalLabel: "Total",
      footnote: "*** Cada paquete es negociable, ajustado a tus necesidades.",
      items: [
        {
          id: "essential",
          number: "01",
          title: "Paquete Esencial",
          total: "$1,100",
          features: [
            "DJ y MC",
            "Equipo (2–3 bocinas)",
            "Instalación y desmontaje",
            "Viáticos y tarifas",
            "4 horas de servicio (cada hora extra $200)",
            "Sin luces incluidas",
          ],
        },
        {
          id: "preferred",
          number: "02",
          title: "Paquete Preferido — Elección del Público",
          total: "$1,900",
          features: [
            "Paquete Esencial + 2 subwoofers (mejor calidad de sonido)",
            "DJ y MC",
            "Iluminación de pista de baile",
            "Iluminación perimetral en todo el lugar",
            "Máquina de humo",
            "6 horas de servicio (cada hora extra $200)",
          ],
        },
        {
          id: "ultimate",
          number: "03",
          title: "Paquete Ultimate — Gran Recinto",
          total: "$3,900",
          features: [
            "Todo lo del paquete Esencial y Preferido",
            "Presentación de fotos (proyector y pantalla incluidos)",
            "Efecto 'Bailando en las nubes'",
            "Máquinas de chispas frías",
            "8 horas de servicio (cada hora extra $200)",
          ],
        },
      ],
    },
    terms: {
      label: "[ 06 ] TÉRMINOS Y CONDICIONES",
      headingLine1: "Términos y",
      headingLine2: "condiciones",
      subheading: "Lo importante, en claro, antes de reservar tu fecha.",
      acceptanceNote: "Al reservar, aceptas nuestros",
      linkLabel: "Términos y Condiciones",
      items: [
        {
          id: "services",
          number: "01",
          title: "Servicios",
          body: "Pastrana Events proporcionará los servicios seleccionados en la página 1 para la fecha, hora y ubicación del evento indicadas en este acuerdo.",
        },
        {
          id: "payment",
          number: "02",
          title: "Pago",
          body: "El depósito / anticipo se paga al firmar este acuerdo y reserva la fecha. El saldo restante se debe pagar a más tardar el día del evento, salvo que ambas partes acuerden otra fecha por escrito.",
        },
        {
          id: "changes",
          number: "03",
          title: "Cambios y tiempo extra",
          body: "Cualquier cambio en las horas, ubicación, servicios o equipo debe aprobarse con anticipación. El tiempo de servicio adicional se cobra a la tarifa por hora acordada.",
        },
        {
          id: "venue",
          number: "04",
          title: "Acceso y montaje en el lugar",
          body: "El cliente proporcionará acceso razonable para el montaje y desmontaje, un área de trabajo segura, energía eléctrica cercana, y cualquier permiso, estacionamiento o instrucciones de carga y descarga necesarias del recinto.",
        },
        {
          id: "cancellations",
          number: "05",
          title: "Cancelaciones / reprogramaciones",
          body: "Por favor notifica a Pastrana Events lo antes posible. Los depósitos / anticipos no son reembolsables. Una fecha reprogramada está sujeta a disponibilidad y a cualquier costo adicional acordado por ambas partes.",
        },
        {
          id: "safety",
          number: "06",
          title: "Seguridad y circunstancias imprevistas",
          body: "Pastrana Events puede pausar o finalizar el servicio cuando las condiciones sean inseguras, las reglas del recinto impidan la presentación, o circunstancias fuera del control razonable de cualquiera de las partes hagan el evento imposible o inseguro.",
        },
        {
          id: "music",
          number: "07",
          title: "Música y peticiones",
          body: "El cliente puede compartir peticiones musicales y anuncios especiales antes del evento. Pastrana Events hará esfuerzos razonables por atenderlos, sujeto a disponibilidad y a que sean apropiados para el evento.",
        },
      ],
    },
    booking: {
      label: "[ RESERVA TU FECHA ]",
      headingLine1: "¿Tienes un",
      headingLine2: "evento en mente?",
      subheading: "Bodas · Antros · Festivales · Corporativos · Privados",
      ctaText: "RESERVAR AHORA →",
      note: "Respuesta en menos de 24 horas",
      whatsappLabel: "💬 WHATSAPP",
      smsLabel: "📱 SMS",
      emailLabel: "📧 CORREO",
      formTitle: "Cuéntanos de tu evento",
      formSubtitle: "Llena el formulario y te contactamos para confirmar tu fecha.",
      fields: {
        name: "Nombre completo",
        phone: "Teléfono",
        email: "Correo (opcional)",
        eventType: "Tipo de evento",
        eventDate: "Fecha del evento",
        location: "Dirección o lugar del evento",
        guests: "Número de invitados (opcional)",
        packageInterest: "Paquete de tu interés (opcional)",
        details: "Cuéntanos más detalles",
      },
      packageNotSure: "Aún no lo sé / personalizado",
      eventTypes: ["Boda", "Antro / Club", "Festival", "Corporativo", "Privado", "Otro"],
      submitText: "Continuar",
      successTitle: "¡Listo! Elige cómo enviar tu solicitud",
      sendWhatsapp: "Enviar por WhatsApp",
      sendSms: "Enviar por SMS",
      sendEmail: "Enviar por correo",
      closeText: "Cerrar",
    },
    contact: {
      email: "contacto@pastranaevents.com",
      phone: "+52 (000) 000-0000",
      whatsappNumber: "525500000000",
      smsNumber: "+525500000000",
      location: "Disponible en Santa Barbara y la Costa Central de California",
    },
    socials: {
      instagram: "https://instagram.com/pastranaevents",
      facebook: "#",
      tiktok: "#",
    },
    footer: {
      tagline: "DJ · Productor · Live Sets",
      navLabel: "NAVEGACIÓN",
      contactLabel: "CONTACTO",
      copyright: "© 2025 Pastrana Events. Todos los derechos reservados.",
      credits: "Diseño y desarrollo por [Tu nombre/estudio]",
    },
    bottomNav: {
      cta: "RESERVAR FECHA",
    },
  },
  en: {
    meta: {
      title: "Pastrana Events | DJ · Producer · Live Sets",
    },
    nav: {
      links: [
        { key: "historia", label: "STORY" },
        { key: "generos", label: "GENRES" },
        { key: "galeria", label: "GALLERY" },
        { key: "paquetes", label: "PACKAGES" },
        { key: "reservar", label: "BOOK NOW" },
      ],
      cta: "BOOK YOUR DATE",
    },
    hero: {
      label: "[ DJ · PRODUCER · LIVE SETS ]",
      words: ["FEEL", "THE", "BEAT"],
      subheading: "Weddings · Clubs · Festivals · Corporate Events",
      ctas: [
        { id: "cta-1", label: "BOOK YOUR DATE", href: "#reservar", style: "primary" },
        { id: "cta-2", label: "SEE PACKAGES", href: "#paquetes", style: "secondary" },
      ],
      stats: [
        { id: "stat-1", value: "+150", label: "SHOWS" },
        { id: "stat-2", value: "+20", label: "YEARS" },
        { id: "stat-3", value: "+20", label: "CITIES" },
      ],
      location: "SANTA BARBARA, CA",
      photoUrl:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600&auto=format&fit=crop",
    },
    bio: {
      label: "[ 01 ] STORY",
      headingLine1: "Music that",
      headingLine2: "moves crowds",
      paragraph1:
        "Pastrana Events is a premier bilingual DJ and entertainment company proudly serving California's Central Coast. We specialize in weddings, corporate events, quinceañeras, private parties, and other special celebrations, delivering exceptional entertainment tailored to each client's unique vision.",
      paragraph2:
        "From elegant, sophisticated receptions to high-energy celebrations, we provide customized music, premium sound, professional lighting, and seamless event coordination to create an unforgettable experience from start to finish. With more than 20 years of experience in the entertainment industry, our commitment is to exceed expectations by creating memorable moments that you and your guests will cherish for years to come.",
      ctaText: "BOOK YOUR DATE →",
      badgeText: "Available for your event",
      photoUrl: img(DJ_PORTRAIT),
    },
    genres: {
      label: "[ 02 ] GENRES",
      headingLine1: "SETS &",
      headingLine2: "GENRES",
      subheading: "Every event is unique. Every set, unrepeatable.",
      items: [
        { icon: "Music", name: "HOUSE", desc: "Progressive · Tech · Deep" },
        { icon: "Radio", name: "REGGAETON", desc: "Old School · New Era" },
        { icon: "Mic2", name: "HIP HOP", desc: "Latin · Trap" },
        { icon: "Headphones", name: "ELECTRONIC", desc: "EDM · Techno · Trance" },
        { icon: "Waves", name: "LATIN POP", desc: "Hits · Mashups" },
        { icon: "Star", name: "LIVE SHOW", desc: "Live sets · Fusion" },
      ],
    },
    stats: {
      items: [
        { value: "150", label: "Events performed", isPercent: false },
        { value: "20", label: "Years of experience", isPercent: false },
        { value: "20", label: "Cities", isPercent: false },
        { value: "100", label: "Satisfied clients", isPercent: true },
      ],
    },
    gallery: {
      label: "[ 03 ] GALLERY",
      heading: "GALLERY",
      subheading: "Moments that define every event",
      ctaAll: "VIEW ALL GALLERIES",
      viewFull: "View full gallery",
      downloadLabel: "Download gallery (ZIP)",
      downloadingLabel: "Preparing ZIP…",
      downloadErrorLabel: "Couldn't download. Please try again.",
      galleries: buildGalleries(
        { boda: "Weddings", festival: "Festivals", antro: "Clubs & Nightlife", corporativo: "Corporate Events" },
        "Photo from a Pastrana Events event"
      ),
    },
    testimonials: {
      label: "[ 04 ] TESTIMONIALS",
      headingLine1: "WHAT CLIENTS",
      headingLine2: "ARE SAYING",
      items: [
        {
          quote:
            "Pastrana Events turned our wedding into an experience our guests still talk about. They read the room perfectly the entire night.",
          name: "María G.",
          role: "Wedding planner",
          rating: 5,
        },
        {
          quote:
            "Booking Pastrana Events for our corporate event was the best decision. Professional, punctual and with incredible energy.",
          name: "Carlos R.",
          role: "Marketing Director",
          rating: 5,
        },
        {
          quote:
            "He made my party a dream! Everyone danced all night, exactly what I wanted.",
          name: "Laura M.",
          role: "Quinceañera",
          rating: 5,
        },
        {
          quote:
            "We've worked together for 3 seasons now. The crowd always comes back when Pastrana Events is in the booth.",
          name: "Diego A.",
          role: "Club promoter",
          rating: 5,
        },
        {
          quote:
            "Punctual, flexible and with an impeccable music selection. We recommend him to all our clients.",
          name: "Ana P.",
          role: "Event coordinator",
          rating: 5,
        },
      ],
      formLabel: "[ LEAVE YOUR REVIEW ]",
      formTitle: "Share your experience",
      ratingLabel: "Your rating",
      nameLabel: "Your name",
      messageLabel: "Your review",
      submitText: "Submit review",
      submittedTitle: "Thanks for your review!",
      submittedText: "We'll review it and publish it on the site soon.",
      ctaButton: "LEAVE A REVIEW",
      verifiedClient: "Verified client",
    },
    packages: {
      label: "[ 05 ] PACKAGES",
      headingLine1: "Choose your",
      headingLine2: "package",
      subheading: "Every package is tailored to the needs of your event.",
      totalLabel: "Total",
      footnote: "*** Every package is negotiable, suitable for your needs.",
      items: [
        {
          id: "essential",
          number: "01",
          title: "Essential Package",
          total: "$1,100",
          features: [
            "DJ and MC",
            "Equipment (2–3 speakers)",
            "Setup + breakdown",
            "Travel and fees",
            "4 hours of service (each additional hour is $200)",
            "No lights included",
          ],
        },
        {
          id: "preferred",
          number: "02",
          title: "People's Choice Preferred Package",
          total: "$1,900",
          features: [
            "Essential Package + 2 sub speakers (for better sound quality)",
            "DJ and MC",
            "Dance floor lighting",
            "Up lighting all around the venue",
            "Fog machine",
            "6 hours of service (each additional hour is $200)",
          ],
        },
        {
          id: "ultimate",
          number: "03",
          title: "Large Venue Ultimate Package",
          total: "$3,900",
          features: [
            "All the Essentials and Preferred Package",
            "Picture slide show (projector and screen included)",
            "Dancing in the Clouds effect",
            "Cold spark machines",
            "8 hours of service (each additional hour is $200)",
          ],
        },
      ],
    },
    terms: {
      label: "[ 06 ] TERMS & CONDITIONS",
      headingLine1: "Terms &",
      headingLine2: "conditions",
      subheading: "The important stuff, made clear, before you book your date.",
      acceptanceNote: "By booking, you agree to our",
      linkLabel: "Terms & Conditions",
      items: [
        {
          id: "services",
          number: "01",
          title: "Services",
          body: "Pastrana Events will provide the services selected on page 1 for the event date, time, and location listed in this agreement.",
        },
        {
          id: "payment",
          number: "02",
          title: "Payment",
          body: "The deposit / retainer is due when this agreement is signed and reserves the date. The remaining balance is due no later than the event date unless both parties agree in writing to another date.",
        },
        {
          id: "changes",
          number: "03",
          title: "Changes & extra time",
          body: "Any change to the hours, location, services, or equipment must be approved in advance. Additional service time is billed at the agreed hourly rate.",
        },
        {
          id: "venue",
          number: "04",
          title: "Venue access & setup",
          body: "The client will provide reasonable access for setup and breakdown, a safe work area, nearby electrical power, and any required venue permissions, parking, or load-in instructions.",
        },
        {
          id: "cancellations",
          number: "05",
          title: "Cancellations / rescheduling",
          body: "Please notify Pastrana Events as soon as possible. Deposits / retainers are not refundable. A rescheduled date is subject to availability and any additional cost agreed by both parties.",
        },
        {
          id: "safety",
          number: "06",
          title: "Safety & unforeseen circumstances",
          body: "Pastrana Events may pause or end services when conditions are unsafe, venue rules prevent performance, or circumstances outside either party's reasonable control make the event impossible or unsafe.",
        },
        {
          id: "music",
          number: "07",
          title: "Music & requests",
          body: "The client may share music requests and special announcements before the event. Pastrana Events will make reasonable efforts to accommodate them, subject to availability and appropriateness for the event.",
        },
      ],
    },
    booking: {
      label: "[ BOOK YOUR DATE ]",
      headingLine1: "Have an event",
      headingLine2: "in mind?",
      subheading: "Weddings · Clubs · Festivals · Corporate · Private",
      ctaText: "BOOK NOW →",
      note: "Response in less than 24 hours",
      whatsappLabel: "💬 WHATSAPP",
      smsLabel: "📱 SMS",
      emailLabel: "📧 EMAIL",
      formTitle: "Tell us about your event",
      formSubtitle: "Fill out the form and we'll reach out to confirm your date.",
      fields: {
        name: "Full name",
        phone: "Phone",
        email: "Email (optional)",
        eventType: "Event type",
        eventDate: "Event date",
        location: "Event address or venue",
        guests: "Number of guests (optional)",
        packageInterest: "Package you're interested in (optional)",
        details: "Tell us more details",
      },
      packageNotSure: "Not sure yet / custom",
      eventTypes: ["Wedding", "Club", "Festival", "Corporate", "Private", "Other"],
      submitText: "Continue",
      successTitle: "All set! Choose how to send your request",
      sendWhatsapp: "Send via WhatsApp",
      sendSms: "Send via SMS",
      sendEmail: "Send via email",
      closeText: "Close",
    },
    contact: {
      email: "contacto@pastranaevents.com",
      phone: "+52 (000) 000-0000",
      whatsappNumber: "525500000000",
      smsNumber: "+525500000000",
      location: "Available throughout Santa Barbara and the Central Coast",
    },
    socials: {
      instagram: "https://instagram.com/pastranaevents",
      facebook: "#",
      tiktok: "#",
    },
    footer: {
      tagline: "DJ · Producer · Live Sets",
      navLabel: "NAVIGATION",
      contactLabel: "CONTACT",
      copyright: "© 2025 Pastrana Events. All rights reserved.",
      credits: "Design and development by [Your name/studio]",
    },
    bottomNav: {
      cta: "BOOK YOUR DATE",
    },
  },
};

export const defaultSettings = {
  defaultTheme: "light",
  accent: "#8B31FF",
  accentDim: "#6B1FDF",
  font: "Inter",
};

export const FONT_OPTIONS = [
  { id: "Inter", label: "Inter", stack: "'Inter', system-ui, sans-serif" },
  { id: "Poppins", label: "Poppins", stack: "'Poppins', system-ui, sans-serif" },
  { id: "Montserrat", label: "Montserrat", stack: "'Montserrat', system-ui, sans-serif" },
  { id: "Playfair Display", label: "Playfair Display", stack: "'Playfair Display', serif" },
];

export const ICON_KEYS = ["Music", "Radio", "Mic2", "Headphones", "Waves", "Star", "Disc3"];
