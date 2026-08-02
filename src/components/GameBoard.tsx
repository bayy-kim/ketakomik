"use client";

import { LetterBox, LetterState } from "./LetterBox";

interface GameBoardProps {
  wordLength: number;
  maxAttempts?: number;
  guesses: string[];
  feedbacks: LetterState[][];
  currentGuess: string;
  isShaking?: boolean;
}

export function GameBoard({
  wordLength = 5,
  maxAttempts = 6,
  guesses,
  feedbacks,
  currentGuess,
  isShaking = false,
}: GameBoardProps) {
  const emptyRows = Math.max(0, maxAttempts - guesses.length - (guesses.length < maxAttempts ? 1 : 0));

  return (
    <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 my-2">
      {/* Submitted Completed Guesses */}
      {guesses.map((guess, rowIndex) => (
        <div key={rowIndex} className="flex gap-1.5 sm:gap-2">
          {guess.split("").map((letter, colIndex) => (
            <LetterBox
              key={colIndex}
              letter={letter}
              state={feedbacks[rowIndex]?.[colIndex] || "ABSENT"}
              delayIndex={colIndex}
            />
          ))}
        </div>
      ))}

      {/* Active Current Guess Row */}
      {guesses.length < maxAttempts && (
        <div className={`flex gap-1.5 sm:gap-2 ${isShaking ? "animate-comic-shake" : ""}`}>
          {Array.from({ length: wordLength }).map((_, index) => {
            const letter = currentGuess[index] || "";
            return (
              <LetterBox
                key={index}
                letter={letter}
                state={letter ? "TYPING" : "EMPTY"}
              />
            );
          })}
        </div>
      )}

      {/* Empty Unattempted Rows */}
      {Array.from({ length: emptyRows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-1.5 sm:gap-2">
          {Array.from({ length: wordLength }).map((_, colIndex) => (
            <LetterBox key={colIndex} letter="" state="EMPTY" />
          ))}
        </div>
      ))}
    </div>
  );
}
