"use client";

interface CircleTimerProps {
  timeLeft: number;
  totalTime: number;
}

export function CircleTimer({ timeLeft, totalTime }: CircleTimerProps) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = ((totalTime - timeLeft) / totalTime) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90 w-20 h-20">
        {/* Background circle */}
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-muted"
        />
        {/* Timer circle */}
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="text-primary transition-all duration-1000 ease-linear"
        />
      </svg>
      <span className="absolute text-lg font-bold">{timeLeft}s</span>
    </div>
  );
} 