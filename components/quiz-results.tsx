import { Chart } from "./ui/chart";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

type Question = {
  type: string;
  question: string;
  options?: string[];
  correctAnswer?: number;
  correctAnswers?: string[];
  text?: string;
};

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  answers: boolean[];
  questions: Question[];
  userAnswers: (number | string[])[];
}

export function QuizResults({ 
  score, 
  totalQuestions, 
  answers, 
  questions,
  userAnswers 
}: QuizResultsProps) {
  const actualTotalQuestions = questions.reduce((total, question) => {
    if (question.type === "drag-drop") {
      return total + question.correctAnswers!.length;
    }
    return total + 1;
  }, 0);

  const correctAnswersCount = questions.reduce((total, question, qIndex) => {
    if (question.type === "drag-drop") {
      const dragDropAnswers = userAnswers[qIndex] as string[];
      return total + dragDropAnswers.filter(
        (answer, i) => answer === question.correctAnswers![i]
      ).length;
    }
    return total + (answers[qIndex] ? 1 : 0);
  }, 0);

  const percentage = Math.round((correctAnswersCount / actualTotalQuestions) * 100);
  const wrongAnswersCount = actualTotalQuestions - correctAnswersCount;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 70) return "text-green-500";
    if (percentage >= 50) return "text-orange-500";
    return "text-red-500";
  };

  const chartData = {
    labels: ['Correct', 'Wrong'],
    datasets: [
      {
        data: [correctAnswersCount, wrongAnswersCount],
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
        <p>({correctAnswersCount} out of {actualTotalQuestions} answers correct)</p>
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
            {question.type === "multiple-choice" ? (
              <div className="space-y-2">
                {question.options!.map((option, oIndex) => {
                  const isSelected = question.multiSelect 
                    ? (userAnswers[qIndex] as number[]).includes(oIndex)
                    : userAnswers[qIndex] === oIndex;
                  
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
                      {isCorrect && !isSelected}
                      {!isCorrect && isSelected}
                    </div>
                  );
                })}
              </div>
            ) : question.type === "multiple-select" ? (
              <div className="space-y-2">
                {question.options!.map((option, oIndex) => {
                  const userAnswerArray = userAnswers[qIndex] as string[];
                  const isSelected = userAnswerArray.includes(option);
                  const isCorrect = question.correctAnswers!.includes(option);
                  
                  return (
                    <div
                      key={oIndex}
                      className={cn(
                        "p-3 rounded-md",
                        isCorrect && isSelected && "bg-green-100 text-green-700",
                        isCorrect && !isSelected && "bg-yellow-100 text-yellow-700",
                        !isCorrect && isSelected && "bg-red-100 text-red-700"
                      )}
                    >
                      {option}
                      {isCorrect && !isSelected && " (Missed correct answer)"}
                      {!isCorrect && isSelected && " (Incorrect selection)"}
                    </div>
                  );
                })}
              </div>
            ) : question.type === "drag-drop" ? (
              <div className="text-lg flex flex-wrap items-center gap-2">
                {question.text!.split("[BLANK]").map((part, index, array) => (
                  <span key={index} className="inline-flex items-center gap-2">
                    {part}
                    {index < array.length - 1 && (
                      <span className={cn(
                        "px-4 py-1 rounded font-bold inline-block my-1",
                        (userAnswers[qIndex] as string[])[index] 
                          ? ((userAnswers[qIndex] as string[])[index] === question.correctAnswers![index]
                            ? "bg-green-100 text-green-500"
                            : "bg-red-100 text-red-500")
                          : "bg-gray-100 text-gray-500"
                      )}>
                        {(userAnswers[qIndex] as string[])[index] || 
                          `[${question.correctAnswers![index]}]`}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-lg flex flex-wrap items-center gap-2">
                {question.text!.split("[BLANK]").map((part, index, array) => (
                  <span key={index} className="inline-flex items-center gap-2">
                    {part}
                    {index < array.length - 1 && (
                      <span className={cn(
                        "px-4 py-1 rounded font-bold inline-block my-1",
                        (userAnswers[qIndex] as string[])[index] 
                          ? ((userAnswers[qIndex] as string[])[index] === question.correctAnswers![index]
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700")
                          : "bg-gray-100 text-gray-700"
                      )}>
                        {(userAnswers[qIndex] as string[])[index] || ""}
                        {!(userAnswers[qIndex] as string[])[index] && 
                          ` [${question.correctAnswers![index]}]`}
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