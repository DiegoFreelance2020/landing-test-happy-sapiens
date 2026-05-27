# Test de Bienestar · Happy Sapiens

Landing del test de bienestar que se aloja en `test.happysapiens.co`. Construida con **Next.js 15 (App Router) + TypeScript + Tailwind**, conectada a **Supabase (Postgres)** y desplegada en **Netlify**.

## Setup

```bash
npm install
cp .env.example .env.local      # luego rellenar con credenciales reales
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Variables de entorno

Ver `.env.example`. Necesitas un proyecto en [Supabase](https://supabase.com):

1. Crea el proyecto.
2. Copia la `URL` y la `anon key` (Settings → API).
3. Copia la `service_role` (no se expone al cliente; sólo Netlify env var).
4. Ejecuta la migración `supabase/migrations/0001_init.sql` (SQL Editor o `supabase db push`).

## Comandos

| Comando            | Descripción                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Servidor de desarrollo               |
| `npm run build`    | Build de producción                  |
| `npm run start`    | Servir el build local                |
| `npm run lint`     | ESLint                               |
| `npm run typecheck`| `tsc --noEmit`                       |

## Editar el contenido del test

Todo (preguntas, puntajes, mensajes de resultado, URLs de CTA) vive en un sólo archivo: [`lib/quiz-data.ts`](./lib/quiz-data.ts).

## Deploy

Push a `main` → Netlify construye automáticamente con el plugin de Next.js. Configura las variables de entorno en *Site settings → Environment variables*. Apunta `test.happysapiens.co` desde *Domain management*.

## Estructura

Ver [`CLAUDE.md`](./CLAUDE.md) para la arquitectura detallada.
