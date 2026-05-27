-- Test de Bienestar — Happy Sapiens
-- Captura cada envío del quiz con metadatos de auditoría.

create extension if not exists "pgcrypto";

create table if not exists public.quiz_submissions (
  id              uuid        primary key default gen_random_uuid(),
  name            text        not null,
  email           text        not null,
  score           integer     not null check (score >= 0 and score <= 100),
  result_key      text        not null,
  answers         jsonb       not null,
  ip              inet,
  user_agent      text,
  referrer        text,
  created_at      timestamptz not null default now()
);

create index if not exists quiz_submissions_email_idx
  on public.quiz_submissions (email);

create index if not exists quiz_submissions_created_at_idx
  on public.quiz_submissions (created_at desc);

create index if not exists quiz_submissions_result_key_idx
  on public.quiz_submissions (result_key);

-- RLS: la tabla queda bloqueada para el público.
-- El backend usa la SERVICE_ROLE_KEY (que bypassea RLS) para insertar,
-- así que NO definimos política para el rol `anon`.
alter table public.quiz_submissions enable row level security;

-- Si más adelante se quiere permitir que el dueño consulte su propio resultado
-- por id desde el cliente, se puede agregar algo como:
--
-- create policy "Read own submission by id"
--   on public.quiz_submissions for select to anon
--   using (id::text = current_setting('request.headers', true)::json->>'x-submission-id');
--
-- Pero por defecto se sirve via el route handler /api/result/[id] con el service role.
