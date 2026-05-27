// Datos del Test de Bienestar Happy Sapiens.
// Editar este archivo para cambiar preguntas, puntajes o rangos de resultado.

export type Axis = "Balance" | "Energía" | "Digestión" | "Estrés" | "Vitalidad";

export type Tone = "green" | "yellow" | "orange" | "red" | "blue";

export interface Option {
  id: string;
  tone: Tone;
  label: string;
  points: number;
  axis: Axis;
}

export interface Question {
  id: string;
  title: string;
  options: Option[];
}

export interface ResultBand {
  key: string;
  min: number;
  max: number;
  heading: string;
  message: string;
}

export const QUIZ_TITLE = "TEST DE BIENESTAR";
export const QUIZ_SUBTITLE = "En 30 segundos.";
export const QUIZ_INTRO = "Descubre qué podría necesitar más atención hoy.";

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    title: "¿Cómo te has sentido al empezar el día?",
    options: [
      { id: "q1a", tone: "green",  label: "Me despierto con energía y sostengo el ritmo", points: 1, axis: "Balance"  },
      { id: "q1b", tone: "yellow", label: "Necesito tiempo o café para arrancar",        points: 2, axis: "Energía"  },
      { id: "q1c", tone: "orange", label: "Tengo bajones durante el día",                points: 3, axis: "Energía"  },
      { id: "q1d", tone: "red",    label: "Llego sin batería al final del día",          points: 4, axis: "Energía"  },
    ],
  },
  {
    id: "q2",
    title: "Después de comer normalmente…",
    options: [
      { id: "q2a", tone: "green",  label: "Me siento bien",                              points: 1, axis: "Balance"   },
      { id: "q2b", tone: "yellow", label: "A veces me siento pesad@",                    points: 2, axis: "Digestión" },
      { id: "q2c", tone: "orange", label: "Me siento inflamado o incómod@",              points: 3, axis: "Digestión" },
      { id: "q2d", tone: "red",    label: "Siento que comer bien no siempre se refleja", points: 4, axis: "Digestión" },
    ],
  },
  {
    id: "q3",
    title: "Últimamente sientes que…",
    options: [
      { id: "q3a", tone: "green",  label: "Tengo espacios para desconectarme",  points: 1, axis: "Balance" },
      { id: "q3b", tone: "yellow", label: "Voy acelerado",                      points: 2, axis: "Estrés"  },
      { id: "q3c", tone: "orange", label: "Mi cabeza nunca para",               points: 3, axis: "Estrés"  },
      { id: "q3d", tone: "red",    label: "Estoy funcionando en automático",    points: 4, axis: "Estrés"  },
    ],
  },
  {
    id: "q4",
    title: "En las últimas semanas…",
    options: [
      { id: "q4a", tone: "green",  label: "Me he sentido estable",     points: 1, axis: "Balance"   },
      { id: "q4b", tone: "yellow", label: "Me cuesta recuperarme",     points: 2, axis: "Vitalidad" },
      { id: "q4c", tone: "orange", label: "Me siento más agotad@",     points: 3, axis: "Vitalidad" },
      { id: "q4d", tone: "red",    label: "El cuerpo me pasa factura", points: 4, axis: "Vitalidad" },
    ],
  },
  {
    id: "q5",
    title: "Hoy te gustaría sentir…",
    options: [
      { id: "q5a", tone: "yellow", label: "Más energía",   points: 3, axis: "Energía"   },
      { id: "q5b", tone: "green",  label: "Más equilibrio", points: 3, axis: "Balance"   },
      { id: "q5c", tone: "orange", label: "Más calma",      points: 3, axis: "Estrés"    },
      { id: "q5d", tone: "blue",   label: "Más ligereza",   points: 3, axis: "Digestión" },
    ],
  },
];

export const RESULT_BANDS: ResultBand[] = [
  {
    key: "vas-bien",
    min: 0,
    max: 7,
    heading: "VAS BIEN",
    message:
      "Tu cuerpo parece estar encontrando equilibrio. El reto es sostener los rituales.",
  },
  {
    key: "consistencia",
    min: 8,
    max: 11,
    heading: "TU CUERPO PODRÍA ESTAR PIDIENDO MÁS CONSISTENCIA",
    message:
      "A veces no es hacer más. Es crear rituales simples.",
  },
  {
    key: "pausa",
    min: 12,
    max: 15,
    heading: "TAL VEZ ES MOMENTO DE HACER UNA PAUSA",
    message:
      "Tu bienestar podría estar pidiendo más atención.",
  },
  {
    key: "senales",
    min: 16,
    max: 20,
    heading: "TU CUERPO TE ESTÁ DANDO SEÑALES",
    message:
      "No significa que algo esté mal. Puede ser un buen momento para simplificar cómo te cuidas.",
  },
];

export const MAX_SCORE = QUESTIONS.reduce(
  (sum, q) => sum + Math.max(...q.options.map((o) => o.points)),
  0,
);

export const MIN_SCORE = QUESTIONS.reduce(
  (sum, q) => sum + Math.min(...q.options.map((o) => o.points)),
  0,
);

// URLs de los CTAs finales. Reemplazar con las URLs reales antes de salir a producción.
export const CTA_TIENDA_URL = "https://happysapiens.co/";
export const CTA_COMUNIDAD_URL = "https://comunidad.happysapiens.co/subscribe";
