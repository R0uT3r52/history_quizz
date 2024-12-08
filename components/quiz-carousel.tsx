"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { useRouter } from "next/navigation";
import { CircularProgress } from "./ui/circular-progress";
import { getQuizzes, type Quiz } from "@/lib/api";
import { getTelegramUser } from "@/lib/telegram-user";
import { cn } from "@/lib/utils";

export function QuizCarousel() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const user = getTelegramUser();
        const userId = user?.id ?? 0;
        const data = await getQuizzes(userId);
        console.log('Fetched quizzes:', data);
        setQuizzes(data);
      } catch (error) {
        console.error('Failed to fetch quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return <div>Loading quizzes...</div>;
  }

  return (
    <Carousel className="w-full max-w-5xl mx-auto">
      <CarouselContent className="-ml-2 md:-ml-4">
        {quizzes.map((quiz) => (
          <CarouselItem key={quiz.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 flex items-stretch">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow flex-1"
              onClick={() => router.push(`/quiz/${quiz.id}`)}
            >
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
                <div className={cn(
                  "text-sm font-medium",
                  quiz.is_repassable ? "text-green-500" : "text-orange-500"
                )}>
                  {quiz.is_repassable ? "Practice Quiz" : "One Attempt Only"}
                </div>
              </CardHeader>
              <CardContent className="space-y-10">
                <p>{quiz.description}</p>
                <div className="flex justify-center">
                  <CircularProgress value={quiz.userScore} />
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
} 