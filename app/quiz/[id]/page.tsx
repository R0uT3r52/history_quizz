"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { QuizResults } from "@/components/quiz-results";
import { CircleTimer } from "@/components/circle-timer";
import { DragDropQuestion } from "@/components/drag-drop-question";

// This would typically come from your API
const SAMPLE_QUIZ = {
  questions: [
    {
      id: 1,
      type: "multiple-choice",
      question: "What is JavaScript?",
      options: [
        "A programming language",
        "A markup language",
        "A styling language",
        "A database",
      ],
      correctAnswer: 0,
    },
    {
      id: 2,
      type: "drag-drop",
      question: "Complete the sentence",
      text: "React is a [BLANK] library for building [BLANK] interfaces.",
      options: ["JavaScript", "user"],
      correctAnswers: ["JavaScript", "user"],
      blanks: 2
    }
  ],
};

const QUESTION_TIME = 5; //20

export default function QuizPage({ params }: { params: { id: string } }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [dragDropAnswers, setDragDropAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [isFinished, setIsFinished] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [userAnswers, setUserAnswers] = useState<(number | string[])[]>([]);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setTimeout(() => handleNextQuestion(), 1000);
    }
  }, [timeLeft, isFinished]);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleDragDropComplete = (answers: string[]) => {
    setDragDropAnswers(answers);
  };

  const handleNextQuestion = () => {
    const question = SAMPLE_QUIZ.questions[currentQuestion];
    let isCorrect = false;
    let currentAnswers: number | string[] = [];

    if (question.type === "multiple-choice") {
      if (selectedAnswer === null) {
        isCorrect = false;
        currentAnswers = -1;
      } else {
        isCorrect = selectedAnswer === question.correctAnswer;
        currentAnswers = selectedAnswer;
      }
    } else if (question.type === "drag-drop") {
      currentAnswers = Array(question.blanks).fill("").map((_, index) => 
        dragDropAnswers[index] || ""
      );
      
      isCorrect = currentAnswers.every((answer, index) => 
        answer === question.correctAnswers![index]
      );
    }

    setAnswers([...answers, isCorrect]);
    setUserAnswers([...userAnswers, currentAnswers]);
    
    if (currentQuestion < SAMPLE_QUIZ.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setDragDropAnswers([]);
      setTimeLeft(QUESTION_TIME);
      if (isCorrect) setScore(score + 1);
    } else {
      if (isCorrect) setScore(score + 1);
      setIsFinished(true);
    }
  };

  const isAllBlanksFilled = () => {
    if (question.type === "drag-drop") {
      return dragDropAnswers.length === question.blanks && 
             dragDropAnswers.every(answer => answer !== undefined && answer !== "");
    }
    return true;
  };

  if (isFinished) {
    return (
      <QuizResults 
        score={score} 
        totalQuestions={SAMPLE_QUIZ.questions.length} 
        answers={answers}
        questions={SAMPLE_QUIZ.questions}
        userAnswers={userAnswers}
      />
    );
  }

  const question = SAMPLE_QUIZ.questions[currentQuestion];

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="flex flex-col items-center gap-4 mb-8">
        <CircleTimer timeLeft={timeLeft} totalTime={QUESTION_TIME} />
        <div>Question {currentQuestion + 1}/{SAMPLE_QUIZ.questions.length}</div>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-center">{question.question}</h2>
        
        {question.type === "multiple-choice" ? (
          <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? "default" : "outline"}
                className="w-full text-center justify-center h-auto p-4"
                onClick={() => handleAnswerSelect(index)}
              >
                {option}
              </Button>
            ))}
          </div>
        ) : (
          <DragDropQuestion
            text={question.text}
            options={question.options}
            onComplete={handleDragDropComplete}
          />
        )}

        {((question.type === "multiple-choice" && selectedAnswer !== null) || 
          (question.type === "drag-drop" && isAllBlanksFilled())) && (
          <div className="flex justify-center">
            <Button 
              className="w-full max-w-md"
              onClick={handleNextQuestion}
            >
              {currentQuestion === SAMPLE_QUIZ.questions.length - 1 ? "Finish Quiz" : "Next Question"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 