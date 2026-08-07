import { useEffect, useState } from "react";
import { useSiteConfig } from "../context/SiteConfigContext";
import { useLeads } from "../context/LeadsContext";
import { useTestimonialsData } from "../context/TestimonialsDataContext";
import { FONT_OPTIONS, ICON_KEYS } from "../context/defaultContent";
import { translateSection } from "../utils/autoTranslateSection";
import {
  TextInput,
  TextArea,
  SelectInput,
  ColorInput,
  ImageInput,
  SectionCard,
  ListToolbar,
  RemoveButton,
} from "./FormFields";

function useDraft(lang, sectionKey) {
  const { content, updateSection, resetSection } = useSiteConfig();
  const [draft, setDraft] = useState(content[lang][sectionKey]);
  const [saved, setSaved] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState(false);

  useEffect(() => {
    setDraft(content[lang][sectionKey]);
  }, [lang, sectionKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = () => {
    const changed = JSON.stringify(draft) !== JSON.stringify(content[lang][sectionKey]);
    updateSection(lang, sectionKey, draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);

    // Sin importar en qué idioma se edite, el otro idioma se traduce y
    // sincroniza automáticamente (misma estructura, texto traducido). Si no
    // hubo cambios reales, no vale la pena volver a traducir (evita degradar
    // una traducción ya buena con una nueva pasada innecesaria).
    if (!changed) return;
    const otherLang = lang === "es" ? "en" : "es";
    setTranslating(true);
    setTranslateError(false);
    translateSection(draft, lang, otherLang)
      .then((translated) => updateSection(otherLang, sectionKey, translated))
      .catch(() => setTranslateError(true))
      .finally(() => setTranslating(false));
  };

  const reset = () => {
    resetSection(lang, sectionKey);
  };

  return { draft, setDraft, save, reset, saved, translating, translateError };
}

export function AppearanceSection() {
  const { content, updateSettings } = useSiteConfig();
  const [draft, setDraft] = useState(content.settings);
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateSettings(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <SectionCard
      title="Apariencia"
      description="Colores, tipografía y tema por defecto de todo el sitio"
      onSave={save}
      onReset={() => setDraft(content.settings)}
      saved={saved}
    >
      <SelectInput
        label="Tema por defecto"
        value={draft.defaultTheme}
        onChange={(v) => setDraft({ ...draft, defaultTheme: v })}
        options={[
          { value: "light", label: "Claro" },
          { value: "dark", label: "Oscuro" },
        ]}
      />
      <SelectInput
        label="Tipografía"
        value={draft.font}
        onChange={(v) => setDraft({ ...draft, font: v })}
        options={FONT_OPTIONS.map((f) => ({ value: f.id, label: f.label }))}
      />
      <ColorInput label="Color de acento" value={draft.accent} onChange={(v) => setDraft({ ...draft, accent: v })} />
      <ColorInput
        label="Color de acento (hover/dim)"
        value={draft.accentDim}
        onChange={(v) => setDraft({ ...draft, accentDim: v })}
      />
    </SectionCard>
  );
}

export function HeroSectionAdmin({ lang }) {
  const { draft, setDraft, save, reset, saved, translating, translateError } = useDraft(lang, "hero");
  if (!draft) return null;

  const setWord = (i, val) => {
    const words = [...draft.words];
    words[i] = val;
    setDraft({ ...draft, words });
  };
  const setStat = (i, field, val) => {
    const stats = draft.stats.map((s, idx) => (idx === i ? { ...s, [field]: val } : s));
    setDraft({ ...draft, stats });
  };
  const removeStat = (i) => setDraft({ ...draft, stats: draft.stats.filter((_, idx) => idx !== i) });
  const addStat = () =>
    setDraft({ ...draft, stats: [...draft.stats, { id: `stat-${Date.now()}`, value: "+0", label: "NUEVO" }] });

  const setCta = (i, field, val) => {
    const ctas = draft.ctas.map((c, idx) => (idx === i ? { ...c, [field]: val } : c));
    setDraft({ ...draft, ctas });
  };
  const removeCta = (i) => setDraft({ ...draft, ctas: draft.ctas.filter((_, idx) => idx !== i) });
  const addCta = () =>
    setDraft({
      ...draft,
      ctas: [...draft.ctas, { id: `cta-${Date.now()}`, label: "NUEVO BOTÓN", href: "#reservar", style: "secondary" }],
    });

  return (
    <SectionCard title="Hero (portada)" onSave={save} onReset={reset} saved={saved} translating={translating} translateError={translateError}>
      <TextInput label="Etiqueta" value={draft.label} onChange={(v) => setDraft({ ...draft, label: v })} full />
      <TextInput label="Palabra 1" value={draft.words[0]} onChange={(v) => setWord(0, v)} />
      <TextInput label="Palabra 2" value={draft.words[1]} onChange={(v) => setWord(1, v)} />
      <TextInput label="Palabra 3" value={draft.words[2]} onChange={(v) => setWord(2, v)} />
      <TextInput
        label="Subtítulo"
        value={draft.subheading}
        onChange={(v) => setDraft({ ...draft, subheading: v })}
        full
      />
      <TextInput label="Ubicación / fecha" value={draft.location} onChange={(v) => setDraft({ ...draft, location: v })} full />

      <div className="sm:col-span-2 flex flex-col gap-2">
        <span className="text-[11px] font-mono tracking-widest uppercase text-muted">Botones del hero</span>
        {draft.ctas.map((cta, i) => (
          <div key={cta.id} className="flex items-end gap-2 bg-surface-2 rounded-xl p-3">
            <TextInput label="Texto" value={cta.label} onChange={(v) => setCta(i, "label", v)} />
            <TextInput label="Enlace (ej. #reservar)" value={cta.href} onChange={(v) => setCta(i, "href", v)} />
            <SelectInput
              label="Estilo"
              value={cta.style}
              onChange={(v) => setCta(i, "style", v)}
              options={[
                { value: "primary", label: "Relleno (primario)" },
                { value: "secondary", label: "Contorno (secundario)" },
              ]}
            />
            <RemoveButton onClick={() => removeCta(i)} />
          </div>
        ))}
        <ListToolbar onAdd={addCta} label="Agregar botón" />
      </div>

      <div className="sm:col-span-2 flex flex-col gap-2">
        <span className="text-[11px] font-mono tracking-widest uppercase text-muted">
          Pastillas de estadísticas (a la derecha del hero)
        </span>
        {draft.stats.map((stat, i) => (
          <div key={stat.id} className="flex items-end gap-2 bg-surface-2 rounded-xl p-3">
            <TextInput label="Valor" value={stat.value} onChange={(v) => setStat(i, "value", v)} />
            <TextInput label="Etiqueta" value={stat.label} onChange={(v) => setStat(i, "label", v)} full />
            <RemoveButton onClick={() => removeStat(i)} />
          </div>
        ))}
        <ListToolbar onAdd={addStat} label="Agregar estadística" />
      </div>

      <div className="sm:col-span-2">
        <ImageInput
          label="Fotografía de fondo (DJ)"
          value={draft.photoUrl}
          onChangeUrl={(v) => setDraft({ ...draft, photoUrl: v })}
        />
      </div>
    </SectionCard>
  );
}

export function BioSectionAdmin({ lang }) {
  const { draft, setDraft, save, reset, saved, translating, translateError } = useDraft(lang, "bio");
  if (!draft) return null;

  return (
    <SectionCard title="Historia / Bio" onSave={save} onReset={reset} saved={saved} translating={translating} translateError={translateError}>
      <TextInput label="Etiqueta" value={draft.label} onChange={(v) => setDraft({ ...draft, label: v })} full />
      <TextInput label="Título línea 1" value={draft.headingLine1} onChange={(v) => setDraft({ ...draft, headingLine1: v })} />
      <TextInput label="Título línea 2" value={draft.headingLine2} onChange={(v) => setDraft({ ...draft, headingLine2: v })} />
      <TextArea label="Párrafo 1" value={draft.paragraph1} onChange={(v) => setDraft({ ...draft, paragraph1: v })} full />
      <TextArea label="Párrafo 2" value={draft.paragraph2} onChange={(v) => setDraft({ ...draft, paragraph2: v })} full />
      <TextInput label="Texto del enlace" value={draft.ctaText} onChange={(v) => setDraft({ ...draft, ctaText: v })} />
      <TextInput label="Texto insignia" value={draft.badgeText} onChange={(v) => setDraft({ ...draft, badgeText: v })} />
      <div className="sm:col-span-2">
        <ImageInput label="Foto del DJ" value={draft.photoUrl} onChangeUrl={(v) => setDraft({ ...draft, photoUrl: v })} />
      </div>
    </SectionCard>
  );
}

export function GenresSectionAdmin({ lang }) {
  const { draft, setDraft, save, reset, saved, translating, translateError } = useDraft(lang, "genres");
  if (!draft) return null;

  const updateItem = (i, field, val) => {
    const items = draft.items.map((it, idx) => (idx === i ? { ...it, [field]: val } : it));
    setDraft({ ...draft, items });
  };
  const removeItem = (i) => setDraft({ ...draft, items: draft.items.filter((_, idx) => idx !== i) });
  const addItem = () =>
    setDraft({ ...draft, items: [...draft.items, { icon: "Music", name: "NUEVO GÉNERO", desc: "Descripción" }] });

  return (
    <SectionCard title="Géneros" onSave={save} onReset={reset} saved={saved} translating={translating} translateError={translateError}>
      <TextInput label="Etiqueta" value={draft.label} onChange={(v) => setDraft({ ...draft, label: v })} full />
      <TextInput label="Título línea 1" value={draft.headingLine1} onChange={(v) => setDraft({ ...draft, headingLine1: v })} />
      <TextInput label="Título línea 2" value={draft.headingLine2} onChange={(v) => setDraft({ ...draft, headingLine2: v })} />
      <TextInput label="Subtítulo" value={draft.subheading} onChange={(v) => setDraft({ ...draft, subheading: v })} full />

      <div className="sm:col-span-2 flex flex-col gap-3">
        {draft.items.map((item, i) => (
          <div key={i} className="flex items-end gap-2 bg-surface-2 rounded-xl p-3">
            <SelectInput
              label="Icono"
              value={item.icon}
              onChange={(v) => updateItem(i, "icon", v)}
              options={ICON_KEYS}
            />
            <TextInput label="Nombre" value={item.name} onChange={(v) => updateItem(i, "name", v)} />
            <TextInput label="Descripción" value={item.desc} onChange={(v) => updateItem(i, "desc", v)} />
            <RemoveButton onClick={() => removeItem(i)} />
          </div>
        ))}
        <ListToolbar onAdd={addItem} label="Agregar género" />
      </div>
    </SectionCard>
  );
}

export function StatsSectionAdmin({ lang }) {
  const { draft, setDraft, save, reset, saved, translating, translateError } = useDraft(lang, "stats");
  if (!draft) return null;

  const updateItem = (i, field, val) => {
    const items = draft.items.map((it, idx) => (idx === i ? { ...it, [field]: val } : it));
    setDraft({ ...draft, items });
  };

  return (
    <SectionCard title="Estadísticas" onSave={save} onReset={reset} saved={saved} translating={translating} translateError={translateError}>
      {draft.items.map((item, i) => (
        <div key={i} className="flex items-end gap-2 bg-surface-2 rounded-xl p-3 sm:col-span-2">
          <TextInput label="Valor" value={item.value} onChange={(v) => updateItem(i, "value", v)} />
          <TextInput label="Etiqueta" value={item.label} onChange={(v) => updateItem(i, "label", v)} full />
          <label className="flex items-center gap-2 text-[11px] font-mono uppercase text-muted flex-shrink-0 pb-2">
            <input
              type="checkbox"
              checked={item.isPercent}
              onChange={(e) => updateItem(i, "isPercent", e.target.checked)}
            />
            %
          </label>
        </div>
      ))}
    </SectionCard>
  );
}

export function GallerySectionAdmin({ lang }) {
  const { draft, setDraft, save, reset, saved, translating, translateError } = useDraft(lang, "gallery");
  const [activeGalleryId, setActiveGalleryId] = useState(null);
  if (!draft) return null;

  const galleries = draft.galleries || [];
  const activeGallery = galleries.find((g) => g.id === activeGalleryId) || galleries[0];

  const updateGalleryField = (galleryId, field, val) => {
    setDraft({
      ...draft,
      galleries: galleries.map((g) => (g.id === galleryId ? { ...g, [field]: val } : g)),
    });
  };

  const addGallery = () => {
    const id = `gallery-${Date.now()}`;
    setDraft({
      ...draft,
      galleries: [...galleries, { id, title: "Nueva galería", images: [] }],
    });
    setActiveGalleryId(id);
  };

  const removeGallery = (galleryId) => {
    setDraft({ ...draft, galleries: galleries.filter((g) => g.id !== galleryId) });
    if (activeGalleryId === galleryId) setActiveGalleryId(null);
  };

  const updateImage = (galleryId, i, field, val) => {
    setDraft({
      ...draft,
      galleries: galleries.map((g) =>
        g.id === galleryId
          ? { ...g, images: g.images.map((img, idx) => (idx === i ? { ...img, [field]: val } : img)) }
          : g
      ),
    });
  };

  const removeImage = (galleryId, i) => {
    setDraft({
      ...draft,
      galleries: galleries.map((g) =>
        g.id === galleryId ? { ...g, images: g.images.filter((_, idx) => idx !== i) } : g
      ),
    });
  };

  const addImage = (galleryId) => {
    setDraft({
      ...draft,
      galleries: galleries.map((g) =>
        g.id === galleryId
          ? { ...g, images: [...g.images, { id: `gal-${Date.now()}`, url: "", alt: "Foto de evento" }] }
          : g
      ),
    });
  };

  return (
    <SectionCard
      title="Galerías de fotos"
      description="Cada galería representa un evento (boda, festival, antro, corporativo...). Los visitantes las ven como historias tipo Instagram."
      onSave={save}
      onReset={reset}
      saved={saved}
      translating={translating}
      translateError={translateError}
    >
      <TextInput label="Etiqueta de sección" value={draft.label} onChange={(v) => setDraft({ ...draft, label: v })} full />
      <TextInput label="Título" value={draft.heading} onChange={(v) => setDraft({ ...draft, heading: v })} />
      <TextInput label="Subtítulo" value={draft.subheading} onChange={(v) => setDraft({ ...draft, subheading: v })} />
      <TextInput label="Botón 'ver todas'" value={draft.ctaAll} onChange={(v) => setDraft({ ...draft, ctaAll: v })} />
      <TextInput label="Texto al pasar el mouse" value={draft.viewFull} onChange={(v) => setDraft({ ...draft, viewFull: v })} />

      <div className="sm:col-span-2 flex flex-wrap gap-2 mt-2">
        {galleries.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setActiveGalleryId(g.id)}
            className={`text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full ${
              activeGallery?.id === g.id ? "bg-accent text-white" : "bg-surface-2 text-muted hover:text-ink"
            }`}
          >
            {g.title} ({g.images.length})
          </button>
        ))}
        <button
          type="button"
          onClick={addGallery}
          className="text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full border border-dashed border-edge/20 text-muted hover:text-ink"
        >
          + Nueva galería
        </button>
      </div>

      {activeGallery && (
        <div className="sm:col-span-2 bg-surface-2 rounded-xl p-4 mt-2 flex flex-col gap-4">
          <div className="flex items-end gap-2">
            <TextInput
              label="Nombre del evento / galería"
              value={activeGallery.title}
              onChange={(v) => updateGalleryField(activeGallery.id, "title", v)}
              full
            />
            <RemoveButton onClick={() => removeGallery(activeGallery.id)} />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={activeGallery.downloadable !== false}
              onChange={(e) => updateGalleryField(activeGallery.id, "downloadable", e.target.checked)}
            />
            Permitir descargar esta galería completa en ZIP
          </label>

          <div className="grid sm:grid-cols-2 gap-3">
            {activeGallery.images.map((img, i) => (
              <div key={img.id} className="bg-surface rounded-xl p-3 flex gap-2">
                <div className="flex-1">
                  <ImageInput
                    value={img.url}
                    alt={img.alt}
                    onChangeUrl={(v) => updateImage(activeGallery.id, i, "url", v)}
                    onChangeAlt={(v) => updateImage(activeGallery.id, i, "alt", v)}
                  />
                </div>
                <RemoveButton onClick={() => removeImage(activeGallery.id, i)} />
              </div>
            ))}
          </div>
          <ListToolbar onAdd={() => addImage(activeGallery.id)} label="Agregar foto a esta galería" />
        </div>
      )}
    </SectionCard>
  );
}

