import { QUESTIONS, RESULT_BANDS, type Option, type ResultBand } from "./quiz-data";

export interface AnswerMap {
  [questionId: string]: string;
}

export function scoreAnswers(answers: AnswerMap): {
  score: number;
  optionsByQuestion: Record<string, Option>;
} {
  const optionsByQuestion: Record<string, Option> = {};
  let total = 0;

  for (const question of QUESTIONS) {
    const optionId = answers[question.id];
    const option = question.options.find((o) => o.id === optionId);
    if (!option) {
      throw new Error(`Falta respuesta para la pregunta "${question.id}"`);
    }
    optionsByQuestion[question.id] = option;
    total += option.points;
  }

  return { score: total, optionsByQuestion };
}

export function bandForScore(score: number): ResultBand {
  const band = RESULT_BANDS.find((b) => score >= b.min && score <= b.max);
  if (!band) {
    // Fallback al último rango si el puntaje queda fuera por algún motivo.
    return RESULT_BANDS[RESULT_BANDS.length - 1];
  }
  return band;
}
