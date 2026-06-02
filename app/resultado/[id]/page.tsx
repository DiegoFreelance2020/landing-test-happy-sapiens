import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSupabase } from "@/lib/supabase-server";
import { bandForScore } from "@/lib/score";
import {
  RESULT_BANDS,
  CTA_TIENDA_URL,
  CTA_COMUNIDAD_URL,
  MAX_SCORE,
} from "@/lib/quiz-data";
import { ShareButtons } from "@/components/ShareButtons";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

async function loadSubmission(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("quiz_submissions")
    .select("id, name, score, result_key, created_at")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as {
    id: string;
    name: string;
    score: number;
    result_key: string;
    created_at: string;
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const sub = await loadSubmission(id);
  if (!sub) return { title: "Resultado" };
  const band =
    RESULT_BANDS.find((b) => b.key === sub.result_key) ?? bandForScore(sub.score);
  const title = `${band.heading} · Test de Bienestar`;
  const description = band.message;
  const url = absoluteUrl(`/resultado/${sub.id}`);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "article",
    },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: url },
  };
}

export default async function ResultPage({ params }: Params) {
  const { id } = await params;
  const sub = await loadSubmission(id);
  if (!sub) notFound();

  const band =
    RESULT_BANDS.find((b) => b.key === sub.result_key) ?? bandForScore(sub.score);

  const shareUrl = absoluteUrl(`/resultado/${sub.id}`);
  const shareText = `Hice el Test de Bienestar de Happy Sapiens: "${band.heading}". ¿Cómo te sientes tú hoy?`;
  const inviteUrl = absoluteUrl("/");
  const inviteText = "Hice el Test de Bienestar de Happy Sapiens. Tómate 30 segundos para hacerlo tú también:";

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-sage-dark">
          Tu resultado, {sub.name.split(" ")[0]}
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold mt-3 leading-tight">
          {band.heading}
        </h1>
        <p className="mt-4 text-lg text-brand-ink/80 max-w-prose mx-auto">
          {band.message}
        </p>
        <p className="mt-6 text-sm text-brand-sage-dark">
          Puntaje: <strong>{sub.score}</strong> / {MAX_SCORE}
        </p>
      </div>

      <div className="mt-10 card text-center">
        <h2 className="font-display text-xl font-bold">Conoce el ritual Happy Sapiens</h2>
        <p className="mt-2 text-sm text-brand-ink/80 max-w-prose mx-auto">
          Un blend diario con 27 ingredientes naturales y 5 ejes funcionales,
          pensado para acompañar tu energía, digestión, manejo del estrés,
          defensas y protección celular.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={CTA_TIENDA_URL}
            className="btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ir a la tienda
          </a>
        </div>
      </div>

      <div className="mt-10 card">
        <ShareButtons url={shareUrl} text={shareText} />
        <hr className="my-6 border-black/5" />
        <ShareButtons url={inviteUrl} text={inviteText} />
        <p className="text-xs text-black/50 mt-2">
          Comparte el segundo bloque para invitar a alguien a hacer el test desde cero.
        </p>
      </div>

      <div className="mt-10 text-center">
        <Link href="/test" className="text-sm text-brand-sage-dark hover:underline">
          ↻ Volver a hacer el test
        </Link>
      </div>
    </section>
  );
}
