"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const SAMPLE_QUIZZES = [
  {
    id: 1,
    title: "JavaScript Basics",
    description: "Test your JavaScript fundamentals",
    thumbnail: "/javascript-thumb.jpg",
    userScore: 85,
  },
  {
    id: 2,
    title: "React Fundamentals",
    description: "Challenge yourself with React concepts",
    thumbnail: "/react-thumb.jpg",
    userScore: 70,
  },
];

export function QuizCarousel() {
  const router = useRouter();

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-500";
    if (score >= 50) return "text-orange-500";
    return "text-red-500";
  };

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
              <CardContent>
                <div className="relative aspect-video w-full">
                  <Image
                    src={quiz.thumbnail}
                    alt={quiz.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <p className="mt-4">{quiz.description}</p>
              </CardContent>
              <CardFooter>
                <div className="w-full flex justify-between items-center">
                  <span>Your score:</span>
                  <span className={cn("font-bold", getScoreColor(quiz.userScore))}>
                    {quiz.userScore}%
                  </span>
                </div>
              </CardFooter>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
} 