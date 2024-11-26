"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { QuizResults } from "@/components/quiz-results";

// This would typically come from your API
const SAMPLE_QUIZ = {
  questions: [
    {
      id: 1,
      question: "What is JavaScript?",
      options: [
        "A programming language",
        "A markup language",
        "A styling language",
        "A database",
      ],
      correctAnswer: 0,
    },
    // Add more questions
  ],
};

export default function QuizPage({ params }: { params: { id: string } }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isFinished, setIsFinished] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft, isFinished]);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    const isCorrect = index === SAMPLE_QUIZ.questions[currentQuestion].correctAnswer;
    if (isCorrect) setScore(score + 1);
    setAnswers([...answers, isCorrect]);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < SAMPLE_QUIZ.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return <QuizResults score={score} totalQuestions={SAMPLE_QUIZ.questions.length} answers={answers} />;
  }

  const question = SAMPLE_QUIZ.questions[currentQuestion];

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="flex justify-between mb-8">
        <div>Question {currentQuestion + 1}/{SAMPLE_QUIZ.questions.length}</div>
        <div>Time left: {timeLeft}s</div>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold">{question.question}</h2>
        
        <div className="grid gap-4">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === index ? "default" : "outline"}
              className="w-full text-left justify-start h-auto p-4"
              onClick={() => handleAnswerSelect(index)}
              disabled={selectedAnswer !== null}
            >
              {option}
            </Button>
          ))}
        </div>

        {selectedAnswer !== null && (
          <Button 
            className="w-full"
            onClick={handleNextQuestion}
          >
            {currentQuestion === SAMPLE_QUIZ.questions.length - 1 ? "Finish Quiz" : "Next Question"}
          </Button>
        )}
      </div>
    </div>
  );
} 