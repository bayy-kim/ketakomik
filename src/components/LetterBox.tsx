"use client";

import { motion } from "framer-motion";

export type LetterState = "EMPTY" | "TYPING" | "CORRECT" | "PRESENT" | "ABSENT";

interface LetterBoxProps {
  letter?: string;
  state?: LetterState;
  delayIndex?: number;
}

export function LetterBox({ letter = "", state = "EMPTY", delayIndex = 0 }: LetterBoxProps) {
  const isRevealed = state === "CORRECT" || state === "PRESENT" || state === "ABSENT";

  let bgColor = "bg-white";
  let textColor = "text-comic-ink";
  let borderColor = "border-comic-ink";

  if (state === "CORRECT") {
    bgColor = "bg-comic-correct";
    textColor = "text-white";
    borderColor = "border-comic-ink";
  } else if (state === "PRESENT") {
    bgColor = "bg-comic-present";
    textColor = "text-comic-ink";
    borderColor = "border-comic-ink";
  } else if (state === "ABSENT") {
    bgColor = "bg-comic-absent";
    textColor = "text-white";
    borderColor = "border-comic-ink";
  } else if (state === "TYPING") {
    bgColor = "bg-yellow-50";
    borderColor = "border-comic-ink";
  }

  return (
    <div className="w-11 h-11 sm:w-14 sm:h-14 perspective-1000 select-none">
      <motion.div
        className="w-full h-full relative transform-style-3d transition-transform duration-500"
        initial={false}
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ delay: delayIndex * 0.1, duration: 0.5 }}
      >
        {/* Front Face (Typing / Empty) */}
        <div
          className={`absolute w-full h-full backface-hidden flex items-center justify-center border-[3px] ${borderColor} ${bgColor} rounded-md comic-shadow-sm font-bangers text-2xl sm:text-3xl text-comic-ink`}
        >
          {letter}
        </div>

        {/* Back Face (Revealed with Feedback Color) */}
        <div
          className={`absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center border-[3px] border-comic-ink ${bgColor} rounded-md comic-shadow-sm font-bangers text-2xl sm:text-3xl ${textColor}`}
        >
          {letter}
        </div>
      </motion.div>
    </div>
  );
}
