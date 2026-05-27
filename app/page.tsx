import Link from "next/link";
import { QUIZ_TITLE, QUIZ_SUBTITLE, QUIZ_INTRO, QUESTIONS } from "@/lib/quiz-data";

export default function Home() {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
      <p className="uppercase tracking-[0.2em] text-brand-sage-dark text-sm mb-4">
        {QUIZ_SUBTITLE}
      </p>
      <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-brand-ink leading-tight">
        {QUIZ_TITLE}
      </h1>
      <p className="mt-6 text-lg sm:text-xl text-brand-ink/80 max-w-prose mx-auto">
        {QUIZ_INTRO}
      </p>
      <p className="mt-3 text-sm text-brand-sage-dark">
        ({QUESTIONS.length} preguntas · 1 respuesta por pregunta)
      </p>

      <div className="mt-10">
        <Link href="/test" className="btn-primary">
          Empezar el test
        </Link>
      </div>

      <div className="mt-20 grid sm:grid-cols-3 gap-4 text-left">
        <Feature title="30 segundos" body="Es rápido. No tienes que pensar mucho." />
        <Feature title="Sin juicios" body="No hay respuestas buenas o malas." />
        <Feature title="Para ti" body="Recibe una lectura sobre cómo está tu día." />
      </div>
    </section>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="card">
      <h3 className="font-semibold text-brand-sage-dark">{title}</h3>
      <p className="mt-1 text-sm text-brand-ink/80">{body}</p>
    </div>
  );
}
