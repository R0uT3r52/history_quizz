"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { QuizResults } from "@/components/quiz-results";
import { CircleTimer } from "@/components/circle-timer";
import { DragDropQuestion } from "@/components/drag-drop-question";
import { Checkbox } from "@/components/ui/checkbox";

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
      multiSelect: false,
    },
    {
      id: 2,
      type: "multiple-choice",
      question: "Which of these are JavaScript frameworks/libraries?",
      options: [
        "React",
        "Angular",
        "Vue",
        "Python"
      ],
      correctAnswers: [0, 1, 2],
      multiSelect: true,
    },
    {
      id: 3,
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
  const [userAnswers, setUserAnswers] = useState<(number | number[] | string[])[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setTimeout(() => handleNextQuestion(), 1000);
    }
  }, [timeLeft, isFinished]);

  const handleAnswerSelect = (index: number) => {
    const question = SAMPLE_QUIZ.questions[currentQuestion];
    if (question.multiSelect) {
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

  const handleNextQuestion = () => {
    const question = SAMPLE_QUIZ.questions[currentQuestion];
    let isCorrect = false;
    let currentAnswers: number | number[] | string[] = [];

    if (question.type === "multiple-choice") {
      if (question.multiSelect) {
        isCorrect = question.correctAnswers!.length === selectedAnswers.length &&
                   question.correctAnswers!.every(answer => selectedAnswers.includes(answer));
        currentAnswers = selectedAnswers;
      } else {
        isCorrect = selectedAnswer === question.correctAnswer;
        currentAnswers = selectedAnswer ?? -1;
      }
    } else if (question.type === "drag-drop") {
      currentAnswers = dragDropAnswers;
      
      const correctCount = dragDropAnswers.reduce((count, answer, index) => {
        if (!answer) return count;
        return count + (answer === question.correctAnswers![index] ? 1 : 0);
      }, 0);
      
      if (correctCount > 0) {
        isCorrect = true;
        setScore(score + (correctCount / question.blanks!));
      }
    }

    setAnswers([...answers, isCorrect]);
    setUserAnswers([...userAnswers, currentAnswers]);
    
    if (currentQuestion < SAMPLE_QUIZ.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setSelectedAnswers([]);
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
              {currentQuestion === SAMPLE_QUIZ.questions.length - 1 ? "Finish Quiz" : "Next Question"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 