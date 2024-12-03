"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { useRouter } from "next/navigation";
import { CircularProgress } from "./ui/circular-progress";

const SAMPLE_QUIZZES = [
  {
    id: 1,
    title: "JavaScript Basics",
    description: "Test your JavaScript fundamentals",
    userScore: 85,
  },
  {
    id: 2,
    title: "React Fundamentals",
    description: "Challenge yourself with React concepts",
    userScore: 70,
  },
];

export function QuizCarousel() {
  const router = useRouter();

  return (
    <Carousel className="w-full max-w-5xl mx-auto">
      <CarouselContent className="-ml-2 md:-ml-4">
        {SAMPLE_QUIZZES.map((quiz) => (
          <CarouselItem key={quiz.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 flex items-stretch">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow flex-1"
              onClick={() => router.push(`/quiz/${quiz.id}`)}
            >
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
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