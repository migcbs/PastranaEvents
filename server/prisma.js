const { PrismaClient } = require("@prisma/client");

// Node cachea los módulos por proceso: en Vercel, mientras el contenedor
// serverless siga "caliente" entre invocaciones, este archivo solo se
// ejecuta una vez y todas las rutas reutilizan la misma conexión —
// exactamente lo que se necesita para no agotar el límite de conexiones
// de Postgres.
const prisma = new PrismaClient();

module.exports = prisma;
