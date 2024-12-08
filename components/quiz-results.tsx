/* eslint-disable @typescript-eslint/no-unused-vars */
import { Chart } from "./ui/chart";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

type MultipleChoiceQuestion = {
  id: number;
  type: "multiple-choice";
  question: string;
  options: string[];
  multiSelect: boolean;
  correctAnswer?: number;
  correctAnswers?: number[];
};

type DragDropQuestion = {
  id: number;
  type: "drag-drop";
  question: string;
  text: string;
  options: string[];
  correctAnswers: string[];
  blanks: number;
};

type Question = MultipleChoiceQuestion | DragDropQuestion;

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  answers: boolean[];
  questions: Question[];
  userAnswers: (number | number[] | string[])[];
}

export function QuizResults({ 
  score, 
  totalQuestions, 
  answers, 
  questions,
  userAnswers 
}: QuizResultsProps) {
  const totalPossible = questions.reduce((total, q) => {
    if (q.type === "multiple-choice" && q.multiSelect) {
      return total + (q.correctAnswers?.length || 0);
    }
    if (q.type === "drag-drop") {
      return total + q.correctAnswers.length;
    }
    return total + 1;
  }, 0);

  const earnedPoints = questions.reduce((total, q, qIndex) => {
    if (q.type === "multiple-choice") {
      if (q.multiSelect) {
        const userAns = userAnswers[qIndex] as number[];
        const correct = userAns.filter(a => q.correctAnswers?.includes(a)).length;
        const incorrect = userAns.filter(a => !q.correctAnswers?.includes(a)).length;
        return total + Math.max(0, correct - incorrect);
      }
      return total + (answers[qIndex] ? 1 : 0);
    }
    if (q.type === "drag-drop") {
      const dragAns = userAnswers[qIndex] as string[];
      return total + dragAns.filter((a, i) => a === q.correctAnswers[i]).length;
    }
    return total;
  }, 0);

  const percentage = Math.min(100, Math.round((earnedPoints / totalPossible) * 100));

  const getScoreColor = (percentage: number) => {
    if (percentage >= 70) return "text-green-500";
    if (percentage >= 50) return "text-orange-500";
    return "text-red-500";
  };

  const chartData = {
    labels: ['Correct', 'Wrong'],
    datasets: [
      {
        data: [earnedPoints, totalPossible - earnedPoints],
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
        <p>({earnedPoints} out of {totalPossible} points)</p>
      </div>

      <div className="w-64 h-64 mx-auto mb-12">
        <Chart data={chartData} />
      </div>

      <div className="space-y-8 mb-8">
        {questions.map((question, qIndex) => (
          <div key={qIndex} className="text-left p-4 border rounded-lg">
            <h3 className="font-bold mb-4">
              {qIndex + 1}. {question.question}
            </h3>
            {question.type === "multiple-choice" && (
              <div className="space-y-2">
                {question.options.map((option, oIndex) => {
                  const userAnswer = userAnswers[qIndex];
                  const isSelected = Array.isArray(userAnswer)
                    ? (userAnswer as number[]).includes(oIndex)
                    : userAnswer === oIndex;
                  
                  const isCorrect = question.multiSelect
                    ? question.correctAnswers?.includes(oIndex)
                    : question.correctAnswer === oIndex;

                  return (
                    <div
                      key={oIndex}
                      className={cn(
                        "p-3 rounded-md",
                        isCorrect && isSelected && "bg-green-100 text-green-500",
                        isCorrect && !isSelected && "bg-gray-100 text-gray-500",
                        !isCorrect && isSelected && "bg-red-100 text-red-500",
                      )}
                    >
                      {option}
                    </div>
                  );
                })}
              </div>
            )}
            {question.type === "drag-drop" && (
              <div className="text-lg flex flex-wrap items-center gap-2">
                {question.text.split("[BLANK]").map((part, index, array) => (
                  <span key={index} className="inline-flex items-center gap-2">
                    {part}
                    {index < array.length - 1 && (
                      <span className={cn(
                        "px-4 py-1 rounded font-bold inline-block my-1",
                        (userAnswers[qIndex] as string[])[index] 
                          ? ((userAnswers[qIndex] as string[])[index] === question.correctAnswers[index]
                            ? "bg-green-100 text-green-500"
                            : "bg-red-100 text-red-500")
                          : "bg-gray-100 text-gray-500"
                      )}>
                        {(userAnswers[qIndex] as string[])[index] || 
                          `[${question.correctAnswers[index]}]`}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Button
        className="w-full max-w-md"
        onClick={() => window.location.href = '/'}
      >
        Back to Home
      </Button>
    </div>
  );
} 