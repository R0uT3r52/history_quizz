import { Chart } from "./ui/chart";
import { cn } from "@/lib/utils";

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  answers: boolean[];
}

export function QuizResults({ score, totalQuestions, answers }: QuizResultsProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const correctAnswers = answers.filter(a => a).length;
  const wrongAnswers = answers.filter(a => !a).length;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 70) return "text-green-500";
    if (percentage >= 50) return "text-orange-500";
    return "text-red-500";
  };

  const chartData = {
    labels: ['Correct', 'Wrong'],
    datasets: [
      {
        data: [correctAnswers, wrongAnswers],
        backgroundColor: ['#4ade80', '#f87171'],
      },
    ],
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl text-center">
      <h2 className="text-3xl font-bold mb-8">Quiz Results</h2>
      
      <div className="mb-8">
        <p className={cn("text-2xl font-bold", getScoreColor(percentage))}>
          Your score: {percentage}%
        </p>
        <p>({score} out of {totalQuestions} questions correct)</p>
      </div>

      <div className="w-64 h-64 mx-auto">
        <Chart data={chartData} />
      </div>

      <button
        className="mt-8 px-6 py-2 bg-primary text-primary-foreground rounded-full"
        onClick={() => window.location.href = '/'}
      >
        Back to Home
      </button>
    </div>
  );
} 