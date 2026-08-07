import JSZip from "jszip";
import { saveAs } from "file-saver";

function extensionFromUrl(url) {
  const match = url.match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i);
  return match ? match[1].toLowerCase() : "jpg";
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Descarga todas las fotos de una galería como un único archivo .zip.
// Las imágenes se traen como blob desde el navegador (Unsplash permite CORS),
// así que no se necesita nada especial en el backend para esto.
export async function downloadGalleryZip(gallery) {
  const zip = new JSZip();
  const folder = zip.folder(slugify(gallery.title) || "galeria");

  const results = await Promise.allSettled(
    gallery.images.map(async (image, i) => {
      const res = await fetch(image.url);
      if (!res.ok) throw new Error(`No se pudo descargar la foto ${i + 1}`);
      const blob = await res.blob();
      const ext = extensionFromUrl(image.url);
      folder.file(`${slugify(gallery.title)}-${String(i + 1).padStart(2, "0")}.${ext}`, blob);
    })
  );

  const failedCount = results.filter((r) => r.status === "rejected").length;
  if (failedCount === results.length) {
    throw new Error("No se pudo descargar ninguna foto de la galería.");
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${slugify(gallery.title) || "galeria"}.zip`);
}
