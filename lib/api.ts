/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Question } from "@/app/quiz/[id]/page";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Quiz {
  id: number;
  title: string;
  description: string;
  userScore: number;
  is_repassable: boolean;
}

export interface QuizDetails {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

export async function getQuizzes(userId: number): Promise<Quiz[]> {
  const response = await fetch(`${API_BASE_URL}/quizzes?user_id=${userId}`);
  if (!response.ok) throw new Error('Failed to fetch quizzes');
  return response.json();
}

export async function getQuizById(quizId: number): Promise<QuizDetails> {
  const response = await fetch(`${API_BASE_URL}/quiz/${quizId}`);
  if (!response.ok) throw new Error('Failed to fetch quiz');
  return response.json();
}

export async function submitQuizResult(data: {
  user_id: number;
  quiz_id: number;
  score: number;
  answers: any[];
}) {
  const response = await fetch(`${API_BASE_URL}/quiz/${data.quiz_id}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to submit quiz results');
  return response.json();
} 