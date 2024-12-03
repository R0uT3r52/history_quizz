interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function CircularProgress({
  value,
  size = 180,
  strokeWidth = 12,
  className = "",
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className={`relative w-[${size}px] h-[${size}px] ${className}`}>
      <svg
        className="transform -rotate-90 w-full h-full"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          className="text-muted-foreground/10"
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className={`${getScoreColor(value)} transition-all duration-300 ease-in-out`}
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`${getScoreColor(value)} text-2xl font-bold`}>
          {value}%
        </span>
      </div>
    </div>
  );
} 