// Crea (o actualiza la contraseña de) el usuario administrador.
//
// Uso:
//   npm run seed
//
// Por defecto usa username "admin" y genera una contraseña aleatoria que se
// imprime UNA SOLA VEZ en esta terminal — el frontend nunca la muestra.
// Para fijar tus propias credenciales, define ADMIN_SEED_USERNAME y
// ADMIN_SEED_PASSWORD en server/.env antes de correr el seed.
require("dotenv").config();
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_SEED_USERNAME || "admin";
  const password = process.env.ADMIN_SEED_PASSWORD || crypto.randomBytes(9).toString("base64url");

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash },
  });

  console.log("\n✅ Usuario administrador listo.");
  console.log("—".repeat(40));
  console.log(`Usuario:     ${username}`);
  console.log(`Contraseña:  ${password}`);
  console.log("—".repeat(40));
  console.log("Guarda esta contraseña en un lugar seguro (ej. tu gestor de");
  console.log("contraseñas). No se volverá a mostrar. Inicia sesión en /login.\n");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
