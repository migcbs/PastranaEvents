import { api } from "./api";

// Campos que nunca se deben traducir: ids técnicos, urls, precios, números,
// contacto, banderas de estado, etc. Se comparan por nombre de clave sin
// importar en qué nivel de anidación aparezcan.
const SKIP_KEYS = new Set([
  "id",
  "galleryId",
  "icon",
  "url",
  "href",
  "photoUrl",
  "coverUrl",
  "key",
  "number",
  "total",
  "value",
  "rating",
  "isPercent",
  "downloadable",
  "whatsappNumber",
  "smsNumber",
  "email",
  "phone",
  "status",
  "lang",
  "createdAt",
  "updatedAt",
  "stack",
  "instagram",
  "facebook",
  "tiktok",
  "youtube",
  "spotify",
]);

// Salvaguarda adicional: nunca traducir algo que ya parece una URL, sin
// importar el nombre de la clave (por si se agrega un campo nuevo a futuro).
const looksLikeUrl = (str) => /^(https?:\/\/|#$|mailto:|tel:|sms:|wa\.me)/i.test(str.trim());

function collectStrings(value, path, out) {
  if (typeof value === "string") {
    if (!looksLikeUrl(value)) out.push({ path, value });
  } else if (Array.isArray(value)) {
    value.forEach((item, i) => collectStrings(item, [...path, i], out));
  } else if (value && typeof value === "object") {
    Object.entries(value).forEach(([k, v]) => {
      if (SKIP_KEYS.has(k)) return;
      collectStrings(v, [...path, k], out);
    });
  }
}

function setAtPath(obj, path, value) {
  let cur = obj;
  for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
  cur[path[path.length - 1]] = value;
}

// Traduce recursivamente todos los strings "traducibles" de un objeto de
// sección (hero, bio, packages, terms, etc.) de un idioma a otro, preservando
// exactamente la misma estructura (mismo número de items en listas, mismos
// ids) para que ambos idiomas queden siempre sincronizados.
export async function translateSection(sectionValue, source, target) {
  const collected = [];
  collectStrings(sectionValue, [], collected);
  if (collected.length === 0) return sectionValue;

  const texts = collected.map((c) => c.value);
  const { translations } = await api.translateBatch(texts, source, target);

  const clone = JSON.parse(JSON.stringify(sectionValue));
  collected.forEach((c, i) => setAtPath(clone, c.path, translations[i] ?? c.value));
  return clone;
}
