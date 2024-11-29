"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DragDropQuestionProps {
  text: string;
  options: string[];
  onComplete: (answers: string[]) => void;
}

export function DragDropQuestion({ text, options, onComplete }: DragDropQuestionProps) {
  const blankCount = text.split("[BLANK]").length - 1;
  const [answers, setAnswers] = useState<string[]>(Array(blankCount).fill(""));
  const [draggingOption, setDraggingOption] = useState<string | null>(null);

  const handleDragStart = (option: string) => {
    setDraggingOption(option);
  };

  const handleDragEnd = () => {
    setDraggingOption(null);
  };

  const handleDrop = (index: number) => {
    if (draggingOption) {
      const newAnswers = [...answers];
      newAnswers[index] = draggingOption;
      setAnswers(newAnswers);
      if (newAnswers.every(answer => answer !== "")) {
        onComplete(newAnswers);
      }
    }
  };

  useEffect(() => {
    if (answers.some(answer => answer === "")) {
      onComplete([]);
    }
  }, [answers, onComplete]);

  const textParts = text.split("[BLANK]");

  return (
    <div className="space-y-8">
      <div className="text-center text-lg flex flex-wrap justify-center items-center gap-2">
        {textParts.map((part, index) => (
          <span key={index} className="inline-flex items-center gap-2">
            {part}
            {index < textParts.length - 1 && (
              <span
                className={cn(
                  "px-4 py-1 border-2 border-dashed rounded min-w-[100px] inline-block my-1",
                  answers[index] !== "" ? "border-primary" : "border-gray-300"
                )}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(index);
                }}
              >
                {answers[index] !== "" ? (
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-bold text-primary"
                  >
                    {answers[index]}
                  </motion.span>
                ) : "..."}
              </span>
            )}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <AnimatePresence>
          {options.map((option) => {
            const isUsed = answers.includes(option);
            return !isUsed && (
              <motion.div
                key={option}
                draggable
                onDragStart={() => handleDragStart(option)}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileDrag={{ scale: 1.1 }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-move"
              >
                {option}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
} 