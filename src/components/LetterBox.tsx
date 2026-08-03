"use client";

import { motion } from "framer-motion";

export type LetterState = "EMPTY" | "TYPING" | "CORRECT" | "PRESENT" | "ABSENT";

interface LetterBoxProps {
  letter?: string;
  state?: LetterState;
  delayIndex?: number;
  wordLength?: number;
}

export function LetterBox({
  letter = "",
  state = "EMPTY",
  delayIndex = 0,
  wordLength = 5,
}: LetterBoxProps) {
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

  // Precise non-slop adaptive sizes across mobile (320px–430px) and desktop (lg/xl)
  let sizeClasses = "w-10 h-10 sm:w-13 sm:h-13 lg:w-16 lg:h-16 text-2xl sm:text-3xl lg:text-4xl";
  if (wordLength >= 7) {
    sizeClasses = "w-7.5 h-7.5 sm:w-11 sm:h-11 lg:w-13 lg:h-13 text-lg sm:text-2xl lg:text-3xl";
  } else if (wordLength === 6) {
    sizeClasses = "w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-xl sm:text-2xl lg:text-3xl";
  }

  return (
    <div className={`${sizeClasses} perspective-1000 select-none shrink-0`}>
      <motion.div
        className="w-full h-full relative transform-style-3d transition-transform duration-500"
        initial={false}
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ delay: delayIndex * 0.1, duration: 0.5 }}
      >
        {/* Front Face (Typing / Empty) */}
        <div
          className={`absolute w-full h-full backface-hidden flex items-center justify-center border-[2.5px] sm:border-[3px] ${borderColor} ${bgColor} rounded-md comic-shadow-sm font-bangers text-comic-ink`}
        >
          {letter}
        </div>

        {/* Back Face (Revealed with Feedback Color) */}
        <div
          className={`absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center border-[2.5px] sm:border-[3px] border-comic-ink ${bgColor} rounded-md comic-shadow-sm font-bangers ${textColor}`}
        >
          {letter}
        </div>
      </motion.div>
    </div>
  );
}