export function TestimonialsSectionAdmin({ lang }) {
  const { draft, setDraft, save, reset, saved, translating, translateError } = useDraft(lang, "testimonials");
  if (!draft) return null;

  const updateItem = (i, field, val) => {
    const items = draft.items.map((it, idx) => (idx === i ? { ...it, [field]: val } : it));
    setDraft({ ...draft, items });
  };
  const removeItem = (i) => setDraft({ ...draft, items: draft.items.filter((_, idx) => idx !== i) });
  const addItem = () =>
    setDraft({
      ...draft,
      items: [...draft.items, { quote: "Nuevo testimonio...", name: "Nombre", role: "Rol", rating: 5 }],
    });

  return (
    <SectionCard
      title="Testimonios destacados"
      description="Testimonios curados que siempre aparecen en el sitio (junto con las recomendaciones aprobadas de clientes)"
      onSave={save}
      onReset={reset}
      saved={saved}
      translating={translating}
      translateError={translateError}
    >
      <TextInput label="Etiqueta" value={draft.label} onChange={(v) => setDraft({ ...draft, label: v })} full />
      <TextInput label="Título línea 1" value={draft.headingLine1} onChange={(v) => setDraft({ ...draft, headingLine1: v })} />
      <TextInput label="Título línea 2" value={draft.headingLine2} onChange={(v) => setDraft({ ...draft, headingLine2: v })} />
      <TextInput label="Botón para dejar recomendación" value={draft.ctaButton} onChange={(v) => setDraft({ ...draft, ctaButton: v })} full />

      <div className="sm:col-span-2 flex flex-col gap-3">
        {draft.items.map((item, i) => (
          <div key={i} className="bg-surface-2 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <TextArea label="Cita" value={item.quote} onChange={(v) => updateItem(i, "quote", v)} full />
              <RemoveButton onClick={() => removeItem(i)} />
            </div>
            <div className="grid sm:grid-cols-3 gap-2">
              <TextInput label="Nombre" value={item.name} onChange={(v) => updateItem(i, "name", v)} />
              <TextInput label="Rol" value={item.role} onChange={(v) => updateItem(i, "role", v)} />
              <SelectInput
                label="Calificación"
                value={String(item.rating || 5)}
                onChange={(v) => updateItem(i, "rating", Number(v))}
                options={["1", "2", "3", "4", "5"]}
              />
            </div>
          </div>
        ))}
        <ListToolbar onAdd={addItem} label="Agregar testimonio" />
      </div>
    </SectionCard>
  );
}

