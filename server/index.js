require("dotenv").config();
const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const prisma = require("./prisma");
const { sendLeadNotification } = require("./mailer");

const app = express();

const PORT = process.env.PORT || 4000;
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 horas

app.use(cors());
app.use(express.json());

async function requireAdmin(req, res, next) {
  const authHeader = req.header("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "No autorizado" });
  }
  const session = await prisma.adminSession.findUnique({ where: { token } });
  if (!session || session.expiresAt < new Date()) {
    return res.status(401).json({ error: "Sesión inválida o expirada" });
  }
  req.adminId = session.adminId;
  next();
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// ---------- Autenticación de administrador ----------

app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Usuario y contraseña son obligatorios" });
    }
    const admin = await prisma.adminUser.findUnique({ where: { username } });
    if (!admin) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }
    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
    await prisma.adminSession.create({ data: { token, adminId: admin.id, expiresAt } });
    res.json({ token, username: admin.username, expiresAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

app.post("/api/auth/logout", requireAdmin, async (req, res) => {
  const authHeader = req.header("authorization") || "";
  const token = authHeader.slice(7);
  await prisma.adminSession.deleteMany({ where: { token } });
  res.status(204).end();
});

app.get("/api/auth/me", requireAdmin, async (req, res) => {
  const admin = await prisma.adminUser.findUnique({ where: { id: req.adminId } });
  res.json({ username: admin?.username });
});

// ---------- Leads (solicitudes de reserva) ----------

app.post("/api/leads", async (req, res) => {
  try {
    const { name, phone, email, eventType, eventDate, location, guests, details, packageInterest } = req.body;
    if (!name || !phone || !eventType || !eventDate || !location) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    const lead = await prisma.lead.create({
      data: { name, phone, email, eventType, eventDate, location, guests, details, packageInterest },
    });
    res.status(201).json(lead);

    // No bloquea ni afecta la respuesta: la reserva ya se guardó pase lo que
    // pase con el correo. Si falla el envío, solo queda un log en el server.
    sendLeadNotification(lead);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar la solicitud" });
  }
});

app.get("/api/leads", requireAdmin, async (req, res) => {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
  res.json(leads);
});

app.delete("/api/leads/:id", requireAdmin, async (req, res) => {
  await prisma.lead.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

// ---------- Testimonials (recomendaciones de clientes) ----------

app.post("/api/testimonials", async (req, res) => {
  try {
    const { name, rating, message, lang } = req.body;
    if (!name || !message || !rating) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        rating: Math.min(Math.max(Number(rating), 1), 5),
        message,
        lang: lang || "es",
        status: "PENDING",
      },
    });
    res.status(201).json(testimonial);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar la recomendación" });
  }
});

app.get("/api/testimonials/approved", async (req, res) => {
  const testimonials = await prisma.testimonial.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
  });
  res.json(testimonials);
});

app.get("/api/testimonials", requireAdmin, async (req, res) => {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
  res.json(testimonials);
});

app.patch("/api/testimonials/:id", requireAdmin, async (req, res) => {
  try {
    const { name, rating, message, status } = req.body;
    const VALID_STATUSES = ["PENDING", "APPROVED", "REJECTED"];
    if (status !== undefined && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: "Estado inválido" });
    }
    const data = {};
    if (name !== undefined) data.name = name;
    if (rating !== undefined) data.rating = Math.min(Math.max(Number(rating), 1), 5);
    if (message !== undefined) data.message = message;
    if (status !== undefined) data.status = status;

    const testimonial = await prisma.testimonial.update({
      where: { id: req.params.id },
      data,
    });
    res.json(testimonial);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar la recomendación" });
  }
});

app.delete("/api/testimonials/:id", requireAdmin, async (req, res) => {
  await prisma.testimonial.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

// ---------- Traducción automática (admin) ----------
//
// Usa MyMemory (https://mymemory.translated.net), un servicio gratuito que no
// requiere API key. Calidad razonable para textos cortos/medianos; si más
// adelante se consigue una key de OpenAI/DeepL, este es el único lugar que
// habría que cambiar para mejorar la calidad de traducción.

async function translateOne(text, source, target) {
  if (!text || !text.trim()) return text;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;
  const res = await fetch(url);
  if (!res.ok) return text;
  const data = await res.json();
  return data?.responseData?.translatedText || text;
}

app.post("/api/translate", async (req, res) => {
  try {
    const { texts, source, target } = req.body;
    if (!Array.isArray(texts) || !source || !target) {
      return res.status(400).json({ error: "texts, source y target son requeridos" });
    }
    const translations = await Promise.all(texts.map((t) => translateOne(t, source, target)));
    res.json({ translations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al traducir" });
  }
});

// En local (`node index.js`) esto levanta un servidor normal en el puerto
// 4000. En Vercel, este archivo se importa desde api/index.js sin llamar a
// listen() — Vercel invoca la app directamente como función serverless.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Pastrana Events API escuchando en http://localhost:${PORT}`);
  });
}

module.exports = app;
