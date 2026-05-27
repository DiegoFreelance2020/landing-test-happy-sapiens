import { NextResponse, type NextRequest } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import { scoreAnswers, bandForScore } from "@/lib/score";
import { QUESTIONS } from "@/lib/quiz-data";

// Forzar runtime Node (no Edge) porque usamos la SERVICE_ROLE_KEY.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getClientIp(req: NextRequest): string | null {
  // Orden de preferencia: Netlify > Vercel/standard > directo.
  const candidates = [
    req.headers.get("x-nf-client-connection-ip"),
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
    req.headers.get("x-real-ip"),
  ];
  for (const c of candidates) {
    if (c) return c;
  }
  return null;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { name, email, answers } = (body ?? {}) as {
    name?: string;
    email?: string;
    answers?: Record<string, string>;
  };

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
  }
  if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
  }
  if (!answers || typeof answers !== "object") {
    return NextResponse.json({ error: "Respuestas faltantes" }, { status: 400 });
  }
  for (const q of QUESTIONS) {
    if (!answers[q.id]) {
      return NextResponse.json(
        { error: `Falta respuesta para la pregunta ${q.id}` },
        { status: 400 },
      );
    }
  }

  let scoreResult;
  try {
    scoreResult = scoreAnswers(answers);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error de scoring" },
      { status: 400 },
    );
  }
  const { score } = scoreResult;
  const band = bandForScore(score);

  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("quiz_submissions")
    .insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      score,
      result_key: band.key,
      answers,
      ip: getClientIp(req),
      user_agent: req.headers.get("user-agent"),
      referrer: req.headers.get("referer"),
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Supabase insert failed", error);
    return NextResponse.json(
      { error: "No se pudo guardar el envío" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    id: data.id,
    score,
    resultKey: band.key,
  });
}