export function UserReviewsSection() {
  const { all, loading, offline, fetchAll, moderateTestimonial, removeTestimonial } = useTestimonialsData();
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState(null);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const startEdit = (t) => {
    setEditingId(t.id);
    setEditDraft({ name: t.name, rating: t.rating, message: t.message });
  };

  const saveEdit = async (id) => {
    await moderateTestimonial(id, editDraft);
    setEditingId(null);
  };

  const statusLabel = { PENDING: "Pendiente", APPROVED: "Aprobada", REJECTED: "Rechazada" };
  const statusColor = {
    PENDING: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
    APPROVED: "bg-green-500/15 text-green-700 dark:text-green-400",
    REJECTED: "bg-red-500/15 text-red-700 dark:text-red-400",
  };

  return (
    <div className="flex flex-col gap-4">
      {offline && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-700 dark:text-yellow-400 rounded-xl p-4 text-xs">
          No se pudo conectar con el servidor (server/). Mostrando recomendaciones guardadas localmente en este navegador.
        </div>
      )}

      {loading && <p className="text-sm text-muted">Cargando…</p>}

      {!loading && all.length === 0 && (
        <div className="bg-surface border border-edge/5 rounded-2xl p-8 text-center text-muted text-sm">
          Aún no hay recomendaciones de clientes. Aparecerán aquí cuando alguien deje una reseña en el sitio.
        </div>
      )}

      {all.map((t) => (
        <div key={t.id} className="bg-surface border border-edge/5 rounded-2xl p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm">{t.name}</h4>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${statusColor[t.status]}`}>
                {statusLabel[t.status]}
              </span>
            </div>
            <p className="text-xs text-muted">{new Date(t.createdAt).toLocaleString()}</p>
          </div>

          {editingId === t.id ? (
            <div className="flex flex-col gap-2">
              <div className="grid sm:grid-cols-2 gap-2">
                <TextInput label="Nombre" value={editDraft.name} onChange={(v) => setEditDraft({ ...editDraft, name: v })} />
                <SelectInput
                  label="Calificación"
                  value={String(editDraft.rating)}
                  onChange={(v) => setEditDraft({ ...editDraft, rating: Number(v) })}
                  options={["1", "2", "3", "4", "5"]}
                />
              </div>
              <TextArea label="Mensaje" value={editDraft.message} onChange={(v) => setEditDraft({ ...editDraft, message: v })} full />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => saveEdit(t.id)}
                  className="text-[11px] font-bold tracking-widest uppercase bg-accent hover:bg-accent-dim text-white rounded-full px-4 py-2"
                >
                  Guardar cambios
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="text-[11px] font-bold tracking-widest uppercase text-muted border border-edge/10 rounded-full px-4 py-2"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < t.rating ? "text-accent" : "text-muted"}>★</span>
                ))}
              </div>
              <p className="text-sm text-muted">{t.message}</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {t.status !== "APPROVED" && (
                  <button
                    type="button"
                    onClick={() => moderateTestimonial(t.id, { status: "APPROVED" })}
                    className="text-[11px] font-bold tracking-widest uppercase bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-2"
                  >
                    Aprobar
                  </button>
                )}
                {t.status !== "REJECTED" && (
                  <button
                    type="button"
                    onClick={() => moderateTestimonial(t.id, { status: "REJECTED" })}
                    className="text-[11px] font-bold tracking-widest uppercase bg-surface-2 hover:bg-red-500/10 hover:text-red-500 rounded-full px-4 py-2"
                  >
                    Rechazar
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => startEdit(t)}
                  className="text-[11px] font-bold tracking-widest uppercase border border-edge/10 rounded-full px-4 py-2 hover:border-edge/30"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => removeTestimonial(t.id)}
                  className="text-[11px] font-bold tracking-widest uppercase border border-edge/10 rounded-full px-4 py-2 text-muted hover:text-red-500 hover:border-red-500/40"
                >
                  Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export function PackagesSectionAdmin({ lang }) {
  const { draft, setDraft, save, reset, saved, translating, translateError } = useDraft(lang, "packages");
  if (!draft) return null;

  const updatePackage = (i, field, val) => {
    const items = draft.items.map((p, idx) => (idx === i ? { ...p, [field]: val } : p));
    setDraft({ ...draft, items });
  };
  const removePackage = (i) => setDraft({ ...draft, items: draft.items.filter((_, idx) => idx !== i) });
  const addPackage = () =>
    setDraft({
      ...draft,
      items: [
        ...draft.items,
        { id: `pkg-${Date.now()}`, number: String(draft.items.length + 1).padStart(2, "0"), title: "Nuevo paquete", total: "$0", features: [] },
      ],
    });

  const updateFeature = (i, fi, val) => {
    const features = draft.items[i].features.map((f, idx) => (idx === fi ? val : f));
    updatePackage(i, "features", features);
  };
  const removeFeature = (i, fi) => {
    updatePackage(i, "features", draft.items[i].features.filter((_, idx) => idx !== fi));
  };
  const addFeature = (i) => updatePackage(i, "features", [...draft.items[i].features, "Nueva característica"]);

  return (
    <SectionCard
      title="Paquetes"
      description="Los paquetes que ofreces, con precio y características. El segundo se marca como 'Más popular'."
      onSave={save}
      onReset={reset}
      saved={saved}
      translating={translating}
      translateError={translateError}
    >
      <TextInput label="Etiqueta" value={draft.label} onChange={(v) => setDraft({ ...draft, label: v })} full />
      <TextInput label="Título línea 1" value={draft.headingLine1} onChange={(v) => setDraft({ ...draft, headingLine1: v })} />
      <TextInput label="Título línea 2" value={draft.headingLine2} onChange={(v) => setDraft({ ...draft, headingLine2: v })} />
      <TextInput label="Subtítulo" value={draft.subheading} onChange={(v) => setDraft({ ...draft, subheading: v })} full />
      <TextInput label="Etiqueta 'Total'" value={draft.totalLabel} onChange={(v) => setDraft({ ...draft, totalLabel: v })} />
      <TextInput label="Nota al pie" value={draft.footnote} onChange={(v) => setDraft({ ...draft, footnote: v })} full />

      <div className="sm:col-span-2 flex flex-col gap-4">
        {draft.items.map((pkg, i) => (
          <div key={pkg.id} className="bg-surface-2 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-end gap-2">
              <TextInput label="No." value={pkg.number} onChange={(v) => updatePackage(i, "number", v)} />
              <TextInput label="Nombre del paquete" value={pkg.title} onChange={(v) => updatePackage(i, "title", v)} full />
              <TextInput label="Precio total" value={pkg.total} onChange={(v) => updatePackage(i, "total", v)} />
              <RemoveButton onClick={() => removePackage(i)} />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-mono tracking-widest uppercase text-muted">Características</span>
              {pkg.features.map((feature, fi) => (
                <div key={fi} className="flex items-center gap-2">
                  <input
                    value={feature}
                    onChange={(e) => updateFeature(i, fi, e.target.value)}
                    className="jp-input flex-1"
                  />
                  <RemoveButton onClick={() => removeFeature(i, fi)} />
                </div>
              ))}
              <ListToolbar onAdd={() => addFeature(i)} label="Agregar característica" />
            </div>
          </div>
        ))}
        <ListToolbar onAdd={addPackage} label="Agregar paquete" />
      </div>
    </SectionCard>
  );
}

export function TermsSectionAdmin({ lang }) {
  const { draft, setDraft, save, reset, saved, translating, translateError } = useDraft(lang, "terms");
  if (!draft) return null;

  const updateItem = (i, field, val) => {
    const items = draft.items.map((it, idx) => (idx === i ? { ...it, [field]: val } : it));
    setDraft({ ...draft, items });
  };
  const removeItem = (i) => setDraft({ ...draft, items: draft.items.filter((_, idx) => idx !== i) });
  const addItem = () =>
    setDraft({
      ...draft,
      items: [
        ...draft.items,
        {
          id: `term-${Date.now()}`,
          number: String(draft.items.length + 1).padStart(2, "0"),
          title: "Nuevo término",
          body: "Descripción del término...",
        },
      ],
    });

  return (
    <SectionCard
      title="Términos y condiciones"
      description="Se muestran como acordeón desplegable cerca de la sección de reservas."
      onSave={save}
      onReset={reset}
      saved={saved}
      translating={translating}
      translateError={translateError}
    >
      <TextInput label="Etiqueta" value={draft.label} onChange={(v) => setDraft({ ...draft, label: v })} full />
      <TextInput label="Título línea 1" value={draft.headingLine1} onChange={(v) => setDraft({ ...draft, headingLine1: v })} />
      <TextInput label="Título línea 2" value={draft.headingLine2} onChange={(v) => setDraft({ ...draft, headingLine2: v })} />
      <TextInput label="Subtítulo" value={draft.subheading} onChange={(v) => setDraft({ ...draft, subheading: v })} full />
      <TextInput label="Nota de aceptación" value={draft.acceptanceNote} onChange={(v) => setDraft({ ...draft, acceptanceNote: v })} />
      <TextInput label="Texto del enlace" value={draft.linkLabel} onChange={(v) => setDraft({ ...draft, linkLabel: v })} />

      <div className="sm:col-span-2 flex flex-col gap-3">
        {draft.items.map((item, i) => (
          <div key={item.id} className="bg-surface-2 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-end gap-2">
              <TextInput label="No." value={item.number} onChange={(v) => updateItem(i, "number", v)} />
              <TextInput label="Título" value={item.title} onChange={(v) => updateItem(i, "title", v)} full />
              <RemoveButton onClick={() => removeItem(i)} />
            </div>
            <TextArea label="Descripción" value={item.body} onChange={(v) => updateItem(i, "body", v)} full />
          </div>
        ))}
        <ListToolbar onAdd={addItem} label="Agregar término" />
      </div>
    </SectionCard>
  );
}

export function BookingSectionAdmin({ lang }) {
  const { draft, setDraft, save, reset, saved, translating, translateError } = useDraft(lang, "booking");
  if (!draft) return null;

  const setEventType = (i, val) => {
    const eventTypes = [...draft.eventTypes];
    eventTypes[i] = val;
    setDraft({ ...draft, eventTypes });
  };
  const removeEventType = (i) => setDraft({ ...draft, eventTypes: draft.eventTypes.filter((_, idx) => idx !== i) });
  const addEventType = () => setDraft({ ...draft, eventTypes: [...draft.eventTypes, "Nuevo tipo"] });

  return (
    <SectionCard title="Sección de reservas" onSave={save} onReset={reset} saved={saved} translating={translating} translateError={translateError}>
      <TextInput label="Etiqueta" value={draft.label} onChange={(v) => setDraft({ ...draft, label: v })} full />
      <TextInput label="Título línea 1" value={draft.headingLine1} onChange={(v) => setDraft({ ...draft, headingLine1: v })} />
      <TextInput label="Título línea 2" value={draft.headingLine2} onChange={(v) => setDraft({ ...draft, headingLine2: v })} />
      <TextInput label="Subtítulo" value={draft.subheading} onChange={(v) => setDraft({ ...draft, subheading: v })} full />
      <TextInput label="Texto botón principal" value={draft.ctaText} onChange={(v) => setDraft({ ...draft, ctaText: v })} />
      <TextInput label="Nota" value={draft.note} onChange={(v) => setDraft({ ...draft, note: v })} />
      <TextInput label="Título del formulario" value={draft.formTitle} onChange={(v) => setDraft({ ...draft, formTitle: v })} full />
      <TextInput label="Subtítulo del formulario" value={draft.formSubtitle} onChange={(v) => setDraft({ ...draft, formSubtitle: v })} full />

      <div className="sm:col-span-2">
        <span className="text-[11px] font-mono tracking-widest uppercase text-muted">Tipos de evento</span>
        <div className="flex flex-col gap-2 mt-2">
          {draft.eventTypes.map((type, i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={type} onChange={(e) => setEventType(i, e.target.value)} className="jp-input flex-1" />
              <RemoveButton onClick={() => removeEventType(i)} />
            </div>
          ))}
          <ListToolbar onAdd={addEventType} label="Agregar tipo de evento" />
        </div>
      </div>
    </SectionCard>
  );
}

export function ContactSectionAdmin({ lang }) {
  const contactDraft = useDraft(lang, "contact");
  const socialsDraft = useDraft(lang, "socials");
  if (!contactDraft.draft || !socialsDraft.draft) return null;

  return (
    <div className="flex flex-col gap-6">
      <SectionCard
        title="Contacto"
        description="Número de WhatsApp y SMS en formato internacional (solo dígitos para WhatsApp)"
        onSave={contactDraft.save}
        onReset={contactDraft.reset}
        saved={contactDraft.saved}
        translating={contactDraft.translating}
        translateError={contactDraft.translateError}
      >
        <TextInput label="Correo" value={contactDraft.draft.email} onChange={(v) => contactDraft.setDraft({ ...contactDraft.draft, email: v })} />
        <TextInput label="Teléfono (mostrado)" value={contactDraft.draft.phone} onChange={(v) => contactDraft.setDraft({ ...contactDraft.draft, phone: v })} />
        <TextInput
          label="WhatsApp (ej. 525500000000)"
          value={contactDraft.draft.whatsappNumber}
          onChange={(v) => contactDraft.setDraft({ ...contactDraft.draft, whatsappNumber: v })}
        />
        <TextInput
          label="SMS (ej. +525500000000)"
          value={contactDraft.draft.smsNumber}
          onChange={(v) => contactDraft.setDraft({ ...contactDraft.draft, smsNumber: v })}
        />
        <TextInput label="Ubicación / cobertura" value={contactDraft.draft.location} onChange={(v) => contactDraft.setDraft({ ...contactDraft.draft, location: v })} full />
      </SectionCard>

      <SectionCard
        title="Redes sociales"
        onSave={socialsDraft.save}
        onReset={socialsDraft.reset}
        saved={socialsDraft.saved}
        translating={socialsDraft.translating}
        translateError={socialsDraft.translateError}
      >
        <TextInput label="Instagram" value={socialsDraft.draft.instagram} onChange={(v) => socialsDraft.setDraft({ ...socialsDraft.draft, instagram: v })} />
        <TextInput label="Facebook" value={socialsDraft.draft.facebook} onChange={(v) => socialsDraft.setDraft({ ...socialsDraft.draft, facebook: v })} />
        <TextInput label="TikTok" value={socialsDraft.draft.tiktok} onChange={(v) => socialsDraft.setDraft({ ...socialsDraft.draft, tiktok: v })} />
      </SectionCard>
    </div>
  );
}

export function FooterSectionAdmin({ lang }) {
  const { draft, setDraft, save, reset, saved, translating, translateError } = useDraft(lang, "footer");
  if (!draft) return null;

  return (
    <SectionCard title="Pie de página" onSave={save} onReset={reset} saved={saved} translating={translating} translateError={translateError}>
      <TextInput label="Tagline" value={draft.tagline} onChange={(v) => setDraft({ ...draft, tagline: v })} />
      <TextInput label="Etiqueta navegación" value={draft.navLabel} onChange={(v) => setDraft({ ...draft, navLabel: v })} />
      <TextInput label="Etiqueta contacto" value={draft.contactLabel} onChange={(v) => setDraft({ ...draft, contactLabel: v })} />
      <TextInput label="Copyright" value={draft.copyright} onChange={(v) => setDraft({ ...draft, copyright: v })} full />
      <TextInput label="Créditos" value={draft.credits} onChange={(v) => setDraft({ ...draft, credits: v })} full />
    </SectionCard>
  );
}

export function LeadsSection() {
  const { leads, loading, offline, fetchLeads, removeLead } = useLeads();

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return (
    <div className="flex flex-col gap-4">
      {offline && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-700 dark:text-yellow-400 rounded-xl p-4 text-xs">
          No se pudo conectar con el servidor (server/). Mostrando solicitudes guardadas localmente en este navegador.
        </div>
      )}

      {loading && <p className="text-sm text-muted">Cargando…</p>}

      {!loading && leads.length === 0 && (
        <div className="bg-surface border border-edge/5 rounded-2xl p-8 text-center text-muted text-sm">
          Aún no hay solicitudes de reserva. Aparecerán aquí cuando alguien complete el formulario del sitio.
        </div>
      )}

      {leads.map((lead) => (
        <div key={lead.id} className="bg-surface border border-edge/5 rounded-2xl p-6 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm">{lead.name}</h4>
            <RemoveButton onClick={() => removeLead(lead.id)} />
          </div>
          <p className="text-xs text-muted">{new Date(lead.createdAt).toLocaleString()}</p>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm mt-2">
            <p><span className="text-muted">Teléfono:</span> {lead.phone}</p>
            {lead.email && <p><span className="text-muted">Correo:</span> {lead.email}</p>}
            <p><span className="text-muted">Tipo de evento:</span> {lead.eventType}</p>
            <p><span className="text-muted">Fecha:</span> {lead.eventDate}</p>
            <p className="sm:col-span-2"><span className="text-muted">Lugar:</span> {lead.location}</p>
            {lead.guests && <p><span className="text-muted">Invitados:</span> {lead.guests}</p>}
            {lead.packageInterest && <p><span className="text-muted">Paquete de interés:</span> {lead.packageInterest}</p>}
            {lead.details && <p className="sm:col-span-2"><span className="text-muted">Detalles:</span> {lead.details}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
