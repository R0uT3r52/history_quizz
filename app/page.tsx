import { QuizCarousel } from "@/components/quiz-carousel";

export default function Home() {
  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col justify-center">
      <main className="container mx-auto flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center mb-8">Quiz App</h1>
        <div className="w-full flex justify-center">
          <QuizCarousel />
        </div>
      </main>
    </div>
  );
}
