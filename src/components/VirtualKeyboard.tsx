"use client";

import { Delete, CornerDownLeft } from "lucide-react";
import { LetterState } from "./LetterBox";

interface VirtualKeyboardProps {
  onChar: (char: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  letterStatuses?: Record<string, LetterState>;
  disabled?: boolean;
}

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DELETE"],
];

export function VirtualKeyboard({
  onChar,
  onDelete,
  onEnter,
  letterStatuses = {},
  disabled = false,
}: VirtualKeyboardProps) {
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-1.5 p-2 bg-comic-paper comic-border rounded-lg comic-shadow">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 sm:gap-1.5 touch-manipulation">
          {row.map((key) => {
            const status = letterStatuses[key];

            let btnBg = "bg-white hover:bg-gray-100";
            let btnText = "text-comic-ink";

            if (status === "CORRECT") {
              btnBg = "bg-comic-correct text-white hover:bg-green-600";
              btnText = "text-white";
            } else if (status === "PRESENT") {
              btnBg = "bg-comic-present text-comic-ink hover:bg-yellow-500";
              btnText = "text-comic-ink";
            } else if (status === "ABSENT") {
              btnBg = "bg-comic-absent text-white opacity-70 hover:bg-slate-700";
              btnText = "text-white";
            }

            if (key === "ENTER" || key === "DELETE") {
              btnBg = "bg-comic-yellow hover:bg-yellow-400 font-bold";
            }

            return (
              <button
                key={key}
                disabled={disabled}
                onClick={() => {
                  if (key === "ENTER") onEnter();
                  else if (key === "DELETE") onDelete();
                  else onChar(key);
                }}
                /* Technical Guardrail: minimum 44x44px touch target on mobile */
                className={`min-w-[34px] min-h-[44px] sm:min-w-[44px] sm:min-h-[48px] px-1.5 py-2 font-bangers text-base sm:text-lg border-2 border-comic-ink rounded flex items-center justify-center select-none comic-shadow-sm transition-transform active:translate-y-0.5 disabled:opacity-50 ${btnBg} ${btnText}`}
              >
                {key === "ENTER" ? (
                  <span className="flex items-center gap-0.5 text-xs sm:text-sm font-bold">
                    CEK <CornerDownLeft className="w-3.5 h-3.5" />
                  </span>
                ) : key === "DELETE" ? (
                  <Delete className="w-5 h-5 text-comic-ink" />
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
