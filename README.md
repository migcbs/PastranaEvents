# J. Pastrana — Landing page + panel de administrador

Sitio para DJ de eventos (bodas, antros, festivales, corporativos), con:

- Frontend en **React (Create React App)** + Tailwind + Framer Motion.
- Panel de administrador en `/admin` totalmente customizable (contenido, colores, tipografía, galería, testimonios).
- Backend en **Node/Express + Prisma** (`server/`) para persistir solicitudes de reserva y recomendaciones de clientes en base de datos real (SQLite en local, listo para Neon/Postgres en producción).

## Correr todo en local

Necesitas **dos terminales** (frontend y backend).

### 1. Backend (`server/`)

```bash
cd server
npm install
npx prisma migrate dev   # solo la primera vez, crea server/prisma/dev.db
npm run dev              # http://localhost:4000
```

### 2. Frontend (raíz del proyecto)

```bash
npm install
npm start                # http://localhost:3000
```

El frontend lee `REACT_APP_API_URL` (por defecto `http://localhost:4000`) desde `.env`.
Si el backend no está corriendo, el sitio sigue funcionando: las solicitudes de
reserva y recomendaciones se guardan temporalmente en el navegador
(`localStorage`) y se sincronizan en cuanto el backend vuelva a estar disponible.

### Acceso al panel de administrador

Ir a `/admin` → botón "Iniciar sesión" en la barra de navegación.

- Usuario: `admin`
- Contraseña: `jpastrana2025`

Es un login **emulado** (sin backend de autenticación real) — cualquiera con el
código fuente puede ver esas credenciales. Para producción real habría que
agregar autenticación de verdad (por ejemplo, NextAuth, Clerk, o un login
propio contra la base de datos).

## Desplegar todo en Vercel

El proyecto se despliega como **dos proyectos de Vercel separados** desde este
mismo repo: uno para el frontend (raíz del repo) y otro para el backend
(carpeta `server/`, ya adaptado como función serverless en `server/api/index.js`
+ `server/vercel.json`).

### 1. Base de datos: Neon (obligatorio para producción)

SQLite (`server/prisma/dev.db`) solo sirve para desarrollo local — Vercel no
tiene disco persistente, así que producción necesita Postgres real:

1. Crea un proyecto gratis en [neon.tech](https://neon.tech) y copia el
   `DATABASE_URL` (usa la versión "pooled"/con PgBouncer que te da Neon,
   pensada para serverless).
2. En `server/prisma/schema.prisma` cambia:
   ```prisma
   datasource db {
     provider = "postgresql"   // antes: "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
3. En `server/.env` pon ese `DATABASE_URL` real y corre:
   ```bash
   cd server
   npx prisma migrate dev --name init
   ```

### 2. Backend en Vercel (proyecto A)

1. En Vercel → **Add New → Project** → importa el repo → cuando pida el
   **Root Directory**, ponlo en `server`.
2. Framework Preset: "Other" (Vercel detecta la función en `api/` sola).
3. Environment Variables (Production):
   ```
   DATABASE_URL              → tu cadena de Neon
   ADMIN_SEED_USERNAME        → el usuario que quieras para el admin
   ADMIN_SEED_PASSWORD        → una contraseña fuerte (no la de prueba)
   RESEND_API_KEY              → tu API key de resend.com
   ADMIN_NOTIFICATION_EMAIL    → tu correo real
   RESEND_FROM_EMAIL          → Pastrana Events <onboarding@resend.dev>
   ```
4. Deploy. Copia la URL que te da (ej. `https://pastranaevents-api.vercel.app`).
5. Corre el seed **una sola vez** contra Neon (desde tu máquina, con
   `server/.env` apuntando a `DATABASE_URL` de Neon): `npm run seed`.

### 3. Frontend en Vercel (proyecto B)

1. Otro **Add New → Project** → mismo repo → Root Directory: `.` (raíz).
2. Vercel detecta Create React App automáticamente.
3. Environment Variables:
   ```
   REACT_APP_API_URL = https://pastranaevents-api.vercel.app
   ```
   (la URL del proyecto backend del paso 2.4)
4. Deploy.

## Notificación por correo al recibir una reserva

Cuando alguien envía el formulario de reserva, el sitio puede avisarte por
correo automáticamente. Usa [Resend](https://resend.com) (tiene plan gratis,
3,000 correos/mes).

1. Crea una cuenta gratis en [resend.com](https://resend.com).
2. Genera una API key (Dashboard → API Keys → Create API Key).
3. En `server/.env` agrega:
   ```
   RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   ADMIN_NOTIFICATION_EMAIL="tu-correo@ejemplo.com"
   ```
4. Reinicia el backend (`npm run dev` dentro de `server/`).

Con eso ya queda funcionando — no hace falta verificar un dominio propio: por
defecto los correos se envían desde la dirección de pruebas de Resend
(`onboarding@resend.dev`), que funciona sin configuración adicional. Si más
adelante quieres que el correo llegue "de parte de" tu propio dominio
(ej. `reservas@pastranaevents.com`), verifica ese dominio en Resend y define
`RESEND_FROM_EMAIL="Pastrana Events <reservas@tudominio.com>"` en el `.env`.

Si estas variables no están configuradas, el sitio sigue funcionando
normalmente — las reservas se siguen guardando en la base de datos y viendo en
`/admin` → "Solicitudes", simplemente no se envía el correo automático.

## Estructura

```
src/
├── components/       # Navbar, Hero, Bio, Genres, Stats, Gallery, Testimonials, Booking, Footer...
├── admin/            # Panel de administrador (AdminDashboard, sections, FormFields)
├── context/          # SiteConfigContext, ThemeContext, LanguageContext, AuthContext,
│                      LeadsContext, TestimonialsDataContext
├── pages/            # MainSite
└── utils/            # api.js (cliente REST), contactLinks.js (wa.me / sms: / mailto)

server/
├── index.js          # API Express (auth, leads, testimonials, traducción)
├── prisma.js         # Cliente Prisma compartido (singleton por proceso)
├── mailer.js         # Notificación por correo (Resend) al llegar una reserva
├── api/index.js      # Entry point para Vercel (exporta la app de index.js)
├── vercel.json        # Rewrites: todo el tráfico va a la función de arriba
└── prisma/
    └── schema.prisma # Modelos Lead, Testimonial, AdminUser, AdminSession
```

## Funcionalidades

- **Todo el contenido es editable** desde `/admin`: textos, fotos (URL o
  subida), galería, estadísticas, géneros, testimonios curados, contacto,
  redes sociales, footer — en español e inglés por separado.
- **Apariencia**: tema claro/oscuro por defecto, color de acento y tipografía,
  editables en vivo.
- **Idioma**: selector ES/EN en la barra de navegación, persistente.
- **Reservas**: formulario de reserva con WhatsApp (`wa.me`), SMS/iMessage
  (`sms:`) y correo — mensaje prellenado automáticamente con los datos del
  formulario. Las solicitudes quedan guardadas y visibles en `/admin` →
  "Solicitudes".
- **Recomendaciones de clientes**: cualquier visitante puede dejar una reseña
  (nombre, 1–5 estrellas, mensaje) desde el sitio. Quedan en estado
  "pendiente" hasta que el administrador las aprueba, edita o rechaza desde
  `/admin` → "Recomendaciones". Solo las aprobadas aparecen en el carrusel
  público.
