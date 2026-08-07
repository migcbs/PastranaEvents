import { useRef } from "react";
import { Upload, X } from "lucide-react";
import { fileToBase64 } from "../utils/fileToBase64";

export function TextInput({ label, value, onChange, full, ...props }) {
  return (
    <label className={`flex flex-col gap-1 text-left ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-[11px] font-mono tracking-widest uppercase text-muted">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="jp-input" {...props} />
    </label>
  );
}

export function TextArea({ label, value, onChange, rows = 3, full }) {
  return (
    <label className={`flex flex-col gap-1 text-left ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-[11px] font-mono tracking-widest uppercase text-muted">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="jp-input resize-none"
      />
    </label>
  );
}

export function SelectInput({ label, value, onChange, options, full }) {
  return (
    <label className={`flex flex-col gap-1 text-left ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-[11px] font-mono tracking-widest uppercase text-muted">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="jp-input">
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ColorInput({ label, value, onChange }) {
  return (
    <label className="flex flex-col gap-1 text-left">
      <span className="text-[11px] font-mono tracking-widest uppercase text-muted">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg border border-edge/10 cursor-pointer bg-transparent"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="jp-input flex-1"
        />
      </div>
    </label>
  );
}

export function ImageInput({ label, value, alt, onChangeUrl, onChangeAlt }) {
  const fileRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    onChangeUrl(base64);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-[11px] font-mono tracking-widest uppercase text-muted">{label}</span>}
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-2 border border-edge/10 flex-shrink-0 flex items-center justify-center">
          {value ? (
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] text-muted">Sin foto</span>
          )}
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <input
            type="text"
            placeholder="URL de la imagen"
            value={value}
            onChange={(e) => onChangeUrl(e.target.value)}
            className="jp-input"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase border border-edge/10 rounded-full px-3 py-1.5 hover:border-edge/30 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              <Upload size={12} /> Subir
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChangeUrl("")}
                className="flex items-center gap-1 text-[11px] text-muted hover:text-ink"
              >
                <X size={12} /> Quitar
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>
          {onChangeAlt && (
            <input
              type="text"
              placeholder="Texto alternativo (accesibilidad)"
              value={alt}
              onChange={(e) => onChangeAlt(e.target.value)}
              className="jp-input"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function SectionCard({ title, description, onSave, onReset, children, saved, translating, translateError }) {
  return (
    <div className="bg-surface border border-edge/5 rounded-2xl p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h3 className="font-black uppercase tracking-tight text-lg">{title}</h3>
          {description && <p className="text-xs text-muted mt-1">{description}</p>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {saved && <span className="text-[11px] text-accent font-semibold">Guardado ✓</span>}
          {translating && (
            <span className="text-[11px] text-muted font-semibold">Traduciendo al otro idioma…</span>
          )}
          {translateError && (
            <span className="text-[11px] text-red-500 font-semibold" title="No se pudo traducir automáticamente; revisa el otro idioma manualmente">
              No se pudo traducir
            </span>
          )}
          <button
            type="button"
            onClick={onReset}
            className="text-[11px] font-bold tracking-widest uppercase text-muted hover:text-ink border border-edge/10 rounded-full px-4 py-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            Restablecer
          </button>
          <button
            type="button"
            onClick={onSave}
            className="text-[11px] font-bold tracking-widest uppercase bg-accent hover:bg-accent-dim text-white rounded-full px-4 py-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            Guardar
          </button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

export function ListToolbar({ onAdd, label = "Agregar" }) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="text-[11px] font-bold tracking-widest uppercase border border-dashed border-edge/20 rounded-lg px-4 py-3 text-muted hover:text-ink hover:border-edge/40 w-full text-center focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
    >
      + {label}
    </button>
  );
}

export function RemoveButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Eliminar"
      className="w-8 h-8 rounded-full border border-edge/10 flex items-center justify-center text-muted hover:text-red-500 hover:border-red-500/40 flex-shrink-0 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
    >
      <X size={14} />
    </button>
  );
}
