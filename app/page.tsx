import { QuizCarousel } from "@/components/quiz-carousel";

export default function Home() {
  return (
    <div className="min-h-screen p-4 sm:p-8">
      <main className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Quiz App</h1>
        <QuizCarousel />
      </main>
    </div>
  );
}
