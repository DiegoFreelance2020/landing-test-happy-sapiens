import type { Metadata } from "next";
import { QuizForm } from "@/components/QuizForm";

export const metadata: Metadata = {
  title: "Test",
  description: "Responde 5 preguntas en 30 segundos.",
};

export default function TestPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <QuizForm />
    </section>
  );
}
