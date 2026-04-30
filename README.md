# Hubert de Blanck — Web oficial

Web de la compañía teatral y sala **Hubert de Blanck**, La Habana.

---

## 1. Stack

- **React 19** + **TypeScript** + **Vite 6**
- **Tailwind CSS 3** con tokens del sistema neo-brutalista teatral
- **Supabase** — auth, base de datos y storage
- **React Router DOM 7**
- **react-helmet-async** para SEO
- Hosting en **Vercel**

---

## 2. Setup local

### 2.1 Instalar dependencias

```bash
npm install
```

### 2.2 Crear el proyecto Supabase

1. Entra en [supabase.com](https://supabase.com) y crea un proyecto nuevo (gratuito).
2. Una vez creado, ve a **SQL Editor** y ejecuta el contenido completo de `supabase/schema.sql`.
3. Opcional: ejecuta `supabase/seed.sql` para meter datos de prueba.
4. En **Authentication → Providers**, activa "Email" y "Google" si quieres login social.
5. En **Storage**, crea un bucket llamado `fotos` y márcalo como **public**.
6. Aplica las políticas de Storage indicadas al final de `schema.sql`.

### 2.3 Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` con los valores reales:

- `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` están en Supabase → **Project Settings → API**
- `VITE_ADMIN_EMAIL` es el email del administrador de la web

> Importante: el email admin también está hardcoded en `schema.sql` dentro de la función `is_admin()`. Cambia ambos sitios al mismo valor.

### 2.4 Lanzar el dev server

```bash
npm run dev
```

Abre <http://localhost:5173>.

---

## 3. Arquitectura del proyecto

```
hubert-de-blanck/
├── src/
│   ├── components/        Componentes reutilizables del sistema de diseño
│   │   ├── Button.tsx     Botón principal/secundario/carmín
│   │   ├── Card.tsx       Tarjeta neo-brutalista con sombra y rotación
│   │   ├── Footer.tsx     Banda inferior tipo "billete numerado"
│   │   ├── Header.tsx     Cabecera con navegación
│   │   ├── Layout.tsx     Layout que envuelve cada página
│   │   ├── SEO.tsx        Meta tags por página
│   │   ├── SectionRule.tsx  Separador "━━ TÍTULO ━━━"
│   │   └── Tag.tsx        Etiqueta con borde sólido y variantes
│   ├── pages/             Una página por ruta
│   │   ├── Home.tsx
│   │   ├── Obras.tsx           /obras
│   │   ├── ObraDetalle.tsx     /obras/:slug
│   │   ├── Equipo.tsx          /equipo
│   │   ├── MiembroDetalle.tsx  /equipo/:slug
│   │   ├── SobreLaCompania.tsx /sobre-la-compania
│   │   ├── Login.tsx           /login
│   │   ├── MiPerfil.tsx        /mi-perfil (protegida)
│   │   └── NoEncontrado.tsx    404
│   ├── lib/
│   │   ├── supabase.ts    Cliente Supabase + helper isAdmin
│   │   └── constants.ts   Etiquetas de niveles, tipos y estados
│   ├── types/
│   │   └── database.ts    Tipos TypeScript que reflejan el esquema SQL
│   ├── styles/
│   │   └── index.css      Tailwind + utilidades del sistema
│   ├── App.tsx            Router principal
│   └── main.tsx           Entry point
├── supabase/
│   ├── schema.sql         Esquema completo (tablas + RLS + triggers)
│   └── seed.sql           Datos de prueba opcionales
├── public/
│   └── favicon.svg
└── vercel.json            Rewrites SPA + headers de seguridad
```

---

## 4. Modelo de datos

| Tabla | Función |
|---|---|
| `profiles` | Miembros de la compañía. Niveles: núcleo / colaborador / antiguo. |
| `obras` | Repertorio. Cada obra tiene una entrada única atemporal. |
| `producciones` | Montajes específicos de una obra (temporada 2024, temporada 2027). |
| `reparto` | Tabla puente: qué actor hizo qué personaje en qué producción. |
| `obra_fotos` | Galería de cada obra. |
| `obra_videos` | Videos de YouTube embebidos por obra. |
| `profile_fotos` | Galería personal de cada miembro. |

> **Por qué obra ≠ producción**: una misma obra puede reponerse con repartos distintos. Sin esta separación perderíamos la historia de cada montaje.

---

## 5. Sistema de diseño

### Paleta (tokens en `tailwind.config.js`)

| Token | Hex | Uso |
|---|---|---|
| `paper` | `#F2EBDA` | Fondo principal |
| `paper-2` | `#FFFCF0` | Cards, fondos claros |
| `ink` | `#0F1738` | Tinta principal, bordes |
| `ink-soft` | `#4A5470` | Texto secundario |
| `carmin` | `#B8253A` | Acento, sombras, énfasis |

### Tipografía

- **Cormorant Garamond** — display (títulos, sinopsis en cursiva)
- **Inter** — cuerpo
- **JetBrains Mono** — metadatos (años, números, etiquetas)

### Patrones reutilizables

- `<SectionRule>` — separador "━━ TÍTULO ━━━━━━━━━━━━━━━━"
- `<Card tilt={n}>` — tarjeta con rotación sutil
- `<Tag variant="ink|carmin|paper">` — etiqueta de metadatos
- `<Button variant="primary|secondary|carmin">` — CTAs
- Sombras: `shadow-brut`, `shadow-brut-carmin`, `shadow-brut-lg`
- Rotaciones: clases utilitarias `tilt-1` a `tilt-5`

---

## 6. Permisos y roles

- **Público** — lee todo (perfiles activos, obras, producciones, reparto, fotos, videos).
- **Miembro logueado** — además, edita su propia ficha y su galería personal.
- **Admin** (`is_admin()` en RLS) — acceso total: crea miembros, obras, producciones, asigna reparto.

> El panel admin (`/admin`) **no está incluido en este MVP**. Se añadirá en la siguiente iteración. Mientras tanto, el admin puede hacer todas las operaciones desde el dashboard de Supabase.

---

## 7. Deploy en Vercel

1. Conecta el repo de GitHub a Vercel.
2. En **Settings → Environment Variables**, añade las mismas tres variables del `.env.local`.
3. Vercel detecta Vite automáticamente. Build command: `npm run build`. Output: `dist`.
4. Deploy.
5. Tu sitio estará en `hubert-de-blanck.vercel.app` (o similar).
6. Cuando compres un dominio, lo añades en **Settings → Domains** y Vercel gestiona DNS.

---

## 8. Checklist post-MVP

- [ ] Crear el primer usuario admin en Supabase y ajustar `is_admin()` con su email
- [ ] Subir las primeras fotos al bucket `fotos`
- [ ] Crear los miembros del núcleo desde el dashboard de Supabase
- [ ] Vincular cada miembro con su cuenta (`user_id`) cuando se registren
- [ ] Crear las obras del repertorio
- [ ] Crear las producciones por temporada y asignar reparto
- [ ] Subir foto de portada para cada obra y rellenar sinopsis

## 9. Próximas iteraciones (no incluidas en MVP)

- Panel admin web `/admin` con CRUD visual de obras, producciones y reparto
- Subida de imágenes desde el panel personal del miembro
- Cartelera de sala con compañías invitadas (Fase 2)
- Blog/comentarios moderados con Claude API (Fase 3)
- Pre-rendering o SSR para mejor SEO de páginas individuales

---

*Generado en abril de 2026.*
