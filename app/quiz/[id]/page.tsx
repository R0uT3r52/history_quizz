/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { QuizResults } from "@/components/quiz-results";
import { CircleTimer } from "@/components/circle-timer";
import { DragDropQuestion } from "@/components/drag-drop-question";
import { Checkbox } from "@/components/ui/checkbox";
import { getQuizById, submitQuizResult, type QuizDetails } from "@/lib/api";
import { getTelegramUser } from "@/lib/telegram-user";

const QUESTION_TIME = 30; // Time in seconds for each question

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

export type Question = MultipleChoiceQuestion | DragDropQuestion;

export default function QuizPage({ params }: { params: { id: string } }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [dragDropAnswers, setDragDropAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [isFinished, setIsFinished] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [userAnswers, setUserAnswers] = useState<(number | number[] | string[])[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quiz, setQuiz] = useState<QuizDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await getQuizById(parseInt(params.id));
        setQuiz(data);
      } catch (error) {
        console.error('Failed to fetch quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [params.id]);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setTimeout(() => handleNextQuestion(), 1000);
    }
  }, [timeLeft, isFinished]);

  const handleAnswerSelect = (index: number) => {
    const question = quiz?.questions[currentQuestion];
    if (question?.type === "multiple-choice" && question.multiSelect) {
      setSelectedAnswers(prev => {
        if (prev.includes(index)) {
          return prev.filter(i => i !== index);
        }
        return [...prev, index];
      });
    } else {
      setSelectedAnswer(index);
    }
  };

  const handleDragDropComplete = (answers: string[]) => {
    setDragDropAnswers(answers);
  };

  const handleNextQuestion = async () => {
    const question = quiz?.questions[currentQuestion];
    let isCorrect = false;
    let currentAnswers: number | number[] | string[] = [];
    let pointsEarned = 0;

    if (question?.type === "multiple-choice") {
      if (question.multiSelect) {
        pointsEarned = selectedAnswers.reduce((points, answer) => {
          return points + (question.correctAnswers!.includes(answer) ? 1 : 0);
        }, 0);
        pointsEarned -= selectedAnswers.filter(answer => 
          !question.correctAnswers!.includes(answer)
        ).length;
        pointsEarned = Math.max(0, pointsEarned);
        
        isCorrect = pointsEarned > 0;
        currentAnswers = selectedAnswers;
      } else {
        isCorrect = selectedAnswer === question.correctAnswer;
        pointsEarned = isCorrect ? 1 : 0;
        currentAnswers = selectedAnswer ?? -1;
      }
    } else if (question?.type === "drag-drop") {
      currentAnswers = dragDropAnswers;
      
      pointsEarned = dragDropAnswers.reduce((points, answer, index) => {
        if (!answer) return points;
        return points + (answer === question.correctAnswers![index] ? 1 : 0);
      }, 0);
      
      isCorrect = pointsEarned > 0;
    }

    setAnswers([...answers, isCorrect]);
    setUserAnswers([...userAnswers, currentAnswers]);
    
    if (currentQuestion < (quiz?.questions.length ?? 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setSelectedAnswers([]);
      setDragDropAnswers([]);
      setTimeLeft(QUESTION_TIME);
      setScore(score + pointsEarned);
    } else {
      const finalScore = score + pointsEarned;
      const totalPossible = quiz!.questions.reduce((total, q) => {
        if (q.type === "multiple-choice" && q.multiSelect) {
          return total + (q.correctAnswers?.length || 0);
        }
        if (q.type === "drag-drop") {
          return total + q.correctAnswers.length;
        }
        return total + 1;
      }, 0);

      const percentageScore = Math.min(100, Math.round((finalScore / totalPossible) * 100));

      try {
        const user = getTelegramUser();
        const userId = user?.id ?? 0;
        await submitQuizResult({
          user_id: userId,
          quiz_id: parseInt(params.id),
          score: percentageScore,
          answers: userAnswers,
        });
      } catch (error) {
        console.error('Failed to submit quiz results:', error);
      }
      setIsFinished(true);
    }
  };

  const isAllBlanksFilled = () => {
    if (question?.type === "drag-drop") {
      return dragDropAnswers.length === question.blanks && 
             dragDropAnswers.every(answer => answer !== undefined && answer !== "");
    }
    return true;
  };

  if (loading || !quiz) {
    return <div>Loading quiz...</div>;
  }

  const question = quiz.questions[currentQuestion];

  if (isFinished) {
    return (
      <QuizResults 
        score={score} 
        totalQuestions={quiz.questions.length} 
        answers={answers}
        questions={quiz.questions}
        userAnswers={userAnswers}
      />
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="flex flex-col items-center gap-4 mb-8">
        <CircleTimer timeLeft={timeLeft} totalTime={QUESTION_TIME} />
        <div>Question {currentQuestion + 1}/{quiz.questions.length}</div>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-center">{question.question}</h2>
        
        {question.type === "multiple-choice" ? (
          <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
            {question.options.map((option: string, index: number) => (
              question.multiSelect ? (
                <label
                  key={index}
                  className="flex items-center gap-3 w-full p-4 border rounded-md cursor-pointer"
                >
                  <Checkbox
                    checked={selectedAnswers.includes(index)}
                    onCheckedChange={() => handleAnswerSelect(index)}
                  />
                  <span>{option}</span>
                </label>
              ) : (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className="w-full text-center justify-center h-auto p-4"
                  onClick={() => handleAnswerSelect(index)}
                >
                  {option}
                </Button>
              )
            ))}
          </div>
        ) : (
          <DragDropQuestion
            text={question.text!}
            options={question.options!}
            onComplete={handleDragDropComplete}
          />
        )}

        {((question.type === "multiple-choice" && 
           ((question.multiSelect && selectedAnswers.length > 0) || 
            (!question.multiSelect && selectedAnswer !== null))) || 
          (question.type === "drag-drop" && isAllBlanksFilled())) && (
          <div className="flex justify-center">
            <Button 
              className="w-full max-w-md"
              onClick={handleNextQuestion}
            >
              {currentQuestion === quiz.questions.length - 1 ? "Finish Quiz" : "Next Question"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 