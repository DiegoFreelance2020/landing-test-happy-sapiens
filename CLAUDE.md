# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Landing del **Test de Bienestar de Happy Sapiens**: un quiz corto (5 preguntas) que asigna un puntaje, muestra un mensaje de resultado, permite compartir en redes sociales y guarda cada envío en Supabase (Postgres) con auditoría (IP, user agent, timestamp). Se despliega en Netlify bajo el subdominio `test.happysapiens.co`.

## Commands

```bash
npm install             # instalar dependencias
npm run dev             # dev server local (http://localhost:3000)
npm run build           # build de producción de Next.js
npm run start           # servir el build local
npm run lint            # ESLint
npm run typecheck       # tsc --noEmit
```

No hay test runner configurado todavía. Si se agregan tests, documentarlos aquí.

## Variables de entorno

Copia `.env.example` a `.env.local` para desarrollo. Variables:

- `NEXT_PUBLIC_SUPABASE_URL` — URL del proyecto Supabase (pública).
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon key de Supabase (pública, hoy no se usa desde el cliente pero queda lista por si se requiere).
- `SUPABASE_SERVICE_ROLE_KEY` — **server-only**, bypassea RLS. Sólo se lee desde route handlers en `app/api/**`. Nunca prefijar con `NEXT_PUBLIC_`.
- `NEXT_PUBLIC_SITE_URL` — base absoluta para construir share links y OG metadata (en prod: `https://test.happysapiens.co`).

En Netlify estas se configuran en *Site settings → Environment variables*.

## Arquitectura

### Flujo del quiz (cliente → servidor)

```
Landing (/)
  └─ Link → /test
            └─ <QuizForm> (client)
                  1. captura nombre + email
                  2. itera por QUESTIONS de lib/quiz-data.ts (una a una)
                  3. al responder la última → POST /api/submit
                  4. router.push(`/resultado/${id}`)

/api/submit (Node runtime)
  ├─ valida payload
  ├─ scoreAnswers() + bandForScore() en lib/score.ts
  ├─ captura ip vía headers `x-nf-client-connection-ip` / `x-forwarded-for`
  └─ supabase.from("quiz_submissions").insert(...)  (service role)

/resultado/[id] (Server Component)
  ├─ getServerSupabase().select() del submission por id
  ├─ resuelve banda → muestra heading, mensaje, score
  ├─ 2 CTAs: tienda (CTA_TIENDA_URL) y comunidad (CTA_COMUNIDAD_URL)
  └─ <ShareButtons /> con WhatsApp, X, Facebook, LinkedIn, Web Share API
```

El scoring **NO** confía en el cliente: el servidor recibe las **IDs de las opciones seleccionadas** y vuelve a calcular el puntaje usando `lib/quiz-data.ts`. El cliente nunca envía un score.

### Archivos clave

- `lib/quiz-data.ts` — **única fuente de verdad** del contenido del test. Editar aquí preguntas, opciones, puntajes, rangos de resultado (`RESULT_BANDS`) y URLs de los CTAs (`CTA_TIENDA_URL`, `CTA_COMUNIDAD_URL`).
- `lib/score.ts` — `scoreAnswers()` y `bandForScore()`. Lógica pura y sincrónica.
- `lib/supabase-server.ts` — factory del cliente con service role. **No importar desde código de cliente** (`"use client"`).
- `lib/site.ts` — `SITE_URL` y `absoluteUrl()` para construir share links.
- `app/api/submit/route.ts` — único endpoint que escribe en Supabase.
- `app/resultado/[id]/page.tsx` — server component; lee el submission y genera OG metadata dinámica.
- `components/QuizForm.tsx` — máquina de estados `user → quiz → submitting`.
- `supabase/migrations/0001_init.sql` — schema. RLS activada; sólo el service role inserta.

### Convenciones

- **App Router + React Server Components por defecto.** Marcar `"use client"` sólo cuando hay estado o eventos del DOM (`QuizForm`, `ShareButtons`).
- Estilos con **Tailwind**. La paleta de marca vive en `tailwind.config.ts` bajo `colors.brand.*` y proviene del logo SVG real (`#848a73` sage, `#fae4e8` pink, `#d3ebe7` mint). Componentes utilitarios (`btn-primary`, `btn-secondary`, `card`, `option-button`) en `app/globals.css` para no repetir clases.
- Rutas: alias `@/*` apunta a la raíz (ver `tsconfig.json`).
- El route handler `/api/submit` corre con `runtime = "nodejs"` (no Edge) porque usa la service role key.

## Supabase

Tabla `public.quiz_submissions`:

```
id           uuid pk default gen_random_uuid()
name         text
email        text
score        int (0–100)
result_key   text          -- "vas-bien" | "consistencia" | "pausa" | "senales"
answers      jsonb         -- { q1: "q1a", q2: "q2c", ... }
ip           inet
user_agent   text
referrer     text
created_at   timestamptz default now()
```

**RLS está habilitada y no hay políticas públicas.** Toda escritura/lectura pasa por la service role key del backend. Si se necesita lectura desde el cliente en el futuro, agregar una policy explícita.

### Aplicar migrations

Opción A (Supabase CLI):
```bash
supabase link --project-ref <ref>
supabase db push
```

Opción B (SQL Editor del dashboard): pegar el contenido de `supabase/migrations/0001_init.sql`.

## Deploy a Netlify

1. Conectar el repo en Netlify.
2. Las variables de entorno se configuran en *Site settings → Environment variables* (las mismas de `.env.example`).
3. El `netlify.toml` ya declara el plugin oficial `@netlify/plugin-nextjs` y headers de seguridad.
4. Para apuntar `test.happysapiens.co`: agregar el subdominio en *Domain management* y crear el CNAME en el DNS del dominio raíz.

## Pendientes / placeholders conocidos

- `CTA_TIENDA_URL` y `CTA_COMUNIDAD_URL` en `lib/quiz-data.ts` son placeholders. Reemplazar con las URLs reales antes de salir a producción.
- No hay imagen Open Graph aún. Agregar un `public/og-image.png` (1200×630) y referenciarlo en `app/layout.tsx` y en `generateMetadata` de `app/resultado/[id]/page.tsx`.
- El documento de origen tenía 5 preguntas, pero el brief inicial pedía 10. Para extender: agregar entradas a `QUESTIONS` en `lib/quiz-data.ts` y ajustar los rangos de `RESULT_BANDS` (el código deriva `MAX_SCORE` automáticamente).
- No hay endpoint de export/admin para consultar los envíos; por ahora consultar directo en Supabase.
