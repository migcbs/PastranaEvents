// Punto de entrada para Vercel. Todas las rutas (/api/health, /api/leads,
// /api/auth/login, etc.) llegan aquí — el vercel.json de al lado reescribe
// cualquier request hacia esta función, y Express adentro las enruta según
// el path original (Vercel conserva req.url tal cual en los rewrites).
module.exports = require("../index.js");
