"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS, type Option } from "@/lib/quiz-data";

type Step = "user" | "quiz" | "submitting";

const toneClasses: Record<Option["tone"], string> = {
  green:  "before:bg-emerald-500",
  yellow: "before:bg-amber-400",
  orange: "before:bg-orange-500",
  red:    "before:bg-red-500",
  blue:   "before:bg-sky-400",
};

export function QuizForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const total = QUESTIONS.length;
  const progress = useMemo(() => {
    if (step === "user") return 0;
    return Math.round(((currentQ + (step === "submitting" ? 1 : 0)) / total) * 100);
  }, [step, currentQ, total]);

  function startQuiz(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 2) {
      setError("Por favor escribe tu nombre.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Por favor escribe un correo válido.");
      return;
    }
    setStep("quiz");
  }

  function selectOption(questionId: string, optionId: string) {
    const next = { ...answers, [questionId]: optionId };
    setAnswers(next);

    if (currentQ < total - 1) {
      // Pequeño delay para que el usuario alcance a ver la selección.
      setTimeout(() => setCurrentQ((c) => c + 1), 180);
    } else {
      void submit(next);
    }
  }

  async function submit(finalAnswers: Record<string, string>) {
    setStep("submitting");
    setError(null);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), answers: finalAnswers }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "No se pudo guardar tu respuesta.");
      }
      const data = (await res.json()) as { id: string };
      router.push(`/resultado/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setStep("quiz");
    }
  }

  if (step === "user") {
    return (
      <form onSubmit={startQuiz} className="card max-w-xl mx-auto space-y-5">
        <div>
          <h2 className="font-display text-2xl font-bold">Antes de empezar</h2>
          <p className="text-sm text-brand-ink/70 mt-1">
            Solo necesitamos tu nombre y correo para enviarte el resultado.
          </p>
        </div>
        <Field
          label="Tu nombre"
          value={name}
          onChange={setName}
          autoComplete="name"
          required
        />
        <Field
          label="Tu correo"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="btn-primary w-full">
          Empezar
        </button>
        <p className="text-xs text-black/50 text-center">
          Al continuar aceptas que guardemos tus datos para enviarte el resultado.
        </p>
      </form>
    );
  }

  const question = QUESTIONS[currentQ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between text-xs text-brand-sage-dark mb-2">
          <span>Pregunta {currentQ + 1} de {total}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 bg-brand-mint/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-sage transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="card">
        <h2 className="font-display text-2xl sm:text-3xl font-bold leading-snug">
          {currentQ + 1}. {question.title}
        </h2>
        <div className="mt-6 space-y-3">
          {question.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => selectOption(question.id, opt.id)}
              aria-pressed={answers[question.id] === opt.id}
              disabled={step === "submitting"}
              className={`option-button relative pl-12 before:absolute before:left-4 before:top-1/2 before:-translate-y-1/2 before:w-4 before:h-4 before:rounded-full ${toneClasses[opt.tone]}`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

        {step === "submitting" && (
          <p className="text-sm text-brand-sage-dark mt-4 text-center">
            Guardando tu resultado…
          </p>
        )}

        {currentQ > 0 && step !== "submitting" && (
          <button
            type="button"
            onClick={() => setCurrentQ((c) => c - 1)}
            className="mt-6 text-sm text-brand-sage-dark hover:underline"
          >
            ← Volver a la anterior
          </button>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-brand-ink mb-1">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border-2 border-black/10 focus:border-brand-sage focus:outline-none bg-white"
        {...rest}
      />
    </label>
  );
}
